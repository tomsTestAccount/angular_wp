"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
//import { DashboardComponent }   from './dashboard.component';
var user_application_component_1 = require("./lmu_uaForm/user-application.component");
var rt_login_component_1 = require("./login/rt-login.component");
var start_page_component_1 = require("./home/start-page.component");
var rt_register_completion_component_1 = require("./register/rt-register-completion.component");
var rt_authentication_service_1 = require("../app/_services/rt-authentication.service");
var routes = [
    { path: 'startPage', component: start_page_component_1.StartPageComponent },
    { path: 'userApplication', component: user_application_component_1.UserApplicationComponent, canActivate: [rt_authentication_service_1.AuthGuard] },
    { path: 'login/:where2go/:from', component: rt_login_component_1.LoginComponent },
    { path: 'registerCompletion/:userId/:token', component: rt_register_completion_component_1.RtRegisterCompletion },
    { path: '', redirectTo: '/startPage', pathMatch: 'full' },
    { path: '404', redirectTo: '/startPage', pathMatch: 'full' },
    { path: '**', redirectTo: '/startPage', pathMatch: 'full' }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule],
        providers: [
            rt_authentication_service_1.AuthGuard
        ]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.js.map