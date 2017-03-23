import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
}  from '@angular/router';


import 'rxjs/add/operator/map'
import { Subject }    from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription }   from 'rxjs/Subscription';
import {RestService} from './rt-rest.service';

import {lmu_ua_formList} from '../_models/lmu_ua_formList'
import {RtFormService} from '../_services/rt-forms.service'



const dbgPrint = false;
const dbgPrint_user = false;
const dbgPrint_userId = false;
const dbgPrint_login = false;
const dbgPrint_setFormObj = false;
const dbgPrint_getFormObj = false;
const dbgPrint_handleFormObj = false;

@Injectable()
export class AuthenticationService {


    private _authenicated: boolean  = false;
    private _currentUser: any = null ;
    private _currentFormObj: any = null;

    private _currentToken : any = null;
    private _currentUserId : string = null;

    // Observable string sources for displayname
    private userDisplayNameSrc = new Subject<string>();
    subscription: Subscription;


    // Observable string streams
    userDisplayName$ = this.userDisplayNameSrc.asObservable();

    constructor(private _rtRestService : RestService
               ,private _lmuForms : lmu_ua_formList
                ,private _rtFormSrv: RtFormService
    ){


        if (dbgPrint) console.log("_authenicated=",this._authenicated);
        if (dbgPrint)  console.log("_currentUser=",this._currentUser);
        if (dbgPrint)  console.log("_currentFormObj=",this._currentFormObj);
    }

    //------------------------------------------------------------------------------------------------------------------
    private progressValue: Subject<number> = new Subject<number>();

    getProgressValue(): Observable<number> {
        return this.progressValue.asObservable();
    }

    setProgressValue(newValue: number): void {
        //this.progressValue = newValue;
        this.progressValue.next(newValue);
    }

    private progressMode: Subject<string> = new Subject<string>();

    getProgressMode(): Observable<string> {
        return this.progressMode.asObservable();
    }

    setProgressMode(newMode: string): void {
        //this.progressValue = newValue;
        if (newMode === 'indeterminate') this.setProgressValue(0);
        this.progressMode.next(newMode);
    }
    //------------------------------------------------------------------------------------------------------------------


    login_getToken(userId: string, password: string):any {
        //return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
        //this.setProgressValue(0);
        this.setProgressMode('indeterminate');

        return new Promise((resolve, reject) =>
        {

            this._rtRestService.restPost_login(userId,password)
                .subscribe(response => {

                    if (dbgPrint_login) console.log("In auth,response=", response);

                    //if (response.token)
                    if (response.hasOwnProperty('token'))
                    {
                        let token = response['token'];
                        this.setCurrentToken_local(token);
                        //this._currentUserId = userId;
                        this.auth_setCurrentUserId_local(userId);

                        //this.setProgressValue(100);
                        this.setProgressMode('determinate');

                        resolve(token);
                    }else reject("Server-Error, response object is invalid");
                },err => {
                    // Log errors are catched in REST-Service
                    //console.log(err);
                    if (dbgPrint_login) console.log("In authService login, User NOT found !!! an uaObj for current user at server, err=",err);

                    reject(err);
                }); //.toPromise();
        });
    }


    auth_getUserData():any
    {
        if (this._currentUserId && this._currentToken)
        {
            return new Promise((resolve, reject) => {
                this._rtRestService.restGet_getUserData(this._currentUserId, this._currentToken)
                    .subscribe(response => {

                        if (dbgPrint_user) console.log("In auth_getUserData, response=", response);
                        this.setCurrentUser_local(response);
                        resolve(response);

                    }, err => {
                        console.log("In auth_getUserData, error=", err);
                        reject(err);
                    });
            });
        }
    }

    setDisplayName(name: string) {
        this.userDisplayNameSrc.next(name);
    }


