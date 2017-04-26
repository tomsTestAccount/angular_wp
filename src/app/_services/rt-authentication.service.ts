import { Injectable } from '@angular/core';

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

import {RtFormService} from '../_services/rt-forms.service'


//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_lifecyclehooks = false;
const dbgPrint = false;
const dbgPrint_user = false;
const dbgPrint_userId = false;
const dbgPrint_login = false;
const dbgPrint_setFormObj = false;
const dbgPrint_getFormObj = false;

//----------------------------------------------------------------------------------------------------------------------

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
               //,private _lmuForms : lmu_ua_formList
                ,private _rtFormSrv: RtFormService
    ){

        if (dbgPrint_lifecyclehooks) console.log("In authService constructor");
        if (dbgPrint) console.log("_authenicated=",this._authenicated);
        if (dbgPrint)  console.log("_currentUser=",this._currentUser);
        if (dbgPrint)  console.log("_currentFormObj=",this._currentFormObj);
    }


    //------------------------------------------------------------------------------------------------------------------


    //------------------------------------------------------------------------------------------------------------------
    //TODO: it's modal or 'home'-site stuff  --> put it in another file

    private progressValue: Subject<number> = new Subject<number>();

    public getProgressValue(): Observable<number> {
        return this.progressValue.asObservable();
    }

    public setProgressValue(newValue: number): void {
        //this.progressValue = newValue;
        this.progressValue.next(newValue);
    }

    private progressMode: Subject<string> = new Subject<string>();

    public getProgressMode(): Observable<string> {
        return this.progressMode.asObservable();
    }

    public setProgressMode(newMode: string): void {
        //this.progressValue = newValue;
        if (newMode === 'indeterminate') this.setProgressValue(0);
        this.progressMode.next(newMode);
    }
    //------------------------------------------------------------------------------------------------------------------


    public login_getToken(userId: string, password: string):any {
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
                    console.log("In authService login, User NOT found !!! an uaObj for current user at server, err=",err);

                    reject(err);
                }); //.toPromise();
        });
    }

    public auth_getUserData():any {
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

    public setDisplayName(name: string) {
        this.userDisplayNameSrc.next(name);
    }

    public cleanAtlogout() {

        if (dbgPrint_login) console.log("In authService-logout");

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
        this._currentUserId = null;
    }

    public isAuthenticated() {

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

    public setCurrentUser_local(user:string):boolean{

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

    public setCurrentToken_local(token:string):boolean{

        let retValue=false;
        if (dbgPrint_login) console.log("In AuthenticationService,setCurrentToken_local: token=",token);

        let tempString = token;
        //JSON.stringify(tempString);
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('lmu_evfmsd_token',JSON.stringify(tempString) );

        this._currentToken = token;


        //console.log("In AuthenticationService,setCurrentToken_local: token=",this._currentToken);

        return retValue;
    }

    public auth_getCurrentToken():any {
        return this._currentToken;
    }

    public auth_getCurrentUser():any {

        this._currentUser = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUser')));

        if (dbgPrint_user) console.log("In auth_getCurrentUser",this._currentUser);
        return this._currentUser;
    }

    public auth_getCurrentUserId():any {

        this._currentUserId = (JSON.parse(localStorage.getItem('lmu_evfmsd_currentUserId')));

        if (dbgPrint_userId) console.log("In auth_getCurrentUserId,this._currentUserId=",this._currentUserId);
        return this._currentUserId;
    }

    public auth_setCurrentUserId_local(userId:string):any {

        this._currentUserId = userId;
        if (dbgPrint_userId) console.log("In auth_setCurrentUser,this._currentUserId",this._currentUserId);
        localStorage.setItem('lmu_evfmsd_currentUserId',JSON.stringify(this._currentUserId));

    }

    //-----------------------------------------------------------------------------------------------------------------

    //TODO: put formObject getter/setter in special file

    public auth_getFormObject():Promise<Object> {

        return new Promise((resolve, reject) => {

            if (dbgPrint_getFormObj) console.log("In authService 1,auth_getFormObject,this._currentFormObj=", this._currentFormObj);

            if ( (!this._currentFormObj)
                || (this._currentFormObj === null)
                || (typeof this._currentFormObj !== 'object')
                || (Object.keys(this._currentFormObj).length === 0)) {

                    //return new Promise((resolve, reject) => {
                        this._auth_getFormObject_Server(this._currentUserId)
                            .then(responseConvert4Local => {

                                    //this.auth_setFormObj(this._currentFormObj);
                                    this._currentFormObj = responseConvert4Local;

                                    if (dbgPrint_getFormObj) {
                                        console.log("In auth_getFormObject,after auth_getFormObject_Server response,this._currentFormObj=", this._currentFormObj);
                                    }

                                    resolve(responseConvert4Local);
                            })
                            .catch(err => {
                                    console.log("ERROR in auth_getFormObject, error at auth_getFormObject_Server , err=", err);
                                    reject(err);
                                }
                            );
                    //});

                //});
                /*
                else //found valid obj for currentUser in localStorage
                {
                    //this.auth_setFormObj(tmpUa);
                    //this._currentFormObj = JSON.parse(tmpUa);
                    resolve(this._currentFormObj);
                }
                */
            }
            else resolve(this._currentFormObj);
        });

    }

    private _auth_getFormObject_Server(currentUserId:string):any{

        if (dbgPrint_getFormObj)  console.log("1 In  rt-auth-service: auth_getFormObject_Server ,this._currentUserId=",this._currentUserId);

        let retValue=false;

        //this._currentUserId = 'mueller'; //Todo

        return new Promise((resolve, reject) => {
            this._rtRestService.restGet_formObject(this._currentUserId, this._currentToken)
                .subscribe(
                    (response) => {

                        if (dbgPrint_getFormObj)console.log("In auth_getFormObject_Server after rest-call, response=",response);

                        //var convertedUaObject = this._lmuForms.handleServerFormObject4localWorking(response);

                        var convertedUaObject = this._rtFormSrv.handleServerFormObject4localWorking(response);

                        //this._rtFormSrv.subFormsUpdated(true);

                        resolve(convertedUaObject);
                    },
                    (err) => {
                        // Log errors are catched in REST-Service
                        //console.log(err);
                        //console.log("2 NOT found !!! an uaObj for current user at server, err=",err);
                        console.log("Err in auth_getFormObject_Server for restGet_formObject",err);

                        reject(err);
                    });


        });

    };


    //------------------------------------------------------------------------------------------------------------


    //TODO: put formObject getter/setter in special file

    auth_setFormObj(uaObjLocal:any,sendToServer:boolean=false):any {
        if (dbgPrint_setFormObj) console.log("In authService, auth_setFormObj 1:given uaObj=",uaObjLocal);

        this._currentFormObj = uaObjLocal;

        //Important --> localStorage use json-format (-->stringify)  !!!!We can't do that anymore , cause of user qouta --> fileUpload in uaFormObject !!!
        /*
            let tmpLocalObjString: string = JSON.stringify(uaObjLocal);

            if (dbgPrint_setFormObj) console.log("In auth_setFormObj, tmpLocalObjString",tmpLocalObjString);

            localStorage.setItem('currentUaObject', tmpLocalObjString );
        */

        //let uaObj4Server = this._lmuForms.handleFormObject2SendToServer(uaObjLocal);

        let uaObj4Server = this._rtFormSrv.handleFormObject2SendToServer(uaObjLocal);


        //if (dbgPrint_setFormObj)
            console.log("In authService, auth_setFormObj 2 ,uaObj4Server=",uaObj4Server);

        if (sendToServer) return this.auth_setFormObj_Server(uaObj4Server);

    }


    private auth_setFormObj_Server(obj2Server?:any):any {

       // var localObj = localStorage.getItem('currentUaObject');
        return new Promise((resolve, reject) => {
            if (Object.keys(obj2Server).length === 0) {
                console.log("ERROR in auth_setFormObj_Server, localObj is empty !!!!");
                reject("Nothing is sent because no changes were detected for obj to sent !");
            }
            else {

                this._rtRestService.restPatch_formObject(this._currentUserId, this._currentToken, obj2Server)
                    .subscribe(
                        (data) => {
                            console.log("set UaObj to server successfull with data=", data);
                            resolve(data);
                        }, //this.data = data, // Reach here if res.status >= 200 && <= 299
                        (err) => {
                            console.log("set UaObj to server failure , err=", err);
                            reject(err);
                        }); // Reach here if fails;
            }
        });

    }


    //------------------------------------------------------------------------------------------------------------

    auth_deleteFile_Server(fileId:string)
    {
        this._rtRestService.restDelete_File(this._currentUserId,this._currentToken,fileId)
            .subscribe(
                (data) => {console.log("delete obj=",fileId," from server successfull")}, //this.data = data, // Reach here if res.status >= 200 && <= 299
                (err) => {console.log("delete obj=",fileId," from server failure , err=",err)}); // Reach here if fails;

    }

    //---------------------------------------------------------------------------------------------------------------

    public auth_downloadFile_devEnv(fileObj:any)
    {
        console.log("this._currentToken = ",this._currentToken);

        this._rtRestService.restDownload_File(this._currentUserId,this._currentToken,fileObj)
            .subscribe(
                (data) => {console.log("donwload data=",data," from server successfull")}, //this.data = data, // Reach here if res.status >= 200 && <= 299
                (err) => {console.log("donwload for fileObj=",fileObj," from server failure , err=",err)}); // Reach here if fails;
    }

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



