import { Component,OnInit,AfterViewInit,HostListener,Input,OnChanges,SimpleChange } from '@angular/core';


import {Validators, FormGroup,FormControl,FormBuilder,FormArray} from '@angular/forms';


import {rtFormValidators}  from '../_services/rt-form-validators.service';
import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';

//import {UserService} from '../_services/rt-user.service';
import { User } from '../_models/user';

//import {Router,ActivatedRoute} from '@angular/router';

import {AuthenticationService} from  '../_services/rt-authentication.service';

//import { CountryList} from '../_models/countries';


const dbgPrint = false;

//for animations
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';
import {isNullOrUndefined} from "util";
import {timeout} from "rxjs/operator/timeout";

//var html = require('./user-application.component.html!text');
//var css = require('./user-application.component.css!text');

@Component({
	//moduleId: module.id,
	selector: 'my-userApplication',
    //template:html,
    //styles:[css]
	templateUrl: 'user-application.component.html',
	styleUrls: ['user-application.component.css'],

})




export class UserApplicationComponent implements OnInit,AfterViewInit {

	uasubmit : boolean;

	ua_sections  = [
            { title: " Applicant\'s Personal Details",
              name : "dbComp_User_apd",
              answerMissing : 0},
            { title: "Previous Education",
              name :  "dbComp_User_pe",
                answerMissing : 0},
            /*
              { title:  "Other Previous Education (optional)",
              name :  "dbComp_User_ope",
                  answerMissing : 0},
            */
              { title:  "Essay and other information",
              name :  "dbComp_User_oi",
                  answerMissing : 0}
    ];


	curr_ua_sec : string;


	//------------------------------------------
	main_lmu_ua_form : FormGroup;
	lmu_ua_form= new lmu_ua_formList();
	rtValidators = new rtFormValidators;
	//-------------------------------------------

	currentFormObject:cFormObject;
	ac_formObj:cFormObject;
	ac2_formObj:cFormObject;
	apd_formObj:cFormObject;
	oi_formObj:cFormObject;


	dbgIsOpen = false;

	currentUaObj:any;

	dbgPrint =true;

    dbgFormValues =false;

	changeDetected=false;

	isFormUpdated = false;

	isFormValueLoadedFromServer = false;

	//-------------------------------------------------------------------------------------------------------------------

	constructor(private _fb: FormBuilder,
				private _authService:AuthenticationService,
				private _rtFormSrv: RtFormService
						)
    {
		/*this._rtFormSrv.subFormAnnounced_apd$.subscribe(
		 newform => {
		 (this.main_lmu_ua_form.controls['subFormGroup_apd']) = newform.formgroup;
		 if (dbgPrint) console.log("In apd_subscribe");
		 });
		 */


		this._rtFormSrv.subFormIsUpdated$.subscribe(
			isUpdated => {
				this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();
				if (dbgPrint) console.log("In subFormIsUpdated$ ",this.main_lmu_ua_form);
				this.isFormUpdated = isUpdated;

			});

		/*

		if (dbgPrint) console.log("In UserApplicationComponent constructor");

		//we get the formEntries here
		this.apd_formObj = this.lmu_ua_form.buildFormObject_apd();
		this.ac_formObj = this.lmu_ua_form.buildFormObject_ac();
		this.ac2_formObj = this.lmu_ua_form.buildFormObject_ac2();
		this.oi_formObj = this.lmu_ua_form.buildFormObject_oi();


		//this.lmu_ua_form.init_mainForm();
		this.main_lmu_ua_form = this.lmu_ua_form.get_mainForm();
	*/


	};


	/*formValueChanged(data:any)
	{
		console.log("value changed, this.main_lmu_ua_form=",this.main_lmu_ua_form);
		this.changeDetected = true;
	}
	*/

