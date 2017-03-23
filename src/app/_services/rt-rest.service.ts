import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User,User4Create } from '../_models/user';
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeout';

import {ServerConfigs} from '../_models/configFile';
import {Body} from "@angular/http/src/body";


const dbgPrint_getUser = true;

@Injectable()
export class RestService {

    serverURL : string;
    host : string;

    constructor(private http: Http, serverConfs: ServerConfigs)
    {
        this.serverURL = serverConfs.get_serverConfigs().url;

        console.log("serverURL=",this.serverURL);
    }


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
    restPost_login(email:string,password:string): Observable<{}> {

        let bodyContent = {login: email, password: password};

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

        let headers = new Headers();
        headers.append('Content-type', 'application/json');
        //headers.append('Authorization','Bearer ' + token);

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
    restGet_formObject(userId: string, token:string):Observable<any> {

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        //headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '

        if (dbgPrint_getUser) console.log("in restService,auth_getFormObject: userId=",userId);
        return this.http.get(this.serverURL + '/applications/'+ userId +'/'+userId              //url req-main
                                                                            //url req-sub
            ,{headers:headers}  // ,({headers: new Headers({'Authorization':token}) }) //({'Authorization':'Bearer ' + token})                                          //header
            //.retry(1)
        )//.timeout(1000)
            .map((response: Response) => response.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
            ;

    }

    //patch user application form entries
    restPatch_formObject(userId: string,token:string,form:any):Observable<any> {

        let headers = new Headers();
        //headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '

        let body = JSON.stringify(form);

        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.patch(this.serverURL + '/applications/'+ userId +'/'+userId                                        //url req-main
            ,body                                                                            //(userData)                                                                        //body
            ,{headers:headers} //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
            //.retry(1)
        ).map((response: Response) => response.json())
            //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restGet_getUserData" '))
            ;

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