    logout()
    {

        console.log("In authService-logout");

        // remove user from local storage to log user out
        localStorage.setItem('lmu_evfmsd_currentUser',null);
        localStorage.setItem('lmu_evfmsd_token',null);
        localStorage.setItem('currentUaObject', null );
        // Service message commands
        this.setDisplayName("");
        this._currentToken = "";
        this._authenicated = false;
        this._currentFormObj = null;
        this._currentUser = null;
    }

    isAuthenticated()
    {

        if (dbgPrint_user) console.log("this._currentUser=",this._currentUser);
        if (dbgPrint_user) console.log("this._currentUserId=",this._currentUserId);
        if (dbgPrint_user) console.log("this._currentToken=",this._currentToken);

        this.auth_getCurrentUser();

        //within plone: the userId is sufficient
        if (this._currentUserId) {
            this._authenicated = true;
        }

        //within testServer: the token is necessary, and the userObj is helpful to give the name in the header
        if (this._currentUser)
        {
            //console.log("in isAuthenticated , this._currentUser=",this._currentUser);

            // for reloading page with valid currentUser
            if (this._currentToken)
            {
                this._authenicated = true;
                if (this._currentUser.fullname.length > 0) this.setDisplayName(this._currentUser.fullname);
                else this.setDisplayName(this._currentUser.username);
            }
        }
        //console.log("In AuthenticationService, isAuthenticated, _authenicated= ",this._authenicated);

        return this._authenicated;
    }

    //-----------------------------------------------------------------------------------------------------------------

    setCurrentUser_local(user:string):boolean{

        let retValue=false;
        if (dbgPrint_user) console.log("In AuthenticationService,setCurrentUser_local: user=",user);

        let tempString = user;
        //JSON.stringify(tempString);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('lmu_evfmsd_currentUser',JSON.stringify(tempString) );

        this._currentUser = user;

        //if (JSON.parse(localStorage.getItem('currentUser'))) retValue=true;

        if (dbgPrint_user) console.log("In AuthenticationService,setCurrentUser_local: this._currentUser=",this._currentUser);

        return retValue;
    }

    setCurrentToken_local(token:string):boolean{

        let retValue=false;
        console.log("In AuthenticationService,setCurrentToken_local: token=",token);

        let tempString = token;
        //JSON.stringify(tempString);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('lmu_evfmsd_token',JSON.stringify(tempString) );

        this._currentToken = token;


        //console.log("In AuthenticationService,setCurrentToken_local: token=",this._currentToken);

        return retValue;
    }

    auth_getCurrentUser():any
    {

        this._currentUser = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUser')));

        if (dbgPrint_user) console.log("In auth_getCurrentUser",this._currentUser);
        return this._currentUser;
    }

    auth_getCurrentUserId():any
    {

        this._currentUserId = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUserId')));

        if (dbgPrint_userId) console.log("In auth_getCurrentUserId,this._currentUserId=",this._currentUserId);
        return this._currentUserId;
    }

    auth_setCurrentUserId_local(userId:string):any
    {

        this._currentUserId = userId;
        if (dbgPrint_userId) console.log("In auth_setCurrentUser,this._currentUserId",this._currentUserId);
        localStorage.setItem('lmu_evfmsd_currentUserId',JSON.stringify(this._currentUserId));

    }

    //-----------------------------------------------------------------------------------------------------------------