    ngOnInit(): void {
		/*this._rtFormSrv.subFormAnnounced_apd$.subscribe(
		 newform => {
		 (this.main_lmu_ua_form.controls['subFormGroup_apd']) = newform.formgroup;
		 if (dbgPrint) console.log("In apd_subscribe");
		 });
		 */



		if (dbgPrint) console.log("In UserApplicationComponent ngOnInit");

		/*
		//we get the formEntries here
		this.apd_formObj = this.lmu_ua_form.buildFormObject_apd();
		this.ac_formObj = this.lmu_ua_form.buildFormObject_ac();
		this.ac2_formObj = this.lmu_ua_form.buildFormObject_ac2();
		this.oi_formObj = this.lmu_ua_form.buildFormObject_oi();


		//this.lmu_ua_form.init_mainForm();
		this.main_lmu_ua_form = this.lmu_ua_form.get_mainForm();
		*/

    }


    ngAfterViewInit(): void {


        if (this.dbgPrint) console.log("In user-application ngAfterViewInit!");

		this.uasubmit = false;

        this._authService.auth_getFormObject()
            .then(response => {

				//we get the formEntries here
				this.apd_formObj = this.lmu_ua_form.buildFormObject_apd();
				this.ac_formObj = this.lmu_ua_form.buildFormObject_ac();
				this.ac2_formObj = this.lmu_ua_form.buildFormObject_ac2();
				this.oi_formObj = this.lmu_ua_form.buildFormObject_oi();

				//this.lmu_ua_form.init_mainForm();
				this.main_lmu_ua_form = this.lmu_ua_form.get_mainForm();

				this.isFormValueLoadedFromServer = true;

                if (this.dbgPrint) console.log("In user-application ngAfterViewInit2, after get data!",this.main_lmu_ua_form);

            });

        /*
         this.apd_formObj.formgroup = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_apd'];
         this.ac_formObj.formgroup = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_ac'];
         this.ac2_formObj.formgroup = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_ac2'];
         this.oi_formObj.formgroup = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_oi'];
         */

        //let currentUser= this._authService.auth_getCurrentUser();
        //if (dbgPrint) console.log("In user-application ngOnInit , currentUser=",currentUser);


        /*
         this.currentUaObj = this._authService.auth_getFormObject();

         if (dbgPrint) console.log("In user-application ngOnInit , currentUaObject=",this.currentUaObj);


         if (this.currentUaObj) {
         if (Object.keys(this.currentUaObj).length !== 0) {
         if (dbgPrint) console.log("In user-application ngOnInit: this.main_lmu_ua_form=", this.main_lmu_ua_form);
         this.setFormValues_AlreadyFilled();
         }
         }
         */


        /*
         if (Object.keys(this.currentUaObj).length === 0) //check if empty
         {

         this._authService.getUaObjectByRest(currentUser);
         }
         else //if (!this.changeDetected)
         {
         this.setFormValues_AlreadyFilled();
         }
         */

        //this.main_lmu_ua_form.valueChanges.subscribe(data => this.formValueChanged(data));



        /*
        if (this._authService.isAuthenticated)
        {
            let currentUserId = this._authService.auth_getCurrentUserId();
            if (dbgPrint) console.log("In user-application ngOnInit , user is authenticated,currentUserId=",currentUserId);
        }
        else
        {
            if (dbgPrint) console.log("In user-application ngOnInit , user is NOT authenticated !!!");
        }


        //this.currentUaObj = this._authService.auth_getFormObject()
        this._authService.auth_getFormObject().then(response =>
        {
            this.currentUaObj = response;

            if (dbgPrint) console.log("In user-application ngOnInit , currentUaObject=",this.currentUaObj);

            if (this.currentUaObj) {
                if (Object.keys(this.currentUaObj).length !== 0) {
                    if (dbgPrint) console.log("In user-application ngOnInit: this.main_lmu_ua_form=", this.main_lmu_ua_form);
                    this.setFormValues_AlreadyFilled();

                    if (dbgPrint) console.log("this.main_lmu_ua_form.controls['subFormGroup_apd']=",this.main_lmu_ua_form.controls['subFormGroup_apd']);

                }
            }
            else
            {

            }



        });
        .catch(exp => {
         console.log("in auth_getFormObject, error at auth_getFormObject_Server , err=", exp);
         //this.auth_setFormObj({});
         return {};
         }
         );


        */


    }

