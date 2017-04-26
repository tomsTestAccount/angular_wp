import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User4Create } from '../_models/user';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/observable/throw';

import {ServerConfigs} from '../_models/configFile';

const dbgPrint_getUser = false;
const dbgPrint = false;

@Injectable()
export class RestService {

    public serverURL : string;
    public host : string;
    public userId:string;
    public onDevEnv:boolean = false;
    private runningConfs:any;

    constructor(private http: Http, serverConfs: ServerConfigs)
    {
        this.runningConfs = serverConfs;
        this.serverURL = this.runningConfs.get_serverConfigs().url;
        //this._currentUserId = 'mueller';
        this.userId = this.runningConfs.get_serverConfigs().userId;

        this.onDevEnv = this.runningConfs.onDevelopmentEnv;

        if (dbgPrint) console.log("serverURL=",this.serverURL);
    }

    /********************************************************************************************************************/

    /*
    private onDevelopment = new Subject<boolean>();
    onDevelopment$ = this.onDevelopment.asObservable();

    // Service command
    set_onDevelopment(val: boolean) {
        this.onDevelopment.next(val);
    }
    */

	/*********************************** PLONE-RESTAPI **************************************************************/


    //var serverURL = ServerConfigs.restServer;

    //create user
    restPost_create(newUser: User4Create) {

        let body = JSON.stringify(newUser);
        /*({

            email:newUser.email,
            lastName:newUser.lastName,
            firstName:newUser.firstName,
            password:newUser.password
        })
        */

        //console.log("In restPost_login, this.serverURL= ",this.serverURL,body);

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-type', 'application/json');

        //console.log("body",body);
        //this.serverURL = this._location.path();

        return this.http.post(this.serverURL + '/@users'                               //req
            ,body                                                                      //body
            ,{headers:headers}                                                         //header
        ).map((response: Response) => response.json());
        //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restPost_create" '));
    }


    //login - post
    restPost_login(userId:string,password:string): Observable<{}> {

        if (this.userId.length == 0) this.runningConfs.set_userId(userId);

        let bodyContent = {login: userId, password: password};

        let body = JSON.stringify(bodyContent);

        //console.log("In restPost_login, this.serverURL= ",this.serverURL,body);

        let headers = new Headers();
        headers.append('Accept', '*,application/json');
        headers.append('Content-type', 'application/json');
        //headers.append('Content-type', 'application/json');
        //headers.append('Content-type', 'application/json');

        return this.http.post(this.serverURL + '/@login',
        body                    //body
        ,{ headers: headers }//headers//,this.jwt()                                            //header
        )// ...and calling .json() on the response to return data
            .map((response: Response) => response.json())
        //...errors if any
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error for "restPost_login" '))
        ;
    }


    //get user application form entries -get
    restGet_getUserData(userId: string,token:string):Observable<any> {

        if (!userId) userId = this.userId;

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        //headers.append('Content-type', 'application/json');
        headers.append('Authorization','Bearer ' + token);

        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.get(this.serverURL + '/@users/'              //url req-main
            + userId                                                                        //url req-sub
            ,{headers:headers}                          //({headers: new Headers({'Authorization':token}) }) //({'Authorization':'Bearer ' + token})                                          //header
            //.retry(1)
        ).map((response: Response) => response.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
        ;

    }

    //update user
    restPatch_updateUserdata(userId: string,token:string,userData:any):Observable<any> {

        if (!userId) userId = this.userId;

        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        if (token) headers.append('Authorization','Bearer ' + token);

        let body = JSON.stringify(userData);

        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.patch(this.serverURL + '/@users/'                                        //url req-main
            + userId                                                                                                    //url req-sub
            ,body                                                                            //(userData)                                                                        //body
            ,{headers:headers} //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
            //.retry(1)
        ).map((response: Response) => response.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
            ;

    }


    //get user application form entries

    restGet_formObject(userId: string, token:string):Observable<{}> {

        if (!userId) userId = this.userId;

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        if (token) headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '

        if (dbgPrint_getUser) console.log("in restService,restGet_formObject: userId=",userId);

        return this.http.get(this.serverURL + '/applications/'+ userId +'/'+userId              //url req-main
                                                                            //url req-sub
            ,{headers:headers}                                     //header
        )   .map((response: Response) => response.json())
            //.catch((error:any) =>  Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData"! See Debug-Console for more Information '))
            ;
    }

    //patch user application form entries
    restPatch_formObject(userId: string,token:string,form:any):Observable<any> {

        if (!userId) userId = this.userId;

        let headers = new Headers();
        //headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '

        //let body = JSON.stringify(form);
        //TODO: check if valid JSON
        let body = form;

        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.patch(this.serverURL + '/applications/'+ userId +'/'+userId                                        //url req-main
            ,body                                                                            //(userData)                                                                        //body
            ,{headers:headers} //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
            //.retry(1)
        )
            .map((response: Response) => response.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
            ;

    }

    restDelete_File(userId: string,token:string,fileId:string)
    {
        let headers = new Headers();
        //headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '


        return this.http.delete(this.serverURL + '/' + fileId                                       //url req-main
            //body
        ,{headers:headers} //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
        //.retry(1)
        ).map((response: Response) => response.json())
    }


    public restDownload_File(userId: string,token:string,fileObj:any)
    {
        let headers = new Headers();
        //headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        if (token) headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '

        return this.http.get(fileObj.download                                       //url req-main
            //body
            ,{headers:headers} //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
            //.retry(1)
        ).map((response: Response) => response.json())
    }


    //--------------------------------------------------------------------------------


    /*


        var headers = new Headers();
        headers.append('Accept', '*');
        //headers.append('Content-Type', 'application/x-www-form-urlencoded');
        //headers.append('Access-Control-Request-Headers', 'content-type');
        //headers.append('Access-Control-Request-Method', 'POST');
        headers.append('withCredentials','true');
,
    */








}
