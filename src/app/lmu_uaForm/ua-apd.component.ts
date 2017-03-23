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

		let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUserObj) {

			//console.log("In apdForm, currentUserObj=",currentUserObj);

			this.currentForm.controls['lastname'].patchValue(currentUserObj['lastName']);
			this.currentForm.controls['firstname'].patchValue(currentUserObj['firstName']);
			this.currentForm.controls['email'].patchValue(currentUserObj['email']);
		}





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


/*
	toFormGroup(entries:any){				//TODO: build own rt-form-service for that stuff

		//console.log("entries=",entries);

		let group:any = {};

		//console.log("this.currentForm=",this.currentForm.entries);

		entries.forEach(entry => {
			console.log("entry=",entry.key);
		 group[entry.key]= new FormControl(entry.key.defaultValue || '',entry.key.validators);
		 })



		return new FormGroup(group);
	}

*/
/*
	buildFormObject(): void {



            this.apdForm = this.fb.group({
                //'surname': '',
                'lastname': ['', Validators.compose([Validators.minLength(3)])],
                //'surname': ['', Validators.minLength(3)],
                'givenname': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'gender': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'nationality': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'dateOfBirth2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'address1': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'address3': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'address4': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                'phoneNumber': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                //'phoneNumber2': ['', Validators.compose([Validators.maxLength(20),Validators.minLength(3)])],
                'phoneNumber2': ['', Validators.compose([Validators.maxLength(20),Validators.minLength(3)])],
                'email': ['', Validators.compose([Validators.required,Validators.minLength(3)])]
            });

            //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
            this.apdForm.statusChanges.subscribe(data => this.onFormStatusChanged(data));


            this.formgroup = this.apdForm;
            this.formEntries = [
                {   //formgroup : this.apdForm,
                    key : 'lastname',
                    title : 'Surname / Family Name *',
                    type: 'text',
                    required: true
                },
                {   //formgroup : this.apdForm,
                    key : 'givenname',
                    title : 'First Name(s) / Given Name(s) *',
                    type: 'text',
                    required: true
                },
                {   //formgroup : this.apdForm,
                    key : 'gender',
                    title : 'Gender *',
                    type: 'select',
                    options : [
                        {
                            name : 'male'
                        },
                        {
                            name : 'female'
                        }
                    ],
                    required: true
                },{
                    //formgroup : this.apdForm,
                    key : 'dateOfBirth2',
                    title : 'Date of Birth *',
                    type: 'date',
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'nationality',
                    title : 'Country of Nationality *',
                    type: 'select',
                    options : this.countries,
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'address1',
                    title : 'Street Name and House Number *',
                    type: 'text',
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'address2',
                    title : 'Postcode / ZIP Code *',
                    type: 'text',
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'address3',
                    title : 'Place of Residence  *',
                    type: 'text',
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'address4',
                    title : 'Country of Residence *',
                    type: 'select',
                    options : this.countries,
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'phoneNumber',
                    title : 'Phonenumber  *',
                    type: 'number',
                    required: true
                },
                {
                    //formgroup : this.apdForm,
                    key : 'phoneNumber2',
                    title : 'other Phonenumber  (optional)',
                    type: 'number',
                    required: false
                },
                {
                    //formgroup : this.apdForm,
                    key : 'email',
                    title : 'Email Address *',
                    type: 'email',
                    required: true
                }

            ];




		let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));

		if (currentUserObj) {

			//console.log("In apdForm, currentUserObj=",currentUserObj);

			this.currentFormObject.formgroup.controls['lastname'].patchValue(currentUserObj['lastName']);
			this.currentFormObject.formgroup.controls['firstname'].patchValue(currentUserObj['firstName']);
			this.currentFormObject.formgroup.controls['email'].patchValue(currentUserObj['email']);
		}

	}
*/
/*
	onFormValueChanged(data)
	{
		console.log("onValueChanged",data);
	}
*/
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
