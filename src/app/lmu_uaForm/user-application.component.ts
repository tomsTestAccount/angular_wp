import {
	Component, OnInit, AfterViewInit,DoCheck, Input, OnChanges, SimpleChange
} from '@angular/core';


import {FormGroup,FormControl,FormBuilder} from '@angular/forms';


import {rtFormValidators}  from '../_services/rt-form-validators.service';
import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';


import {AuthenticationService} from  '../_services/rt-authentication.service';
import {ServerConfigs} from '../_models/configFile';
import {DialogsService} from '../_services/dialogs.services'

const dbgPrint_lifecyclehooks = false;
const dbgPrint_save = false;
const dbgPrint_formChanged = false;
const dbgPrint_formEntryChanged = false;

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



export class UserApplicationComponent implements OnInit,AfterViewInit,DoCheck{

	uasubmit : boolean;

	subFormEntries  = [
            { 	title: " Applicant\'s Personal Details",
              	key : "subFormGroup_apd",
              	answerMissing : 0,
				site:'subFormGroup_apd'
            },
            { 	title: "Previous Education",
              	key :  "subFormGroup_ac",
				answerMissing : 0,
				site:"subFormGroup_ac"
            },
			{ 	title:  "Other Previous Education (optional)",
				key :  "subFormGroup_ac2",
				answerMissing : 0,
				site:"subFormGroup_ac",
				embedded:true,
			},
			{ 	title:  "Essay and other information",
				key :  "subFormGroup_oi",
                answerMissing : 0,
				site:"subFormGroup_oi"
			}
    ];

	selectedIndex : number;

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

	//currentUaObj:any;

    dbgFormValues =false;

	changeDetected:boolean = false;

	isFormUpdated = false;

	isFormValueLoadedFromServer = false;

	public dialogResult: any;

	//public formChangedEntries: any[] = [];
	public formChangedEntries = {
		subFormGroup_ac: {0:{}},
		subFormGroup_ac2: {0:{}},
		subFormGroup_apd: {0:{}},
		subFormGroup_oi: {0:{}},

	};

	mainFormValid = false;
	fromEntriesChangeDetected = false;

	summaryPage_href :string;

	//-------------------------------------------------------------------------------------------------------------------

	constructor(//private _fb: FormBuilder,
				private _authService:AuthenticationService,
				//private _rtFormSrv: RtFormService,
				serverConfs: ServerConfigs,
				private dialogsService: DialogsService
				)
    {

		let serverURL = serverConfs.get_serverConfigs().url;
		let userId = serverConfs.get_serverConfigs().userId;
		this.summaryPage_href = serverURL + '/applications/' + userId + '/' + userId ;

		//console.log("this.summaryPage_href =",this.summaryPage_href );

		//detect changes for form made by server --> detect when download form-data finished
		/*this._rtFormSrv.subFormIsUpdated$.subscribe(
			isUpdated => {

				setTimeout(()=> {
					this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();
					if (dbgPrint)console.log("In subFormIsUpdated$ ", this.main_lmu_ua_form);

					// subscribe to form changes, so we can detect the formEntries that were changed --> and send only these ones
					//this.subscribeToFormEntriesChanges();

					//set event the view is waiting for
					//this.isFormUpdated = isUpdated;

					//close loading dialog
					this.dialogsService.closeDialog();
				},31000);
			});
		*/
	};



    //ngOnInit(): void {
	ngAfterViewInit(): void {

		if (dbgPrint_lifecyclehooks)console.log("In UserApplicationComponent ngAfterViewInit");

    }

	ngOnInit(): void {

		if (dbgPrint_lifecyclehooks) console.log("In user-application ngOnInit!");

		this.uasubmit = false;

		this.dialogsService.loading('Your data is loading ... '); //TODO: put this or a similar message in the beginning -> i.e. in app.module.ts

		this._authService.auth_getFormObject()
            .then(response => {

				if (dbgPrint_lifecyclehooks)console.log("In user-application ngAfterViewInit, after get data, response=!",response);


				//init mainForm  --> with the really data downloaded from server !
				this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();

				//we get the subform-entities and the pre-defined formEntries here
				 this.apd_formObj = this.lmu_ua_form.apd_formObj;
				 this.ac_formObj = this.lmu_ua_form.ac_formObj;
				 this.ac2_formObj = this.lmu_ua_form.ac2_formObj;
				 this.oi_formObj = this.lmu_ua_form.oi_formObj;

				//set event the view is waiting for --> so the childViews (for each subForm) will be initialized
				this.isFormUpdated = true;


				//TODO: We have to know here, when the init-process of child-Views (subFomrs) is finished !?! .... lifeCycleHooks ??
				//using of setTimeout works, but is dirty !!!
				setTimeout(()=> {
					//console.log("this.apd_formObj=",this.apd_formObj);


					//subscribe to mainform changes... deprecated see form subscribeToFormEntriesChanges() below
					//this.subscribeMainFormValuesChanged();

					// subscribe to form entries changes, so we can detect the formEntries that were changed --> and send only these ones
					this.subscribeToFormEntriesChanges();


					//close loading dialog
					this.dialogsService.closeDialog();

					// has to be set after 'subscribeToFormEntriesChanges', because the subsribe functions are calling this.setChangeDetected()
					//this.reset_formChangedEntries();
					//this.setChangeDetected(false);


					if (dbgPrint_lifecyclehooks) console.log("In user-application ngAfterViewInit2, after get data, this=!",this);
				},1000);
            })
			.catch(err => {
				this.dialogsService.info('Error for retrieving data from server, err= ',err);
			});


	}

