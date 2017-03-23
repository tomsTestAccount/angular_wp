"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
require("rxjs/add/operator/map");
var Subject_1 = require("rxjs/Subject");
var rt_rest_service_1 = require("./rt-rest.service");
var lmu_ua_formList_1 = require("../_models/lmu_ua_formList");
var rt_forms_service_1 = require("../_services/rt-forms.service");
var dbgPrint = false;
var dbgPrint_user = false;
var dbgPrint_userId = false;
var dbgPrint_login = false;
var dbgPrint_setFormObj = false;
var dbgPrint_getFormObj = false;
var dbgPrint_handleFormObj = false;
var AuthenticationService = (function () {
    function AuthenticationService(_rtRestService, _lmuForms, _rtFormSrv) {
        this._rtRestService = _rtRestService;
        this._lmuForms = _lmuForms;
        this._rtFormSrv = _rtFormSrv;
        this._authenicated = false;
        this._currentUser = null;
        this._currentFormObj = null;
        this._currentToken = null;
        this._currentUserId = null;
        // Observable string sources for displayname
        this.userDisplayNameSrc = new Subject_1.Subject();
        // Observable string streams
        this.userDisplayName$ = this.userDisplayNameSrc.asObservable();
        //------------------------------------------------------------------------------------------------------------------
        this.progressValue = new Subject_1.Subject();
        this.progressMode = new Subject_1.Subject();
        if (dbgPrint)
            console.log("_authenicated=", this._authenicated);
        if (dbgPrint)
            console.log("_currentUser=", this._currentUser);
        if (dbgPrint)
            console.log("_currentFormObj=", this._currentFormObj);
    }
    AuthenticationService.prototype.getProgressValue = function () {
        return this.progressValue.asObservable();
    };
    AuthenticationService.prototype.setProgressValue = function (newValue) {
        //this.progressValue = newValue;
        this.progressValue.next(newValue);
    };
    AuthenticationService.prototype.getProgressMode = function () {
        return this.progressMode.asObservable();
    };
    AuthenticationService.prototype.setProgressMode = function (newMode) {
        //this.progressValue = newValue;
        if (newMode === 'indeterminate')
            this.setProgressValue(0);
        this.progressMode.next(newMode);
    };
    //------------------------------------------------------------------------------------------------------------------
    AuthenticationService.prototype.login_getToken = function (userId, password) {
        var _this = this;
        //return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
        //this.setProgressValue(0);
        this.setProgressMode('indeterminate');
        return new Promise(function (resolve, reject) {
            _this._rtRestService.restPost_login(userId, password)
                .subscribe(function (response) {
                if (dbgPrint_login)
                    console.log("In auth,response=", response);
                //if (response.token)
                if (response.hasOwnProperty('token')) {
                    var token = response['token'];
                    _this.setCurrentToken_local(token);
                    //this._currentUserId = userId;
                    _this.auth_setCurrentUserId_local(userId);
                    //this.setProgressValue(100);
                    _this.setProgressMode('determinate');
                    resolve(token);
                }
                else
                    reject("Server-Error, response object is invalid");
            }, function (err) {
                // Log errors are catched in REST-Service
                //console.log(err);
                if (dbgPrint_login)
                    console.log("In authService login, User NOT found !!! an uaObj for current user at server, err=", err);
                reject(err);
            }); //.toPromise();
        });
    };
    AuthenticationService.prototype.auth_getUserData = function () {
        var _this = this;
        if (this._currentUserId && this._currentToken) {
            return new Promise(function (resolve, reject) {
                _this._rtRestService.restGet_getUserData(_this._currentUserId, _this._currentToken)
                    .subscribe(function (response) {
                    if (dbgPrint_user)
                        console.log("In auth_getUserData, response=", response);
                    _this.setCurrentUser_local(response);
                    resolve(response);
                }, function (err) {
                    console.log("In auth_getUserData, error=", err);
                    reject(err);
                });
            });
        }
    };
    AuthenticationService.prototype.setDisplayName = function (name) {
        this.userDisplayNameSrc.next(name);
    };
    AuthenticationService.prototype.logout = function () {
        console.log("In authService-logout");
        // remove user from local storage to log user out
        localStorage.setItem('lmu_evfmsd_currentUser', null);
        localStorage.setItem('lmu_evfmsd_token', null);
        localStorage.setItem('currentUaObject', null);
        // Service message commands
        this.setDisplayName("");
        this._currentToken = "";
        this._authenicated = false;
        this._currentFormObj = null;
        this._currentUser = null;
    };
    AuthenticationService.prototype.isAuthenticated = function () {
        if (dbgPrint_user)
            console.log("this._currentUser=", this._currentUser);
        if (dbgPrint_user)
            console.log("this._currentUserId=", this._currentUserId);
        if (dbgPrint_user)
            console.log("this._currentToken=", this._currentToken);
        this.auth_getCurrentUser();
        //within plone: the userId is sufficient
        if (this._currentUserId) {
            this._authenicated = true;
        }
        //within testServer: the token is necessary, and the userObj is helpful to give the name in the header
        if (this._currentUser) {
            //console.log("in isAuthenticated , this._currentUser=",this._currentUser);
            // for reloading page with valid currentUser
            if (this._currentToken) {
                this._authenicated = true;
                if (this._currentUser.fullname.length > 0)
                    this.setDisplayName(this._currentUser.fullname);
                else
                    this.setDisplayName(this._currentUser.username);
            }
        }
        //console.log("In AuthenticationService, isAuthenticated, _authenicated= ",this._authenicated);
        return this._authenicated;
    };
    //-----------------------------------------------------------------------------------------------------------------
    AuthenticationService.prototype.setCurrentUser_local = function (user) {
        var retValue = false;
        if (dbgPrint_user)
            console.log("In AuthenticationService,setCurrentUser_local: user=", user);
        var tempString = user;
        //JSON.stringify(tempString);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('lmu_evfmsd_currentUser', JSON.stringify(tempString));
        this._currentUser = user;
        //if (JSON.parse(localStorage.getItem('currentUser'))) retValue=true;
        if (dbgPrint_user)
            console.log("In AuthenticationService,setCurrentUser_local: this._currentUser=", this._currentUser);
        return retValue;
    };
    AuthenticationService.prototype.setCurrentToken_local = function (token) {
        var retValue = false;
        console.log("In AuthenticationService,setCurrentToken_local: token=", token);
        var tempString = token;
        //JSON.stringify(tempString);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('lmu_evfmsd_token', JSON.stringify(tempString));
        this._currentToken = token;
        //console.log("In AuthenticationService,setCurrentToken_local: token=",this._currentToken);
        return retValue;
    };
    AuthenticationService.prototype.auth_getCurrentUser = function () {
        this._currentUser = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUser')));
        if (dbgPrint_user)
            console.log("In auth_getCurrentUser", this._currentUser);
        return this._currentUser;
    };
    AuthenticationService.prototype.auth_getCurrentUserId = function () {
        this._currentUserId = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUserId')));
        if (dbgPrint_userId)
            console.log("In auth_getCurrentUserId,this._currentUserId=", this._currentUserId);
        return this._currentUserId;
    };
    AuthenticationService.prototype.auth_setCurrentUserId_local = function (userId) {
        this._currentUserId = userId;
        if (dbgPrint_userId)
            console.log("In auth_setCurrentUser,this._currentUserId", this._currentUserId);
        localStorage.setItem('lmu_evfmsd_currentUserId', JSON.stringify(this._currentUserId));
    };
    //-----------------------------------------------------------------------------------------------------------------
    AuthenticationService.prototype.auth_getFormObject = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (dbgPrint_getFormObj)
                console.log("In authService 1,auth_getFormObject,this._currentFormObj=", _this._currentFormObj);
            if (dbgPrint_getFormObj)
                console.log("In authService 1,auth_getFormObject,localStorage.getItem('currentUaObject'=", localStorage.getItem('currentUaObject'));
            if ((!_this._currentFormObj)
                || (_this._currentFormObj === null)
                || (typeof _this._currentFormObj !== 'object')
                || (Object.keys(_this._currentFormObj).length === 0)) {
                var tmpUa = localStorage.getItem('currentUaObject');
                if ((!tmpUa)
                    || (tmpUa === null)
                    || (typeof tmpUa !== 'object')
                    || (Object.keys(tmpUa).length === 0)) {
                    if (dbgPrint_getFormObj)
                        console.log("tmpUa 1=", tmpUa);
                    // return new Promise((resolve, reject) => {
                    _this.auth_getFormObject_Server(_this._currentUserId)
                        .then(function (response) {
                        if (response) {
                            if (dbgPrint_getFormObj)
                                console.log("In auth_getFormObject,after auth_getFormObject_Server response=", response, "this._currentFormObj=", _this._currentFormObj);
                            _this.auth_setFormObj(_this._currentFormObj);
                            resolve(_this._currentFormObj);
                        }
                        /*else {
                         }
                         if (dbgPrint_getFormObj) console.log("In auth_getFormObject,after auth_getFormObject_Server response=", response);
                         //this.auth_setFormObj({});
                         */
                    })
                        .catch(function (exp) {
                        console.log("in auth_getFormObject, error at auth_getFormObject_Server , err=", exp);
                        //this.auth_setFormObj({});
                        //return {};
                        resolve({});
                    });
                }
                else {
                    //this.auth_setFormObj(tmpUa);
                    _this._currentFormObj = JSON.parse(tmpUa);
                    resolve(_this._currentFormObj);
                }
            }
            else
                resolve(_this._currentFormObj);
        });
    };
    //to get valid formObject to work with on client-site (subFormGroup)
    AuthenticationService.prototype.auth_handleFormObject4localWorking = function (formObjFromServer) {
        if (dbgPrint_handleFormObj)
            console.log("In auth_handleFormObject4localWorking formObjFromServer=", formObjFromServer);
        var uaObject = {
            subFormGroup_apd: {},
            subFormGroup_ac: {},
            subFormGroup_ac2: {},
            subFormGroup_oi: {},
        };
        //check if formObject is valid
        if ((typeof formObjFromServer === 'object') && (Object.keys(formObjFromServer).length !== 0)) {
            console.log("formObjFromServer", formObjFromServer);
            for (var p in formObjFromServer) {
                //console.log("p=",p);
                this._lmuForms.set_formEntryValue(p.toString(), formObjFromServer[p]);
            }
            this._rtFormSrv.subFormsUpdated(true);
            //let formEntries_ac = this._lmuForms.get_form_ac();
            uaObject = {
                subFormGroup_apd: {
                    firstname: formObjFromServer.firstname,
                    lastname: formObjFromServer.lastname,
                    gender: formObjFromServer.gender,
                    dateOfbirth: formObjFromServer.dateOfbirth,
                    nationality: formObjFromServer.nationality,
                    street: formObjFromServer.street,
                    postalcode: formObjFromServer.postalcode,
                    residence: formObjFromServer.residence,
                    country: formObjFromServer.country,
                    phone: formObjFromServer.phone,
                    phone2: formObjFromServer.phone2,
                    email: formObjFromServer.email,
                    email2: formObjFromServer.email2,
                    homepage: formObjFromServer.homepage,
                },
                subFormGroup_ac: {
                    ac_education: formObjFromServer.ac_education,
                    ac_institution: formObjFromServer.ac_institution,
                    ac_level: formObjFromServer.ac_level,
                    copy_of_tor: formObjFromServer.copy_of_tor,
                },
                subFormGroup_ac2: {},
                subFormGroup_oi: {},
            };
        }
        else {
            console.log("formObjFromServer is empty!!!!");
            uaObject = {
                subFormGroup_apd: {},
                subFormGroup_ac: {},
                subFormGroup_ac2: {},
                subFormGroup_oi: {},
            };
        }
        return uaObject;
    };
    ;
    AuthenticationService.prototype.auth_getFormObject_Server = function (currentUserId) {
        var _this = this;
        if (dbgPrint_getFormObj)
            console.log("1 In  rt-auth-service: auth_getFormObject_Server ,this._currentUserId=", this._currentUserId);
        var retValue = false;
        this._currentUserId = 'mueller'; //Todo
        return new Promise(function (resolve, reject) {
            _this._rtRestService.restGet_formObject(_this._currentUserId, _this._currentToken)
                .subscribe(function (response) {
                // if (dbgPrint_getFormObj) console.log("In auth_getFormObject_Server after rest-call, response=",response);
                var uaObject = response; //JSON.parse(response);
                if (dbgPrint_getFormObj)
                    console.log("In auth_getFormObject_Server after rest-call, uaObject=", uaObject);
                /*
                if (!uaObject || Object.keys(uaObject).length === 0)  //NO object found at server
                {

                    uaObject = {
                        subFormGroup_apd: {},
                        subFormGroup_ac: {},
                        subFormGroup_ac2: {},
                        subFormGroup_oi: {},
                    }

                    if (dbgPrint_getFormObj) console.log("1 NOT found !!! an uaObj for current user at server");
                }
                else {

                    let tmpObj: any = uaObject;
                    //uaObject = JSON.parse(tmpObj);

                    if (dbgPrint_getFormObj) console.log("Found uaObj for current user at server, =", uaObject);

                    if (typeof uaObject !== 'object') {
                        uaObject = {
                            subFormGroup_apd: {},
                            subFormGroup_ac: {},
                            subFormGroup_ac2: {},
                            subFormGroup_oi: {},
                        }

                        if (dbgPrint_getFormObj) console.log("Found uaObj for current user at server,but s not an object.\ " +
                            "So we have redefine it=", uaObject);

                    }



                }
                 */
                var sortedUaObject = _this.auth_handleFormObject4localWorking(uaObject);
                _this.auth_setFormObj(sortedUaObject);
                resolve(true);
            }, function (err) {
                // Log errors are catched in REST-Service
                //console.log(err);
                if (dbgPrint_getFormObj)
                    console.log("2 NOT found !!! an uaObj for current user at server, err=", err);
                reject(false);
            });
        });
    };
    //------------------------------------------------------------------------------------------------------------
    AuthenticationService.prototype.auth_setFormObj = function (uaObj, sendToServer) {
        //console.log("In authService, auth_setFormObj 1:given uaObj=",uaObj);
        if (sendToServer === void 0) { sendToServer = false; }
        var tmpUaObj = "";
        if (uaObj.subFormGroup_apd[0] != undefined)
            tmpUaObj = uaObj.subFormGroup_apd[0];
        else
            tmpUaObj = uaObj; //.subFormGroup_apd;
        if (typeof tmpUaObj !== 'object')
            uaObj = JSON.parse(tmpUaObj);
        this._currentFormObj = tmpUaObj;
        if (dbgPrint_setFormObj)
            console.log("In authService, auth_setFormObj 2 ,tmpUaObj=", tmpUaObj);
        //Important --> localStorage use json-format
        var tmpString = JSON.stringify(tmpUaObj);
        tmpString = tmpString.replace(/\//g, '-');
        if (dbgPrint_setFormObj)
            console.log("In auth_setFormObj, tmpString", tmpString);
        //this._currentUser['uaObj'] = tmpString;
        //this.setCurrentUser_local(this._currentUser);
        //let tmpString = this._currentFormObj;
        localStorage.setItem('currentUaObject', tmpString); //JSON.stringify(tmpString));
        if (sendToServer)
            this.auth_setFormObj_Server(tmpString);
    };
    AuthenticationService.prototype.auth_setFormObj_Server = function (stringifyObj) {
        //var localStorage_formObj = localStorage.getItem('currentUaObject');
        this._rtRestService.restPatch_formObject(this._currentUserId, this._currentToken, this._currentFormObj)
            .subscribe(function (data) { console.log("set UaObj to server successfull with data=", data); }, //this.data = data, // Reach here if res.status >= 200 && <= 299
        function (err) { console.log("set UaObj to server failure , err=", err); }); // Reach here if fails;
        /*
        if (dbgPrint_setFormObj) console.log("In auth_setFormObj_Server this._currentUser",this._currentUser);
        if (dbgPrint_setFormObj) console.log("In auth_setFormObj_Server stringifyObj=",stringifyObj);

        this._rtRestService.restPost_setUaObject(this._currentUser,stringifyObj)
            .subscribe(
                (data) => {console.log("set UaObj to server successfull with data=",data)}, //this.data = data, // Reach here if res.status >= 200 && <= 299
                (err) => {console.log("set UaObj to server failure , err=",err)}); // Reach here if fails;
*/
    };
    return AuthenticationService;
}());
AuthenticationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [rt_rest_service_1.RestService,
        lmu_ua_formList_1.lmu_ua_formList,
        rt_forms_service_1.RtFormService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        if (dbgPrint)
            console.log("in AuthGuard, checklogin, this.authService.isAuthenticated()= ", this.authService.isAuthenticated());
        if (this.authService.isAuthenticated()) {
            return true;
        }
        else {
            //console.log("in AuthGuard, checklogin : false");
            // Store the attempted URL for redirecting
            //this.authService.redirectUrl = url;
            // Navigate to the login page with extras
            this.router.navigate(['/login', 'in']);
            return false;
        }
    };
    return AuthGuard;
}());
AuthGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [AuthenticationService, router_1.Router])
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=rt-authentication.service.js.map