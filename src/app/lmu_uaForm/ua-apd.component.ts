import {Component, OnInit, HostListener, Input,Output, SimpleChanges, OnChanges, EventEmitter} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

//import { forbiddenNameValidator } from '../shared/forbidden-name.directive';

//import { UserModel } from '../usermodel';

//import { CountryList} from '../_models/countries';

import {lmu_ua_formList} from'../_models/lmu_ua_formList';

import { RtFormService ,cFormObject} from '../_services/rt-forms.service';

//for animations
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';


//import { ViewContainerRef } from '@angular/core';

//var html = require('./ua-apd.component.html!text');



@Component({
	//moduleId: module.id,
	selector: `lmu_user_apd`,
	templateUrl: 'ua-apd.component.html',
    //template:html,
	//styleUrls: ['lmu-ua-styles.css']


})

export class LmuUserApdComponent implements OnInit {

	//private model = {};

	//private usermodel : UserModel = {uid:42,surname : "Dampf", givenName : "hans", gender : 'male', dateOfBirth : { day:1, month:4, year:1980}};
	usermodel : any; // = {uid:1 ,surname : "", givenName : "", gender : 'male'};

	countries : any;

	submitted : boolean;

	@Input() uasubmit: boolean;

	@Output() onFormEvent_apd = new EventEmitter<boolean>();

	formgroup: any;

	formEntries: any;

	currentFormObject:cFormObject; //Object[];

	dbgPrint:boolean = false;
	//------------------------------------------------------

	currentForm:FormGroup;
	@Input() set setForm(givenForm: FormGroup){

		if (this.dbgPrint) console.log("givenForm=",givenForm);
		this.currentForm = <FormGroup>givenForm.controls[0];
		//this.currentForm = givenForm;

	};
	currentFormEntries:[any];
	@Input() set setFormEntries(formEntries:[any]){

		this.currentFormEntries = formEntries

	};

	/*
	@Input() genderCheckBox_clicked()
	{
		if (this.model.genderM) this.model.genderF = false;
		else if(this.model.genderF) this.model.genderM = false;
		console.log("In genderCheckBox_clicked, this.model.genderM,this.model.genderF= ",this.model.genderM,this.model.genderF );
	}
	*/

	//lmu_ua_form= new lmu_ua_formList();


	constructor(private fb: FormBuilder) {

		//console.log("In LmuUserApdComponent");

		this.submitted = false;

		//this.currentForm = new lmu_ua_formList();

		//this.apdForm = this.lmu_ua_form.buildFormObject_apd();

		//this.countries = CountryList;
		//this.usermodel = {uid:1 ,surname : "", givenName : "", gender : 'male', dateOfBirth : { day:0, month:0, year:0}};
		//this.usermodel = UserModel;
		//this.usermodel = { };
		// this.usermodel['dateOfBirth'] = {};
		//console.log("In LmuUserApdComponent constructor, usermodel",this.usermodel); //, ', this.countries=',this.countries);

	}


	ngOnInit(): void {


		if (this.dbgPrint) console.log("this.currentForm=",this.currentForm);

		if (this.dbgPrint) console.log("formEntries=",this.currentFormEntries);

		/*let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUserObj) {

			//console.log("In apdForm, currentUserObj=",currentUserObj);

			this.currentForm.controls['lastname'].patchValue(currentUserObj['lastName']);
			this.currentForm.controls['firstname'].patchValue(currentUserObj['firstName']);
			this.currentForm.controls['email'].patchValue(currentUserObj['email']);
		}
		*/




		//console.log("currentForm.controls.apd_formArray=",this.currentForm.controls['apd_formArray']);


		//this.buildForm();

		/*this.currentFormObject= this.lmu_ua_form.buildFormObject_apd();

		let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUserObj) {

			//console.log("In apdForm, currentUserObj=",currentUserObj);

			this.currentFormObject.formgroup.controls['lastname'].patchValue(currentUserObj['lastName']);
			this.currentFormObject.formgroup.controls['firstname'].patchValue(currentUserObj['firstName']);
			this.currentFormObject.formgroup.controls['email'].patchValue(currentUserObj['email']);
		}
		*/
	}



	onFormValueChanged(data)
	{
		console.log("onValueChanged",data);
	}


	/*
	onFormStatusChanged(data)
	{
		var tmpStatus = false;

		if( data === 'VALID')
		{
			console.log("onFormStatusChanged",data);
			tmpStatus = true;
		}


		this.onFormEvent_apd.emit(tmpStatus);

	}
	*/

	/*
	onSubmit()
	{
		console.log("In onSubmit() , this.fb",this.fb, " , this.apdForm",this.apdForm);
			this.submitted = true;
			this.uasubmit = true;
	}

	*/

	/*
	ngOnChanges(changes: SimpleChanges) {
		// changes.prop contains the old and the new value...
		console.log("InngOnChanges , changes=",changes);
	}
	*/


	/*
	@Input() set myUnless(condition: boolean) {
		if (!condition) {
		  this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
		  this.viewContainer.clear();
		}
	}
	*/

	/*
	public getFormStatus()
	{
		return this.submitted;
	}
	*/

	//test
	// TODO: Remove this when we're done
	get diagnostic()
	{
		//return JSON.stringify(this.usermodel);
		return JSON.stringify(this.fb.group);
	}


	dbgIsOpen : boolean = false;

	toggleDbg() : void{
		this.dbgIsOpen = !this.dbgIsOpen;
		if (this.dbgPrint) console.log("this.dbgIsOpen=",this.dbgIsOpen);
	}


}
