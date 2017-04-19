import {Component, OnInit, AfterViewInit, Input,Output, SimpleChanges, OnChanges, EventEmitter} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

import { RtFormService ,cFormObject} from '../_services/rt-forms.service';
//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_lifecyclehooks = true;

//----------------------------------------------------------------------------------------------------------------------


@Component({
	//moduleId: module.id,
	selector: `lmu_user_apd`,
	templateUrl: 'ua-apd.component.html',
    //template:html,
	//styleUrls: ['lmu-ua-styles.css']


})
export class LmuUserApdComponent implements OnInit,AfterViewInit {

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


	constructor(private fb: FormBuilder,
	private _rtFomrsService:RtFormService) {


		this.submitted = false;

	}


	ngOnInit(): void {


		if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for apd-componnet");

		if (this.dbgPrint) console.log("this.currentForm=",this.currentForm);

		if (this.dbgPrint) console.log("formEntries=",this.currentFormEntries);


	}

	ngAfterViewInit():void{
		if (dbgPrint_lifecyclehooks) console.log("In ngAfterViewInit for apd-component");
		this._rtFomrsService.set_subForm_APD_Updated(true);
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
