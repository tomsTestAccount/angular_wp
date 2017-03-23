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
var forms_1 = require("@angular/forms");
var rt_form_validators_service_1 = require("../_services/rt-form-validators.service");
var rt_rest_service_1 = require("../_services/rt-rest.service");
var router_1 = require("@angular/router");
//var html = require('./rt-register-completion.component.html!text');
var RtRegisterCompletion = (function () {
    function RtRegisterCompletion(fb, route, _router, _restService) {
        this.fb = fb;
        this.route = route;
        this._router = _router;
        this._restService = _restService;
        this.rtValidators = new rt_form_validators_service_1.rtFormValidators;
        this.routeParams = [];
    }
    ;
    RtRegisterCompletion.prototype.ngOnInit = function () {
        this.setPasswordForm = this.fb.group({
            email: [{ value: '', disabled: true }, forms_1.Validators.required],
            password: ['', forms_1.Validators.required],
            confirm_password: ['', forms_1.Validators.compose([forms_1.Validators.required, this.rtValidators.validatePasswordConfirm])]
        });
        this.error = '';
        this.result = '';
        this.userId = '';
        this.token = '';
        //debug
        //this.routeParams=  this.route.snapshot.params;
        console.log("routeParams = ", this.route.snapshot.params);
        this.userId = this.route.snapshot.params['userId'];
        this.token = this.route.snapshot.params['token'];
        //this.getAccountDeclarationByServer();
        this.setPasswordForm.controls['email'].patchValue(this.userId);
    };
    /*getAccountDeclarationByServer()
    {
        this.error='';
        this.result='';
        this.userMail = '';

        console.log("In getAccountDeclarationByServer");

        //this._restService.getByHashLink(this.routeParams)
        this._restService.restGet_getUserByMail(this.routeParams)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page
                    // this.alertService.success('Registration successful', true);
                    //this.router.navigate(['/login']);
                    console.log("In getAccountDeclarationByServer: data=",data);

                    this.userMail = data.email;
                    this.setPasswordForm.controls['email'].patchValue(this.userMail);
                },
                error => {
                    // this.alertService.error(error);
                    console.log("In getAccountDeclarationByServer: error=",error);
                    this.result = '';
                    this.error = error;

                    this._router.navigate(['startPage']);
                });

    }
    */
    RtRegisterCompletion.prototype.setPassword = function () {
        var _this = this;
        this.error = '';
        this.result = '';
        var userId = this.userId;
        var token = this.token;
        var userDataObj = {
            "password": this.setPasswordForm.controls['confirm_password'].value
        };
        //this._restService.restPatch_updateUserdata(this.routeParams,this.setPasswordForm.controls['confirm_password'].value)
        this._restService.restPatch_updateUserdata(userId, token, userDataObj)
            .subscribe(function (data) {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            // this.alertService.success('Registration successful', true);
            //this.router.navigate(['/login']);
            console.log("In setPassword: data=", data);
            _this.error = '';
            _this.result = "Your password for Account for '" + _this.setPasswordForm.controls['email'].value + "' is set successfully!  ";
            //this._router.navigate(['registerCompletion',userHash]);
        }, function (error) {
            // this.alertService.error(error);
            console.log("In setPassword: error=", error);
            _this.result = '';
            _this.error = error;
        });
    };
    RtRegisterCompletion.prototype.clearConfirmPwd = function (e) {
        console.log("password changed -> confirmPwd cleared");
        this.setPasswordForm.controls['confirm_password'].patchValue('');
    };
    return RtRegisterCompletion;
}());
RtRegisterCompletion = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'rt-register-completion',
        templateUrl: 'rt-register-completion.component.html'
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        router_1.ActivatedRoute,
        router_1.Router,
        rt_rest_service_1.RestService])
], RtRegisterCompletion);
exports.RtRegisterCompletion = RtRegisterCompletion;
//# sourceMappingURL=rt-register-completion.component.js.map