    auth_getFormObject():any
    {



        return new Promise((resolve, reject) => {
            if (dbgPrint_getFormObj) console.log("In authService 1,auth_getFormObject,this._currentFormObj=", this._currentFormObj);

            if (dbgPrint_getFormObj) console.log("In authService 1,auth_getFormObject,localStorage.getItem('currentUaObject'=", localStorage.getItem('currentUaObject'));

            if ((!this._currentFormObj)
                || (this._currentFormObj === null)
                || (typeof this._currentFormObj !== 'object')
                || (Object.keys(this._currentFormObj).length === 0)) {

                let tmpUa = localStorage.getItem('currentUaObject');

                if ((!tmpUa)
                    || (tmpUa === null)
                    || (typeof tmpUa !== 'object')
                    || (Object.keys(tmpUa).length === 0)) {

                    if (dbgPrint_getFormObj) console.log("tmpUa 1=", tmpUa);

                   // return new Promise((resolve, reject) => {
                        this.auth_getFormObject_Server(this._currentUserId)
                            .then(response => {
                                if (response) {

                                    if (dbgPrint_getFormObj) console.log("In auth_getFormObject,after auth_getFormObject_Server response=",
                                        response, "this._currentFormObj=", this._currentFormObj);
                                    this.auth_setFormObj(this._currentFormObj);
                                    resolve(this._currentFormObj);
                                }
                                /*else {
                                 }
                                 if (dbgPrint_getFormObj) console.log("In auth_getFormObject,after auth_getFormObject_Server response=", response);
                                 //this.auth_setFormObj({});
                                 */
                            })
                            .catch(exp => {
                                    console.log("in auth_getFormObject, error at auth_getFormObject_Server , err=", exp);
                                    //this.auth_setFormObj({});
                                    //return {};
                                    resolve({});
                                }
                            );
                    //});

                }
                else //found valid obj for currentUser in localStorage
                {
                    //this.auth_setFormObj(tmpUa);
                    this._currentFormObj = JSON.parse(tmpUa);
                    resolve(this._currentFormObj);
                }
            }
            else resolve(this._currentFormObj);
        });

    }

