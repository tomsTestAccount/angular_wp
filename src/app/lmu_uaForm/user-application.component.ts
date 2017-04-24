import {
	Component, OnInit, AfterViewInit, DoCheck, AfterViewChecked,Renderer2, ViewChildren, ViewChild, ElementRef, QueryList,
	Directive, ContentChildren, Input, OnChanges, SimpleChange, Query
} from '@angular/core';

import {FormGroup,FormControl,FormBuilder} from '@angular/forms';

import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';

import {AuthenticationService} from  '../_services/rt-authentication.service';
import {ServerConfigs} from '../_models/configFile';
import {DialogsService} from '../_services/dialogs.services'

const dbgPrint_lifecyclehooks = true;
const dbgPrint_save = false;
const dbgPrint_formChanged = false;
const dbgPrint_formEntryChanged = false;


@Component({
	//moduleId: module.id,
	selector: 'my-userApplication',
    //template:html,
    //styles:[css]
	templateUrl: 'user-application.component.html',
	styleUrls: ['user-application.component.css'],
})
export class UserApplicationComponent implements OnInit,AfterViewInit,DoCheck{

	//TODO: load from form_model_list
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
	//lmu_ua_form= new lmu_ua_formList();
	//rtValidators = rtFormValidators;
	//-------------------------------------------

	//currentFormObject:cFormObject;

	ac_formObj:cFormObject;
	ac2_formObj:cFormObject;
	apd_formObj:cFormObject;
	oi_formObj:cFormObject;


	dbgIsOpen = false;

	//currentUaObj:any;

    dbgFormValues =false;

	changeDetected:boolean = false;

	isFormDataLoaded = false;

	public formChangedEntries = {
		subFormGroup_ac: {0:{}},
		subFormGroup_ac2: {0:{}},
		subFormGroup_apd: {0:{}},
		subFormGroup_oi: {0:{}},

	};

	mainFormValid = false;
	formEntriesChangeDetected = false;
	summaryPage_href :string;

	//-------------------------------------------------------------------------------------------------------------------

	constructor(//private _fb: FormBuilder,
				private _authService:AuthenticationService,
				private _elementRef : ElementRef,
				private _rtFormSrv : RtFormService,
				private serverConfs: ServerConfigs,
				private lmu_ua_form: lmu_ua_formList,
				private dialogsService: DialogsService
				)
    {

		let serverURL = serverConfs.get_serverConfigs().url;
		let userId = serverConfs.get_serverConfigs().userId;
		this.summaryPage_href = serverURL + '/applications/' + userId + '/' + userId ;


		//detect changes for form made by server --> detect when download form-data finished and child-views are initialized
		//TODO: We have to know here, when the init-process of child-Views (subFomrs) is finished !?! .... using of lifeCycleHooks (afterContent .. ) ??

		this._rtFormSrv.subFormsAreUpdated$.subscribe(
			isUpdated => {
				setTimeout(()=> {		//not needed , but let the modal-dialog displayed at least for 1sec
					//this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();
					//if (dbgPrint)
					console.log("In subFormsAreAllUpdated$ ", this.main_lmu_ua_form);

					// subscribe to form changes, so we can detect the formEntries that were changed --> and send only these ones
					this.subscribeToFormEntriesChanges();

					//set event the view is waiting for
					//this.isFormUpdated = isUpdated;

					//close loading dialog
					this.dialogsService.closeDialog();
				},1000);
			}
		);


	};


	ngOnInit(): void {


		if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for user-application-component");

		this.dialogsService.loading('Your data is loading ... '); //TODO: put this or a similar message at the beginning -> i.e. in app.module.ts

		this._authService.auth_getFormObject()
            .then(response => {

				if (dbgPrint_lifecyclehooks)console.log("In ngOnInit for user-application , after get data from server, data=!",response);

				//init mainForm  --> with the really data downloaded from server !
				this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();

				//we get the subform-entities and the pre-defined formEntries here
				 this.apd_formObj = this.lmu_ua_form.apd_formObj;
				 this.ac_formObj = this.lmu_ua_form.ac_formObj;
				 this.ac2_formObj = this.lmu_ua_form.ac2_formObj;
				 this.oi_formObj = this.lmu_ua_form.oi_formObj;

				//set event the view is waiting for --> so the childViews (for each subForm) will be initialized
				this.isFormDataLoaded = true;


				//using of setTimeout works, but is dirty !!!
				/*setTimeout(()=> {
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
				*/

            })
			.catch(err => {
				this.dialogsService.info('Error for retrieving data from server, err= ',err);
			});


	}