	private _setFormValues_AlreadyFilled()
	{
        if (this.dbgFormValues) {
            console.log("In setFormValues_AlreadyFilled,this.main_lmu_ua_form.controls=", this.main_lmu_ua_form.controls);
            console.log("In setFormValues_AlreadyFilled,this.currentUaObj=", this.currentUaObj);

            console.log("In setFormValues_AlreadyFilled,this.currentUaObj.subFormGroup_apd=", this.currentUaObj.subFormGroup_apd);
            console.log("In setFormValues_AlreadyFilled,this.currentUaObj.subFormGroup_ac=", this.currentUaObj.subFormGroup_ac);
            console.log("In setFormValues_AlreadyFilled,this.currentUaObj.subFormGroup_ac2=", this.currentUaObj.subFormGroup_ac2);
            console.log("In setFormValues_AlreadyFilled,this.currentUaObj.subFormGroup_oi=", this.currentUaObj.subFormGroup_oi);
        }

        this.main_lmu_ua_form.controls['subFormGroup_apd'].patchValue(this.currentUaObj.subFormGroup_apd);
        this.main_lmu_ua_form.controls['subFormGroup_ac'].patchValue(this.currentUaObj.subFormGroup_ac);
        this.main_lmu_ua_form.controls['subFormGroup_oi'].patchValue(this.currentUaObj.subFormGroup_oi);
        this.main_lmu_ua_form.controls['subFormGroup_ac2'].patchValue(this.currentUaObj.subFormGroup_ac2);


        /*
        var tmp_apdSubForm = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_apd']['controls']['0'];
        if (dbgPrint) console.log("tmp_apdSubForm=",tmp_apdSubForm);

        for (var p in this.currentUaObj.subFormGroup_apd) {
            tmp_apdSubForm.controls[p.toString()].patchValue(this.currentUaObj.subFormGroup_apd[p.toString()]);
        }
        */


        /*
        var tmp_apdSubForm = <FormGroup>this.main_lmu_ua_form.controls['subFormGroup_apd']['controls']['0'];
        for (var p in this.currentUaObj.subFormGroup.pe) {
            tmp_apdSubForm.controls[p.toString()].patchValue(this.currentUaObj.subFormGroup_apd[p.toString()]);
        }
        */

        //var tmp_apdForm : FormGroup = <FormGroup>(this.main_lmu_ua_form.controls['subFormGroup_apd']);
        //tmp_apdForm.controls['firstname'].patchValue(this.currentUaObj.subFormGroup_apd.firstname);

        //this.main_lmu_ua_form.controls['subFormGroup_apd'].controls['firstname'].patchValue(this.currentUaObj.subFormGroup_apd.firstname);

        if (dbgPrint) console.log("this.main_lmu_ua_form.controls['subFormGroup_apd']=",this.main_lmu_ua_form.controls['subFormGroup_apd']);
	}

	select_comp4User(current_ua_sec: string)
	{
        if (dbgPrint) console.log("In select_comp4User, current_dbComp_user=",current_ua_sec);
		this.curr_ua_sec = current_ua_sec;
	}

	saveFormObj()
	{

		//this._rtRestService.setUaObject(this._authService.auth_getCurrentUser(),this.main_lmu_ua_form.value);

        if (dbgPrint) console.log("In saveFormObj, this.main_lmu_ua_form.value=",this.main_lmu_ua_form.value);

        this._authService.auth_setFormObj(this.main_lmu_ua_form.value,true);
		this.changeDetected = false;
	}





	status_apd: boolean = false;
	onFormEvent_apd(status_apd)
	{
		//TODO: olny call this function when value was changed --> form

		this.uasubmit = status_apd;
		this.ua_sections[0]['answerMissing']++;
        if (dbgPrint) console.log("In onFormEvent_apd this.uasubmit= ",this.uasubmit);
	}



	//LmuUserApdComponent.get


	//---------------------- dbg

	showDbg(){
		//console.log("this.main_lmu_ua_form=",this.main_lmu_ua_form);
		let currUsers = JSON.parse(localStorage.getItem('users'));
        console.log("In showDbg, localStorage.getItem('users')=",currUsers);

        let currUserObj = JSON.parse(localStorage.getItem('currentUser'));
        console.log("In showDbg, localStorage.getItem('currUserObj')=",currUserObj);


        //this._authService.auth_getFormObject();
        let currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));
        console.log("In showDbg, localStorage.getItem('currentUaObject')=",currUaObj);

        //currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));

	}

}
