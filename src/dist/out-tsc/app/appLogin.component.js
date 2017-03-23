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
var rt_authentication_service_1 = require("../app/_services/rt-authentication.service");
var common_1 = require("@angular/common");
//var css = require('./css/app.component.css!text');
var AppLoginComponent = (function () {
    function AppLoginComponent(_router, _authenticationService, _location) {
        var _this = this;
        this._router = _router;
        this._authenticationService = _authenticationService;
        this._location = _location;
        this.progressBar_value = 0;
        this.progressBar_mode = 'determinate';
        this.subscription = _authenticationService.userDisplayName$.subscribe(function (newDisplayName) {
            _this.displayname = newDisplayName;
        });
        _authenticationService.getProgressValue().subscribe(function (value) { return _this.progressBar_value = value; });
        _authenticationService.getProgressMode().subscribe(function (mode) { return _this.progressBar_mode = mode; });
    }
    AppLoginComponent.prototype.showLoginModal = function () {
        console.log("In app.componet before navigate to 'login' _location=", this._location.path());
        if (this._authenticationService.isAuthenticated())
            this._router.navigate(['/login', 'out', this._location.path()]);
        else
            this._router.navigate(['/login', 'in', this._location.path()]);
    };
    AppLoginComponent.prototype.routeTo = function (route) {
        this._router.navigate([route]);
    };
    AppLoginComponent.prototype.ngOnDestroy = function () {
        // prevent memory leak when component destroyed
        this.subscription.unsubscribe();
    };
    return AppLoginComponent;
}());
AppLoginComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n <!-- changing for aot-compiler\n <button (click)=\"toggleHeading()\">Toggle Heading</button>\n <h1 *ngIf=\"showHeading\">My First Angular App</h1>\n -->\n\n <div class=\"container\">\n\n <header>\n <!--\n <div class=\"header_images\">\n <img id=\"headerImg\" src=\"/images/kopfbild.png\" alt=\"lmu_logos\">\n </div>\n -->\n <div class=\"header_images_container\">\n <div  class=\"header_images_item\">\n <a href=\"http://www.uni-muenchen.de\">\n <img  src=\"assets/images/header_images/lmu1.png\" alt=\"lmu_logo_1\">\n </a>\n </div>\n <div  class=\"header_images_item\">\n <a href=\"http://www.uni-muenchen.de\">\n <img  src=\"assets/images/header_images/lmu2.png\" alt=\"lmu_logo_2\">\n </a>\n </div>\n <div  class=\"header_images_item\">\n <a href=\"http://www.uni-muenchen.de\">\n <img  src=\"assets/images/header_images/lmu3.png\" alt=\"lmu_logo_3\">\n </a>\n </div>\n <div  class=\"header_images_item\" id=\"header_images_item_ds\">\n <a href=\"http://www.m-datascience.mathematik-informatik-statistik.uni-muenchen.de\">\n <img  src=\"assets/images/header_images/lmu_ds.png\" alt=\"lmu_logo_ds\">\n </a>\n </div>\n </div>\n\n\n\n <div class=\"header_row\" id=\"header_row_menu_userInfo\">\n\n <div id=\"header_menu_column\">\n\n <div class=\"header_userInfo_field\">\n <div class=\"header_userInfo_item_button\"  [mdMenuTriggerFor]=\"mainmenu\">\n\n <i class=\"mdi mdi-menu mdi-24px\"></i>\n </div>\n </div>\n\n\n <md-menu #mainmenu=\"mdMenu\">\n <button md-menu-item   (click)=\"routeTo('startPage')\"> startPage  </button>\n <button md-menu-item  *ngIf=\"_authenticationService.isAuthenticated()\"  (click)=\"routeTo('userApplication')\"> User Application form </button>\n <button  md-menu-item *ngIf=\"!_authenticationService.isAuthenticated()\"  (click)=\"showLoginModal()\"> Login </button>\n <button  md-menu-item *ngIf=\"_authenticationService.isAuthenticated()\"  (click)=\"showLoginModal()\"> Logout </button>\n </md-menu>\n\n\n </div>\n <div id=\"header_userInfo_column\">\n <div *ngIf=\"!_authenticationService.isAuthenticated()\" class=\"header_userInfo_field\" (click)=\"showLoginModal()\">\n\n <!--\n <md-icon >\n person\n </md-icon>\n -->\n <!--<button md-button>Login</button>-->\n <div class=\"header_userInfo_item\">\n <i class=\"mdi mdi-account-outline\"></i>\n </div>\n\n <div class=\"header_userInfo_item\">|</div>\n <div class=\"header_userInfo_item_button\">Login</div>\n\n </div>\n <div *ngIf=\"_authenticationService.isAuthenticated()\"  class=\"header_userInfo_field\" (click)=\"showLoginModal()\">\n\n <!--\n <md-icon >\n person\n </md-icon>\n -->\n <!--<button md-button>Login</button>-->\n <div class=\"header_userInfo_item\">\n <i class=\"mdi mdi-account\"></i>\n </div>\n <!--<div class=\"header_userInfo_item\">{{authenticationService._currentUser.lastName}},{{authenticationService._currentUser.firstName}}</div>-->\n <div class=\"header_userInfo_item\">{{displayname}}</div>\n\n <div class=\"header_userInfo_item\" >|</div>\n <div class=\"header_userInfo_item_button\">Logout</div>\n\n\n </div>\n\n <!--\n <div class=\"loginOut_but\" class=\"header_userInfo_field\">\n <div class=\"loginOut_button\" (click)=\"showLoginModal()\">\n <span *ngIf=\"authenticationService.isAuthenticated()\">Logout</span>\n <span *ngIf=\"!authenticationService.isAuthenticated()\">Login</span>\n </div>\n </div>\n -->\n\n </div>\n\n </div>\n <!--\n <div class=\"header_row\">\n\n </div>\n -->\n </header>\n\n\n\n <div> <!--class=\"card\" id=\"startPageCard\">-->\n\n <!--\n <rt-login-form *ngIf=\"bShowModal\" (showLoginModal)=\"OnToggleLoginModal\"></rt-login-form>\n\n <rt-login-form #loginModalChild></rt-login-form>\n\n -->\n\n <md-progress-bar color=\"accent\" mode=\"{{progressBar_mode}}\" value=\"{{progressBar_value}}\"></md-progress-bar>\n\n <div class=\"content-main\">\n <router-outlet></router-outlet>\n </div>\n\n </div>\n\n <footer>\n <div id=\"lmuFooter\">\n\n <div class=\"footerItem\">\n <a class=\"a_lmu\"  href=\"http://test-datascience.ifi.lmu.de/impressum\" title=\"Impressum\"> Impressum </a>\n </div>\n\n <div class=\"footerItem\">\n <a class=\"a_lmu\"  href=\"http://test-datascience.ifi.lmu.de/datenschutz\" title=\"Datenschutz\"> Datenschutz </a>\n </div>\n\n <div class=\"footerItem\">\n <a class=\"a_lmu\" href=\"http://test-datascience.ifi.lmu.de/contact-info\" title=\"Kontakt\"> Kontakt </a>\n </div>\n\n </div>\n </footer>\n </div>\n\n ",
    }),
    __metadata("design:paramtypes", [router_1.Router,
        rt_authentication_service_1.AuthenticationService,
        common_1.Location])
], AppLoginComponent);
exports.AppLoginComponent = AppLoginComponent;
//# sourceMappingURL=appLogin.component.js.map