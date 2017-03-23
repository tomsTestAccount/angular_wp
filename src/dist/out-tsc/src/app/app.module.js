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
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var forms_2 = require('@angular/forms');
var http_1 = require('@angular/http');
var _1 = require('@angular/material/');
var calendar_1 = require('primeng/components/calendar/calendar');
var ng2_uploader_1 = require('ng2-uploader/ng2-uploader');
require('hammerjs');
var start_page_component_1 = require('./home/start-page.component');
var user_application_component_1 = require('./lmu_uaForm/user-application.component');
var rt_login_component_1 = require('./login/rt-login.component');
var rt_register_completion_component_1 = require('./register/rt-register-completion.component');
var key_value_pipe_1 = require('./_pipes/key-value.pipe');
var key_value_pipe_2 = require('../app/_pipes/key-value.pipe');
var rt_file_uploader_component_1 = require('./rtForm/rt-file-uploader.component');
var rt_input_component_1 = require('./rtForm/rt-input.component');
var rt_grid_box_add_component_1 = require('./rtForm/rt-grid-box-add.component');
var ua_apd_component_1 = require('./lmu_uaForm/ua-apd.component');
var ua_pe_component_1 = require('./lmu_uaForm/ua-pe.component');
var ua_ope_component_1 = require('./lmu_uaForm/ua-ope.component');
var ua_oi_component_1 = require('./lmu_uaForm/ua-oi.component');
// used to create fake backend
//import {fakeBackendProvider}    from './mock-backend.component_ts.bak';
//import { MockBackend, MockConnection } from '@angular/http/testing';
//import { BaseRequestOptions } from '@angular/http';
var rt_rest_service_1 = require('./_services/rt-rest.service');
var rt_authentication_service_1 = require('./_services/rt-authentication.service');
var configFile_1 = require('./_models/configFile');
var lmu_ua_formList_1 = require('./_models/lmu_ua_formList'); //TODO
var rt_forms_service_1 = require('./_services/rt-forms.service');
var app_component_1 = require('./app.component');
var appLogin_component_1 = require('./appLogin.component');
var app_routing_1 = require('./app-routing');
var windowRef_service_1 = require('./_services/windowRef.service');
//import { environment } from '../environments/environment';
/*
export var importsList:any;
var declarationList:any;
var providersList:any;
var bootstrapList:any;


if (environment.production == false) {
*/
var importsList = [platform_browser_1.BrowserModule,
    forms_1.FormsModule,
    forms_2.ReactiveFormsModule,
    app_routing_1.AppRoutingModule,
    http_1.HttpModule,
    _1.MaterialModule.forRoot(),
    //ModalModule.forRoot(),
    calendar_1.CalendarModule,
    ng2_uploader_1.Ng2UploaderModule];
var declarationList = [
    app_component_1.AppComponent,
    appLogin_component_1.AppLoginComponent,
    start_page_component_1.StartPageComponent,
    rt_login_component_1.LoginComponent,
    rt_register_completion_component_1.RtRegisterCompletion,
    user_application_component_1.UserApplicationComponent,
    ua_apd_component_1.LmuUserApdComponent,
    ua_pe_component_1.LmuUserPeComponent,
    ua_ope_component_1.LmuUserOpeComponent,
    ua_oi_component_1.LmuUserOiComponent,
    rt_file_uploader_component_1.rtFileUploaderComponent,
    rt_input_component_1.rtInputComponent,
    rt_grid_box_add_component_1.rtGridBoxAddComponent,
    key_value_pipe_2.objValuesPipe,
    key_value_pipe_1.getKeyValuePair];
var providersList = [
    rt_rest_service_1.RestService,
    rt_authentication_service_1.AuthenticationService,
    configFile_1.ServerConfigs,
    lmu_ua_formList_1.lmu_ua_formList,
    rt_forms_service_1.RtFormService,
    // providers used to create fake backend
    //fakeBackendProviderArray,
    //fakeBackendProvider,
    //MockBackend,
    //BaseRequestOptions
    //Window
    //{provide: Window, useValue: window}
    windowRef_service_1.WindowRef
];
//var bootstrapList = [AppLoginComponent];
var bootstrapList = [app_component_1.AppComponent];
//}
//console.log("process.env.NODE_ENV = ",process.env.NODE_ENV);
/*
    importsList.push(BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        MaterialModule.forRoot(),
        //ModalModule.forRoot(),
        CalendarModule,
        Ng2UploaderModule);

    declarationList.push(
        //AppComponent,
        AppLoginComponent,
        StartPageComponent,
        LoginComponent,
        RtRegisterCompletion,
        UserApplicationComponent,
        LmuUserApdComponent,
        LmuUserPeComponent,
        LmuUserOpeComponent,
        LmuUserOiComponent,
        rtFileUploaderComponent,
        rtInputComponent,
        rtGridBoxAddComponent,
        objValuesPipe,
        getKeyValuePair);
    providersList.push(
        //UserDataService,
        RestService,
        AuthenticationService,
        ServerConfigs,
        lmu_ua_formList,
        RtFormService,
        // providers used to create fake backend
        //fakeBackendProviderArray,

        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
        {provide: Window, useValue: window}
    );
    bootstrapList.push(AppLoginComponent);
}
*/
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: importsList.slice(),
            declarations: declarationList.slice(),
            providers: providersList.slice(),
            bootstrap: bootstrapList.slice()
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map