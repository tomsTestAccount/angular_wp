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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/timeout");
var configFile_1 = require("../_models/configFile");
var dbgPrint_getUser = true;
var RestService = (function () {
    function RestService(http, serverConfs) {
        this.http = http;
        this.serverURL = serverConfs.get_serverConfigs().url;
        console.log("serverURL=", this.serverURL);
    }
    /*********************************** PLONE-RESTAPI **************************************************************/
    //var serverURL = ServerConfigs.restServer;
    //create user
    RestService.prototype.restPost_create = function (newUser) {
        var body = JSON.stringify(newUser);
        /*({

            email:newUser.email,
            lastName:newUser.lastName,
            firstName:newUser.firstName,
            password:newUser.password
        })
        */
        //console.log("In restPost_login, this.serverURL= ",this.serverURL,body);
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-type', 'application/json');
        //console.log("body",body);
        //this.serverURL = this._location.path();
        return this.http.post(this.serverURL + '/@users' //req
        , body //body
        , { headers: headers } //header
        ).map(function (response) { return response.json(); });
        //.catch((error:any) => Observable.throw(error.json().error || 'Unknown Server error at "restPost_create" '));
    };
    //login - post
    RestService.prototype.restPost_login = function (email, password) {
        var bodyContent = { login: email, password: password };
        var body = JSON.stringify(bodyContent);
        //console.log("In restPost_login, this.serverURL= ",this.serverURL,body);
        var headers = new http_1.Headers();
        headers.append('Accept', '*,application/json');
        headers.append('Content-type', 'application/json');
        //headers.append('Content-type', 'application/json');
        //headers.append('Content-type', 'application/json');
        return this.http.post(this.serverURL + '/@login', body //body
        , { headers: headers } //headers//,this.jwt()                                            //header
        ) // ...and calling .json() on the response to return data
            .map(function (response) { return response.json(); });
    };
    //get user application form entries -get
    RestService.prototype.restGet_getUserData = function (userId, token) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        //headers.append('Content-type', 'application/json');
        headers.append('Authorization', 'Bearer ' + token);
        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.get(this.serverURL + '/@users/' //url req-main
            + userId //url req-sub
        , { headers: headers } //({headers: new Headers({'Authorization':token}) }) //({'Authorization':'Bearer ' + token})                                          //header
        ).map(function (response) { return response.json(); });
    };
    //update user
    RestService.prototype.restPatch_updateUserdata = function (userId, token, userData) {
        var headers = new http_1.Headers();
        headers.append('Content-type', 'application/json');
        //headers.append('Authorization','Bearer ' + token);
        var body = JSON.stringify(userData);
        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.patch(this.serverURL + '/@users/' //url req-main
            + userId //url req-sub
        , body //(userData)                                                                        //body
        , { headers: headers } //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
        ).map(function (response) { return response.json(); });
    };
    //get user application form entries
    RestService.prototype.restGet_formObject = function (userId, token) {
        var headers = new http_1.Headers();
        headers.append('Accept', 'application/json');
        //headers.append('Authorization','Bearer ' + token); //'Authorization':'Bearer '
        if (dbgPrint_getUser)
            console.log("in restService,auth_getFormObject: userId=", userId);
        return this.http.get(this.serverURL + '/applications/' + userId + '/' + userId //url req-main
        , { headers: headers } // ,({headers: new Headers({'Authorization':token}) }) //({'Authorization':'Bearer ' + token})                                          //header
        ) //.timeout(1000)
            .map(function (response) { return response.json(); });
    };
    //patch user application form entries
    RestService.prototype.restPatch_formObject = function (userId, token, form) {
        var headers = new http_1.Headers();
        //headers.append('Content-type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + token); //'Authorization':'Bearer '
        var body = JSON.stringify(form);
        //console.log("in restService,auth_getFormObject: user=",user);
        return this.http.patch(this.serverURL + '/applications/' + userId + '/' + userId //url req-main
        , body //(userData)                                                                        //body
        , { headers: headers } //,({headers: new Headers({'Authorization':token}) })                               //({'Authorization':'Bearer ' + token})                 //header
        ).map(function (response) { return response.json(); });
    };
    return RestService;
}());
RestService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, configFile_1.ServerConfigs])
], RestService);
exports.RestService = RestService;
//# sourceMappingURL=rt-rest.service.js.map