	private setChangeDetected(value:boolean,fControl?:any)
	{

		/*
			if (value == this.changeDetected) return;
			else {
				setTimeout(() => {
					this.changeDetected = value;
				}, 1);
			}
		*/
		//if (value == this.changeDetected) return;
		//else
		{
			setTimeout(() => {
				this.fromEntriesChangeDetected = value;
				this.main_lmu_ua_form.markAsDirty();
				if (fControl) console.log("in setChangedDetected:",this.fromEntriesChangeDetected, fControl);
				else console.log("in setChangedDetected:",this.fromEntriesChangeDetected);
			}, 100);
		}

	}

	private reset_formChangedEntries() {
		this.formChangedEntries = {
			subFormGroup_ac: {0: {}},
			subFormGroup_ac2: {0: {}},
			subFormGroup_apd: {0: {}},
			subFormGroup_oi: {0: {}},
	}

};

	private subscribeMainFormValuesChanged() {
		/*this.main_lmu_ua_form.controls['subFormGroup_ac'].valueChanges
            .subscribe(x => {
				console.log("in ValueChanged x = ",this.main_lmu_ua_form);
				if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true);
			});
		*/

		this.main_lmu_ua_form.valueChanges
            .subscribe(x => {
				console.log("in ValueChanged x = ",x);
				console.log("in this.main_lmu_ua_form=",this.main_lmu_ua_form);
				if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true);
			});
	}

	private subscribeToFormEntriesChanges() {

		if (dbgPrint_formEntryChanged) console.log("form=",this.main_lmu_ua_form.controls['subFormGroup_apd']);

		this.main_lmu_ua_form.markAsPristine();
		this.main_lmu_ua_form.markAsUntouched();

	 // initialize stream
		for (let fControl in  (<FormControl>this.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls'][fControl].valueChanges
				.subscribe(x => {
					this.formChangedEntries.subFormGroup_apd[0][fControl] = x;
				//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
				//this.lastValue = x[0];
				//console.log("in ValueChanged x = ",x);
				 if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls'][fControl]);
				 if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true,fControl);
				});
		}

		for (let fControl in  (<FormControl>this.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_ac[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					//if (dbgPrint_formEntryChanged)console.log("formControl", fControl," =",this.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls'][fControl]);
					if (this.main_lmu_ua_form.dirty == true) this.setChangeDetected(true,fControl);
				});
		}

		for (let fControl in  (<FormControl>this.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_ac2[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls'][fControl]);
					if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true,fControl);
				});
		}

		for (let fControl in  (<FormControl>this.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_oi[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls'][fControl]);
					if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true,fControl);
				});
		}


		this.reset_formChangedEntries();
		this.setChangeDetected(false);

	 }


	saveFormObj() {

		//this._rtRestService.setUaObject(this._authService.auth_getCurrentUser(),this.main_lmu_ua_form.value);

        if (dbgPrint_save) console.log("In saveFormObj, this.main_lmu_ua_form=",this.main_lmu_ua_form.value);
		if (dbgPrint_save) console.log("In saveFormObj, this.formChangedEntries=",this.formChangedEntries);


        this._authService.auth_setFormObj(this.formChangedEntries,true)
			.then(response => {console.log("Save Data Successful",response)})
			.catch(err => {
				if (err.statusText) this.dialogsService.info('Save Data Error:' + err.statusText ,err._body);
				else this.dialogsService.info('Save Data Error:',err);
				//console.log("In saveFormObj err=",err)
			}) ;

		this.setChangeDetected(false);
		this.reset_formChangedEntries();
	}

	ngDoCheck():void{
		this.changeDetected = this.fromEntriesChangeDetected;
		if (this.main_lmu_ua_form)
		{
			this.mainFormValid = this.main_lmu_ua_form.valid ;
		}

	}


	select_subFormTab(wantedSubForm: string) {
		//if (dbgPrint)
		console.log("In select_comp4User, wantedSubForm=",wantedSubForm);
		let current_ua_sec:string;
		for (let i=0;i<this.subFormEntries.length;i++) {

			if (this.subFormEntries[i].key === wantedSubForm)
			{
				for (let j=0;j<this.subFormEntries.length;j++)
				{
					if (this.subFormEntries[j].key == this.subFormEntries[i].site) this.selectedIndex = j;
				}

			}

		}

	}

	showMissingInput()
	{
		if (this.main_lmu_ua_form)
		{
			for (let subForm in this.main_lmu_ua_form.controls)
			{
				if (this.main_lmu_ua_form.controls[subForm].invalid)
				{
					//console.log("subform: ",subForm, " is invalid!");
					this.select_subFormTab(subForm.toString());
				}
			}
		}
	}

	submitForm()
	{
		//this.saveFormObj();
		//console.log("this.summaryPage_href =",this.summaryPage_href );
	}

	//status_apd: boolean = false;
	/*onFormEvent_apd(status_apd)
	{
		//TODO: only call this function when value was changed --> form

		this.uasubmit = status_apd;
		this.subFormEntries[0]['answerMissing']++;
        if (dbgPrint_formChanged) console.log("In onFormEvent_apd this.uasubmit= ",this.uasubmit);
	}
	*/



	//LmuUserApdComponent.get


	//---------------------- dbg

	showDbg(){

		console.log("In user-application ngAfterViewInit2, after get data!",this.main_lmu_ua_form);
		/*//console.log("this.main_lmu_ua_form=",this.main_lmu_ua_form);
		let currUsers = JSON.parse(localStorage.getItem('users'));
        console.log("In showDbg, localStorage.getItem('users')=",currUsers);

        let currUserObj = JSON.parse(localStorage.getItem('currentUser'));
        console.log("In showDbg, localStorage.getItem('currUserObj')=",currUserObj);


        //this._authService.auth_getFormObject();
        let currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));
        console.log("In showDbg, localStorage.getItem('currentUaObject')=",currUaObj);

        //currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));
		*/
	}

}