	ngAfterViewInit(): void {

		if (dbgPrint_lifecyclehooks)console.log("In ngAfterViewInit for user-application-component");

		//setTimeout(()=> {
		//var el = this._elementRef.nativeElement.querySelector('lmu_user_apd');
		//console.log(el);},1000);


	}

	ngAfterViewChecked() {

		//if (dbgPrint_lifecyclehooks)	console.log("In ngAfterViewChecked for user-application-component");

		//let vc = ViewChildren('input');
		//console.log("In ngAfterViewChecked,vc=",vc());

	}

	ngDoCheck():void{
		//console.log("In ngDoCheck");

		this.changeDetected = this.formEntriesChangeDetected;
		if (this.main_lmu_ua_form)
		{
			this.mainFormValid = this.main_lmu_ua_form.valid ;
		}

	}

	private setChangeDetected(value:boolean,fControl?:any) {

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
				this.formEntriesChangeDetected = value;
				this.main_lmu_ua_form.markAsDirty();
				//if (fControl) console.log("in setChangedDetected:",this.formEntriesChangeDetected, fControl);
				//else console.log("in setChangedDetected:",this.formEntriesChangeDetected);
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


	showMissingInput() {
		if (this.main_lmu_ua_form)
		{
			for (let subForm in this.main_lmu_ua_form.controls)
			{
				if (this.main_lmu_ua_form.controls[subForm].invalid)
				{

					//console.log("subform: ",this.main_lmu_ua_form.controls[subForm]);

					this.select_subFormTab(subForm.toString());

					setTimeout(()=>{  //is needed to make focus on element working ! ...i think, because of the child tab-switch
					for (let subFormControl in this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls'])
					{

						let currControl = this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls'][subFormControl];

						//if (this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls'][subFormControl].invalid)
						/*
						if (0)//(currControl['invalid'])
						{
							console.log(subFormControl, ": ", currControl);

							//hjgjj: ElementRef;
							//ViewChild('fhgfj') hjgjj;
							//console.log(this.viewChildren);

							//this._elementRef.nativeElement(subFormControl).focus();
							//navtiveElement.querySelector(subFormControl).focus();


							var el1 = this._elementRef.nativeElement.querySelector('rt-input#rtInput_'+subFormControl);
							console.log(el1);

							//setTimeout(() => {
							//var el = this._elementRef.nativeElement.querySelector('input#'+subFormControl);

							let el;

							//this._elementRef.nativeElement.querySelector('rt-input#'+subFormControl).focus();
							if (el = this._elementRef.nativeElement.querySelector('input#'+subFormControl))
							{
								console.log("input-element=",el);
								el.focus();
							}
							else if (el = this._elementRef.nativeElement.querySelector('textarea#'+subFormControl))
							{
								console.log("textarea-element=",el);
								el.focus();
							}
							else if (el = this._elementRef.nativeElement.querySelector('select#'+subFormControl))
							{
								console.log("select-element=",el);
								el.focus();
							}
							else if (el = this._elementRef.nativeElement.querySelector('p-calendar#'+subFormControl))
							{
								console.log("p-calender-element=",el);
								el.focus();
							}
							else if(el = this._elementRef.nativeElement.querySelector('div.invalidInfo'))
							{
								console.log("invalidInfo=",el);
								el.scrollIntoView('center');
							}


							//},1000);

						}


						if (0)//(currControl['invalid'])
						{
							var el1 = this._elementRef.nativeElement.querySelector('rt-input#'+subFormControl);
							console.log(el1);

							let element = document.getElementById(subFormControl); //.focus(), .scrollTo();
							console.log("element=",element);
							//element.getTar();
							//this.content.scrollTo(0, element.offsetTop, 500);
						}
						*/

						if (currControl['invalid'])
						{

							//let element = document.getElementsByTagName('md-card'); //.focus(), .scrollTo();
							//console.log("element=",element);

							let el;
							if (el = this._elementRef.nativeElement.querySelector('div.invalidInfo')) {
								//console.log("invalidInfo=", el);
								el.scrollIntoView(false);//{block:'start',inline:'smooth'});
								window.scrollBy(0,240);
								//console.log("window=",window);

								break;
							}
						}

					}
					},10);


						//console.log("subform: ",subForm, " is invalid!");

					break;
				}
			}
		}
	}

	submitForm()
	{
		//this.saveFormObj();
		//console.log("this.summaryPage_href =",this.summaryPage_href );
	}



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
