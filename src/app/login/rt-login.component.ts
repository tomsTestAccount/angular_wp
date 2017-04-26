import {Component, ElementRef,OnInit,Input,EventEmitter} from '@angular/core';
import {AuthenticationService} from '../_services/rt-authentication.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import {Location} from '@angular/common';

import {User4Create} from '../_models/user';
import { RestService } from '../_services/rt-rest.service';


const dbgPrint_login = false;

@Component({
    //moduleId: module.id,
    selector: 'rt-login-form',
    templateUrl :'rt-login.component.html',
    styleUrls: ['rt-login.component.css']
})



export class LoginComponent implements OnInit{

    public user4create : User4Create;
    public errorMsg = '';

    loginForm: FormGroup;
    registerForm: FormGroup;
    pwdRequestForm: FormGroup;
    createAccountForm: FormGroup;
    error: string;
    result: string;
    returnUrl: string;
    //@Output() showModalEvent = new EventEmitter<boolean>();

    @Input() showLoginModalEvent= new EventEmitter<boolean>();

    bShowModal : boolean; //= this.showLoginModal;

    rtValidators = new rtFormValidators;

    loginRegister_toggle: string;

    model: any = {};
    loading = false;
    modalInfo = false;

    constructor(private fb: FormBuilder,
                private authenticationService: AuthenticationService,
                private _restService: RestService,
                private _router: Router,
                private route: ActivatedRoute,
                private _location: Location
                ) {

        this.showLoginModalEvent.subscribe(this.showModal());
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]})


        /*
        this.registerForm_finaly = this.fb.group({
            email: ['', Validators.required],
            password: ['',  Validators.compose([Validators.required])],
            confirm_password: ['', Validators.compose([Validators.required,this.rtValidators.validatePasswordConfirm])]
        })

        */

        this.createAccountForm = this.fb.group({
            email: ['', Validators.required],
            lastName: ['',  Validators.compose([Validators.required])],
            firstName: ['',  Validators.compose([Validators.required])],
            password: ['', Validators.required],
            confirm_password: ['', Validators.compose([Validators.required,this.rtValidators.validatePasswordConfirm])]
        })


        this.pwdRequestForm = this.fb.group({
            email: ['', Validators.required]
        })

        this.error = '';

        this.result = '';

        this.bShowModal = false;


        let routeParams = this.route.snapshot.params['where2go'];
        if (dbgPrint_login) console.log("routeParams = ",routeParams);

        if (routeParams == 'out') this.loginRegister_toggle = "logout";
        else this.loginRegister_toggle = "login";

        //this.bShowModal=this.showLoginModalEvent;

        //console.log("showLoginModal=",this.showLoginModal);
    }


    login_register_change(evt):void
    {
        if (dbgPrint_login) console.log("loginRegister_toggle=",evt);
        this.error = '';
        this.result = '';
        this.loginRegister_toggle = evt.value;
    }


    showModal():void{

        //console.log("In rt-login.component.ts this.bShowModalEvent=",this.showLoginModalEvent);

        this.bShowModal = true;

    }

    closeModal(gotoUrl?:string):void{
        this.bShowModal = false;
        this.error = '';
        this.result = '';
        this.createAccountForm.controls['email'].patchValue('');
        this.createAccountForm.controls['lastName'].patchValue('');
        this.createAccountForm.controls['firstName'].patchValue('');

        //this.returnUrl = this.route.snapshot.params['from'] || '/startPage';

        this.returnUrl = gotoUrl || '/startPage';

        if (dbgPrint_login) console.log("In closeModal: this.returnUrl=",this.returnUrl);
        if (dbgPrint_login) console.log("In closeModal: params=",this.route.snapshot.params);

        if (this.authenticationService.isAuthenticated())
        {
            //this._router.navigate([undefined]); //dirty hack to go back to page we coming from, e.g. application form
            //this._router.navigate(['redirect']);  //Todo: redirect to route we're coming from
            this._router.navigate([this.returnUrl]);
        }
        else this._router.navigate(['startPage']);
    }

    /*
    login() {
        if(!this._service.login(this.user)){
            this.errorMsg = 'Failed to login';
        }
    }
    */

    login() {
        this.loading = false;
        this.error = "";
        this.result = '';
        if (dbgPrint_login) console.log("login clicked");
        var userId = this.loginForm.controls['email'].value;
        this.authenticationService.login_getToken(userId, this.loginForm.controls['password'].value)
                .then(response =>
                {
                    var token = response;
                    //console.log("In login, response=",token);

                    this.result = 'You logged in successfully';

                    /*this.authenticationService.auth_getUserData()
                        .then(response => {

                            this.authenticationService.setCurrentUser_local(response);
                        })
                        .catch(error => {
                            console.log("In login, auth_getUserData, error=",error);
                        });
                    */

                    //this._router.navigate(['/userApplication']);
                    this.closeModal('/userApplication');
                })
                .catch(error =>
                {
                    //this.alertService.error(error);
                    console.log("In login, login_getToken, error=",error);

                    if (error.status != 'undefined') {
                        if (error.status == 401)
                            this.error = error['_body'] +  '! Are you registered?';
                        //console.log("In login :  error="', error, this.loginForm);
                    }
                    else this.error = error;


                    //this._router.navigate(['startPage']);


                });
    }


    forgetPwd()
    {
        this.loading = false;
        this.error = "";
        this.loginRegister_toggle='forget_password';
    }

    createAccount()
    {
        this.loading = false;
        this.error = "";
        //private userService: UserService;
        this.user4create = {
            email:this.createAccountForm.controls['email'].value,
            lastName:this.createAccountForm.controls['lastName'].value,
            firstName:this.createAccountForm.controls['firstName'].value,
            password:this.createAccountForm.controls['password'].value
        };

        /*this.user4create['email'] = this.createAccountForm.controls['email'].value;
        this.user4create['lastName'] = this.createAccountForm.controls['lastName'].value;
        this.user4create['firstName'] = this.createAccountForm.controls['firstName'].value;
        */
        this._restService.restPost_create(this.user4create)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page
                   // this.alertService.success('Registration successful', true);
                    //this.router.navigate(['/login']);
                    if (dbgPrint_login) console.log("In register: data=",data);
                    this.error = '';
                    //this.result = "Your Account for '" + this.user4create.email + "' is declared ! Please check your mails to set the password and complete the registration process! ";
                    this.result = "Your Account for '" + this.user4create.email + "' is registered ! Please Login ";

                    this.authenticationService.setCurrentUser_local(data);
                    //this._router.navigate(['registerCompletion',this.user4create.email,data.token]);
                },
                error => {
                   // this.alertService.error(error);
                    console.log("In register: error=",error);
                    this.result = '';
                    this.error = error;


                    //this._router.navigate(['startPage']);

                });
    }


    logout() {
        this.error = "";
        this.authenticationService.cleanAtlogout();
        this._router.navigate(['startPage']);
    }


    clearConfirmPwd(e){
        if (dbgPrint_login) console.log("password changed -> confirmPwd cleared");
        this.createAccountForm.controls['confirm_password'].patchValue('');
    }


}
