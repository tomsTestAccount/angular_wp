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
//import * as test from './start-page.component.html';
//import 'systemjs-plugin-text';
//import * as test from 'templates/start-page.component.html!text' ;
//import template from './templates/start-page.component.html!text';
//import 'text';
//import html from './templates/start-page.component.html';
//var html = require('./start-page.component.html!text');
//var css = require('./start-page.component.css!text');
var StartPageComponent = (function () {
    function StartPageComponent() {
    }
    ;
    //constructor(private userdataservice: UserDataService) {};
    StartPageComponent.prototype.ngOnInit = function () {
    };
    return StartPageComponent;
}());
StartPageComponent = __decorate([
    core_1.Component({
        ////moduleId: module.id,
        selector: 'startPage',
        //template:html,
        templateUrl: 'start-page.component.html',
        styleUrls: ['start-page.component.css']
    }),
    __metadata("design:paramtypes", [])
], StartPageComponent);
exports.StartPageComponent = StartPageComponent;
//# sourceMappingURL=start-page.component.js.map