    //to get valid formObject to work with on client-site (subFormGroup)
    private auth_handleFormObject4localWorking(formObjFromServer:any) {

        if (dbgPrint_handleFormObj) console.log("In auth_handleFormObject4localWorking formObjFromServer=",formObjFromServer);



        var uaObject = {
                subFormGroup_apd: {},
                subFormGroup_ac: {},
                subFormGroup_ac2: {},
                subFormGroup_oi: {},
            };
            //check if formObject is valid
            if ((typeof formObjFromServer === 'object') && (Object.keys(formObjFromServer).length !== 0))
            {

                console.log("formObjFromServer",formObjFromServer);
                for (var p in formObjFromServer)
                {
                    //console.log("p=",p);
                    this._lmuForms.set_formEntryValue(p.toString(),formObjFromServer[p]);
                }


                this._rtFormSrv.subFormsUpdated(true);

                //let formEntries_ac = this._lmuForms.get_form_ac();


                uaObject = {
                    subFormGroup_apd: {
                        firstname:formObjFromServer.firstname,
                        lastname:formObjFromServer.lastname,
                        gender:formObjFromServer.gender,
                        dateOfbirth:formObjFromServer.dateOfbirth,
                        nationality:formObjFromServer.nationality,
                        street:formObjFromServer.street,
                        postalcode:formObjFromServer.postalcode,
                        residence:formObjFromServer.residence,
                        country:formObjFromServer.country,
                        phone:formObjFromServer.phone,
                        phone2:formObjFromServer.phone2,
                        email:formObjFromServer.email,
                        email2:formObjFromServer.email2,
                        homepage:formObjFromServer.homepage,
                    },
                    subFormGroup_ac: {




                        ac_education:formObjFromServer.ac_education,
                        ac_institution:formObjFromServer.ac_institution,
                        ac_level:formObjFromServer.ac_level,
                        copy_of_tor:formObjFromServer.copy_of_tor,
                        //degree_conferral_date: degree_conferral_date,
                        //copy_of_certificate: copy_of_certificate,


                    },

                    subFormGroup_ac2: {},
                    subFormGroup_oi: {},

                }


            }
            else
            {
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

    private auth_getFormObject_Server(currentUserId:string):any{

        if (dbgPrint_getFormObj)  console.log("1 In  rt-auth-service: auth_getFormObject_Server ,this._currentUserId=",this._currentUserId);

        let retValue=false;

        this._currentUserId = 'mueller'; //Todo

        return new Promise((resolve, reject) => {
            this._rtRestService.restGet_formObject(this._currentUserId, this._currentToken)
                .subscribe(
                    response => {


                       // if (dbgPrint_getFormObj) console.log("In auth_getFormObject_Server after rest-call, response=",response);

                        let uaObject = response; //JSON.parse(response);


                        if (dbgPrint_getFormObj) console.log("In auth_getFormObject_Server after rest-call, uaObject=",uaObject);




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

                        var sortedUaObject = this.auth_handleFormObject4localWorking(uaObject);
                        this.auth_setFormObj(sortedUaObject);
                        resolve(true);
                    },
                    err => {
                        // Log errors are catched in REST-Service
                        //console.log(err);
                        if (dbgPrint_getFormObj) console.log("2 NOT found !!! an uaObj for current user at server, err=",err);

                        reject(false);
                    });
        });

    }

    //------------------------------------------------------------------------------------------------------------

    auth_setFormObj(uaObj:any,sendToServer:boolean=false)
    {
        //console.log("In authService, auth_setFormObj 1:given uaObj=",uaObj);

        var tmpUaObj = "";
        if (uaObj.subFormGroup_apd[0] != undefined) tmpUaObj = uaObj.subFormGroup_apd[0];
        else tmpUaObj = uaObj;   //.subFormGroup_apd;

        if (typeof tmpUaObj !== 'object') uaObj = JSON.parse(tmpUaObj) ;

        this._currentFormObj = tmpUaObj;

        if (dbgPrint_setFormObj)console.log("In authService, auth_setFormObj 2 ,tmpUaObj=",tmpUaObj);


        //Important --> localStorage use json-format
            let tmpString: string = JSON.stringify(tmpUaObj);
            tmpString = tmpString.replace(/\//g, '-');
            if (dbgPrint_setFormObj) console.log("In auth_setFormObj, tmpString",tmpString);

            //this._currentUser['uaObj'] = tmpString;
            //this.setCurrentUser_local(this._currentUser);


            //let tmpString = this._currentFormObj;

            localStorage.setItem('currentUaObject', tmpString );//JSON.stringify(tmpString));


        if (sendToServer) this.auth_setFormObj_Server(tmpString);

    }

    private auth_setFormObj_Server(stringifyObj)
    {

        //var localStorage_formObj = localStorage.getItem('currentUaObject');

        this._rtRestService.restPatch_formObject(this._currentUserId,this._currentToken,this._currentFormObj)
            .subscribe(
                (data) => {console.log("set UaObj to server successfull with data=",data)}, //this.data = data, // Reach here if res.status >= 200 && <= 299
                (err) => {console.log("set UaObj to server failure , err=",err)}); // Reach here if fails;

        /*
        if (dbgPrint_setFormObj) console.log("In auth_setFormObj_Server this._currentUser",this._currentUser);
        if (dbgPrint_setFormObj) console.log("In auth_setFormObj_Server stringifyObj=",stringifyObj);

        this._rtRestService.restPost_setUaObject(this._currentUser,stringifyObj)
            .subscribe(
                (data) => {console.log("set UaObj to server successfull with data=",data)}, //this.data = data, // Reach here if res.status >= 200 && <= 299
                (err) => {console.log("set UaObj to server failure , err=",err)}); // Reach here if fails;
*/
    }


    //------------------------------------------------------------------------------------------------------------




}


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;

        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

        if (dbgPrint) console.log("in AuthGuard, checklogin, this.authService.isAuthenticated()= ", this.authService.isAuthenticated());

        if (this.authService.isAuthenticated()) { return true; }
        else {

            //console.log("in AuthGuard, checklogin : false");

            // Store the attempted URL for redirecting
            //this.authService.redirectUrl = url;

            // Navigate to the login page with extras
            this.router.navigate(['/login','in']);
            return false;
        }
    }
}



