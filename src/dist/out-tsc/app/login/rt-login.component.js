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
var rt_authentication_service_1 = require("../_services/rt-authentication.service");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var rt_form_validators_service_1 = require("../_services/rt-form-validators.service");
var common_1 = require("@angular/common");
var rt_rest_service_1 = require("../_services/rt-rest.service");
//var html = require('./rt-login.component.html!text');
//var css = require('./rt-login.component.css!text');
var LoginComponent = (function () {
    function LoginComponent(fb, authenticationService, _restService, _router, route, _location) {
        this.fb = fb;
        this.authenticationService = authenticationService;
        this._restService = _restService;
        this._router = _router;
        this.route = route;
        this._location = _location;
        //public user = new User();
        this.errorMsg = '';
        //@Output() showModalEvent = new EventEmitter<boolean>();
        this.showLoginModalEvent = new core_1.EventEmitter();
        this.rtValidators = new rt_form_validators_service_1.rtFormValidators;
        this.model = {};
        this.loading = false;
        this.modalInfo = false;
        this.showLoginModalEvent.subscribe(this.showModal());
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.loginForm = this.fb.group({
            email: ['', forms_1.Validators.required],
            password: ['', forms_1.Validators.required]
        });
        /*
        this.registerForm_finaly = this.fb.group({
            email: ['', Validators.required],
            password: ['',  Validators.compose([Validators.required])],
            confirm_password: ['', Validators.compose([Validators.required,this.rtValidators.validatePasswordConfirm])]
        })

        */
        this.createAccountForm = this.fb.group({
            email: ['', forms_1.Validators.required],
            lastName: ['', forms_1.Validators.compose([forms_1.Validators.required])],
            firstName: ['', forms_1.Validators.compose([forms_1.Validators.required])],
            password: ['', forms_1.Validators.required],
            confirm_password: ['', forms_1.Validators.compose([forms_1.Validators.required, this.rtValidators.validatePasswordConfirm])]
        });
        this.pwdRequestForm = this.fb.group({
            email: ['', forms_1.Validators.required]
        });
        this.error = '';
        this.result = '';
        this.bShowModal = false;
        var routeParams = this.route.snapshot.params['where2go'];
        console.log("routeParams = ", routeParams);
        if (routeParams == 'out')
            this.loginRegister_toggle = "logout";
        else
            this.loginRegister_toggle = "login";
        //this.bShowModal=this.showLoginModalEvent;
        //console.log("showLoginModal=",this.showLoginModal);
    };
    LoginComponent.prototype.login_register_change = function (evt) {
        console.log("loginRegister_toggle=", evt);
        this.error = '';
        this.result = '';
        this.loginRegister_toggle = evt.value;
    };
    LoginComponent.prototype.showModal = function () {
        //console.log("In rt-login.component.ts this.bShowModalEvent=",this.showLoginModalEvent);
        this.bShowModal = true;
    };
    LoginComponent.prototype.closeModal = function (gotoUrl) {
        this.bShowModal = false;
        this.error = '';
        this.result = '';
        this.createAccountForm.controls['email'].patchValue('');
        this.createAccountForm.controls['lastName'].patchValue('');
        this.createAccountForm.controls['firstName'].patchValue('');
        //this.returnUrl = this.route.snapshot.params['from'] || '/startPage';
        this.returnUrl = gotoUrl || '/startPage';
        console.log("In closeModal: this.returnUrl=", this.returnUrl);
        console.log("In closeModal: params=", this.route.snapshot.params);
        if (this.authenticationService.isAuthenticated()) {
            //this._router.navigate([undefined]); //dirty hack to go back to page we coming from, e.g. application form
            //this._router.navigate(['redirect']);  //Todo: redirect to route we're coming from
            this._router.navigate([this.returnUrl]);
        }
        else
            this._router.navigate(['startPage']);
    };
    /*
    login() {
        if(!this._service.login(this.user)){
            this.errorMsg = 'Failed to login';
        }
    }
    */
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loading = false;
        this.error = "";
        this.result = '';
        console.log("login clicked");
        var userId = this.loginForm.controls['email'].value;
        this.authenticationService.login_getToken(userId, this.loginForm.controls['password'].value)
            .then(function (response) {
            var token = response;
            //console.log("In login, response=",token);
            _this.result = 'You logged in successfully';
            _this.authenticationService.auth_getUserData()
                .then(function (response) {
                _this.authenticationService.setCurrentUser_local(response);
            })
                .catch(function (error) {
                console.log("In login, auth_getUserData, error=", error);
            });
            //this._router.navigate(['/userApplication']);
            _this.closeModal('/userApplication');
        })
            .catch(function (error) {
            //this.alertService.error(error);
            console.log("In login, login_getToken, error=", error);
            if (error.status != 'undefined') {
                if (error.status == 401)
                    _this.error = error['_body'] + '! Are you registered?';
            }
            else
                _this.error = error;
            //this._router.navigate(['startPage']);
        });
    };
    LoginComponent.prototype.forgetPwd = function () {
        this.loading = false;
        this.error = "";
        this.loginRegister_toggle = 'forget_password';
    };
    LoginComponent.prototype.createAccount = function () {
        var _this = this;
        this.loading = false;
        this.error = "";
        //private userService: UserService;
        this.user4create = {
            email: this.createAccountForm.controls['email'].value,
            lastName: this.createAccountForm.controls['lastName'].value,
            firstName: this.createAccountForm.controls['firstName'].value,
            password: this.createAccountForm.controls['password'].value
        };
        /*this.user4create['email'] = this.createAccountForm.controls['email'].value;
        this.user4create['lastName'] = this.createAccountForm.controls['lastName'].value;
        this.user4create['firstName'] = this.createAccountForm.controls['firstName'].value;
        */
        this._restService.restPost_create(this.user4create)
            .subscribe(function (data) {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            // this.alertService.success('Registration successful', true);
            //this.router.navigate(['/login']);
            console.log("In register: data=", data);
            _this.error = '';
            //this.result = "Your Account for '" + this.user4create.email + "' is declared ! Please check your mails to set the password and complete the registration process! ";
            _this.result = "Your Account for '" + _this.user4create.email + "' is registered ! Please Login ";
            _this.authenticationService.setCurrentUser_local(data);
            //this._router.navigate(['registerCompletion',this.user4create.email,data.token]);
        }, function (error) {
            // this.alertService.error(error);
            console.log("In register: error=", error);
            _this.result = '';
            _this.error = error;
            //this._router.navigate(['startPage']);
        });
    };
    LoginComponent.prototype.logout = function () {
        this.error = "";
        this.authenticationService.logout();
        this._router.navigate(['startPage']);
    };
    LoginComponent.prototype.clearConfirmPwd = function (e) {
        console.log("password changed -> confirmPwd cleared");
        this.createAccountForm.controls['confirm_password'].patchValue('');
    };
    return LoginComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], LoginComponent.prototype, "showLoginModalEvent", void 0);
LoginComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'rt-login-form',
        //providers: [AuthenticationService],
        templateUrl: 'rt-login.component.html',
        styleUrls: ['rt-login.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        rt_authentication_service_1.AuthenticationService,
        rt_rest_service_1.RestService,
        router_1.Router,
        router_1.ActivatedRoute,
        common_1.Location])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=rt-login.component.js.map