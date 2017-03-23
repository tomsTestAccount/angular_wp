import { Component,OnInit} from '@angular/core';
import {Validators,FormGroup, FormBuilder} from '@angular/forms';
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import { RestService } from '../_services/rt-rest.service';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

//var html = require('./rt-register-completion.component.html!text');

@Component({
    //moduleId: module.id,
    selector: 'rt-register-completion',
    templateUrl: 'rt-register-completion.component.html'
    //template:html,
    //styleUrls: ['rt-file-uploader.component.css']    //TODO: add component own css-file

})


export class RtRegisterCompletion implements OnInit
{

    setPasswordForm : FormGroup;
    rtValidators = new rtFormValidators;
    error:string;
    result:string;

    routeParams=[];

    userId:string;
    token:string;


    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private _router: Router,
                private _restService: RestService){};

    ngOnInit() {

        this.setPasswordForm = this.fb.group({
            email: [{value:'',disabled:true}, Validators.required],
            password: ['', Validators.required],
            confirm_password: ['', Validators.compose([Validators.required,this.rtValidators.validatePasswordConfirm])]
        })

        this.error='';
        this.result='';
        this.userId = '';
        this.token= '';
        //debug

        //this.routeParams=  this.route.snapshot.params;

        console.log("routeParams = ",this.route.snapshot.params);

        this.userId= this.route.snapshot.params['userId'];
        this.token= this.route.snapshot.params['token'];


        //this.getAccountDeclarationByServer();

        this.setPasswordForm.controls['email'].patchValue(this.userId);
    }



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

    setPassword():void{

        this.error='';
        this.result='';

        var userId = this.userId;
        var token = this.token;
        var userDataObj = {
            "password": this.setPasswordForm.controls['confirm_password'].value
        };

        //this._restService.restPatch_updateUserdata(this.routeParams,this.setPasswordForm.controls['confirm_password'].value)
        this._restService.restPatch_updateUserdata(userId,token,userDataObj)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page
                    // this.alertService.success('Registration successful', true);
                    //this.router.navigate(['/login']);
                    console.log("In setPassword: data=",data);
                    this.error = '';
                    this.result = "Your password for Account for '" + this.setPasswordForm.controls['email'].value + "' is set successfully!  "

                    //this._router.navigate(['registerCompletion',userHash]);
                },
                error => {
                    // this.alertService.error(error);
                    console.log("In setPassword: error=",error);
                    this.result = '';
                    this.error = error;
                });

    }

    clearConfirmPwd(e){
        console.log("password changed -> confirmPwd cleared");
        this.setPasswordForm.controls['confirm_password'].patchValue('');
    }
}
