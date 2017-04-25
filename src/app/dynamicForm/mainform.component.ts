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
const dbgPrint_save = true;
const dbgPrint_formChanged = false;
const dbgPrint_formEntryChanged = true;
const dbgPrint_setChildSubForms = true;


@Component({
	//moduleId: module.id,
	selector: 'my-userApplication',
    //template:html,
    //styles:[css]
	templateUrl: 'mainForm.component.html',
	styleUrls: ['mainForm.component.css'],
})
export class UserApplicationComponent implements OnInit,AfterViewInit,DoCheck{


	selectedIndex : number;


	formStruct:{
		mainForm:FormGroup,
		subForms:[any]					//Todo: define given object exactly ( title: string,key: string, formObj:cFormObject,site: string,	embedded?: boolean)
	};

	//subFormEntries :[any];
	//------------------------------------------
	main_FormGroup : FormGroup;
	sub_FormGroups : [FormGroup];
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

		this.formStruct = this.lmu_ua_form.get_formInfos();
		this.main_FormGroup = this.formStruct.mainForm;

		//detect changes for form made by server --> detect when download form-data finished and child-views are initialized
		//TODO: We have to know here, when the init-process of child-Views (subFomrs) is finished !?! .... using of lifeCycleHooks (afterContent .. ) ??

		this._rtFormSrv.subFormsAreUpdated$.subscribe(
			isUpdated => {
				setTimeout(()=> {		//not needed , but let the modal-dialog displayed at least for 1sec
					//this.main_FormGroup = this.lmu_ua_form.init_mainForm();
					//if (dbgPrint)
					console.log("In subFormsAreAllUpdated$ ", this.main_FormGroup);

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

				this.formStruct = this.lmu_ua_form.get_formInfos();
				this.main_FormGroup = this.formStruct.mainForm;


				//set event the view is waiting for --> so the childViews (for each subForm) will be initialized
				this.isFormDataLoaded = true;

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
		if (this.main_FormGroup)
		{
			this.mainFormValid = this.main_FormGroup.valid ;
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
				this.main_FormGroup.markAsDirty();
				//if (fControl) console.log("in setChangedDetected:",this.formEntriesChangeDetected, fControl);
				//else console.log("in setChangedDetected:",this.formEntriesChangeDetected);
			}, 100);
		}

	}

	private reset_formChangedEntries() {
		/*this.formChangedEntries = {
			subFormGroup_ac: {0: {}},
			subFormGroup_ac2: {0: {}},
			subFormGroup_apd: {0: {}},
			subFormGroup_oi: {0: {}},
		*/
	}

	private subscribeMainFormValuesChanged() {
		/*this.main_FormGroup.controls['subFormGroup_ac'].valueChanges
            .subscribe(x => {
				console.log("in ValueChanged x = ",this.main_FormGroup);
				if (this.main_FormGroup.dirty) this.setChangeDetected(true);
			});
		*/

		this.main_FormGroup.valueChanges
            .subscribe(x => {
				console.log("in ValueChanged x = ",x);
				console.log("in this.main_FormGroup=",this.main_FormGroup);
				if (this.main_FormGroup.dirty) this.setChangeDetected(true);
			});
	}

	private subscribeToFormEntriesChanges() {

		this.main_FormGroup.markAsPristine();
		this.main_FormGroup.markAsUntouched();

		for (let subFormName in this.main_FormGroup.controls) {

			for (let fControl in  (<FormControl>this.main_FormGroup.controls[subFormName]['controls'])) {

				this.main_FormGroup.controls[subFormName]['controls'][fControl].valueChanges
                    .subscribe(x => {

						if (dbgPrint_formEntryChanged) console.log("formControl", fControl," for subForm=",subFormName);
                    	//this.formChangedEntries.subFormGroup_apd[0][fControl] = x;

						if (this._rtFormSrv.formEntries_changed_ObjList[subFormName] == undefined) this._rtFormSrv.formEntries_changed_ObjList[subFormName] = {};
						this._rtFormSrv.formEntries_changed_ObjList[subFormName][fControl] = x;

						if (this.main_FormGroup.dirty) this.setChangeDetected(true,fControl);
					});
			}
		}



		/*

		 if (dbgPrint_formEntryChanged) console.log("form=",this.main_FormGroup.controls['subFormGroup_apd']);

		//for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_apd']['controls'][0]['controls']))
		for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_apd']['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_FormGroup.controls['subFormGroup_apd']['controls'][fControl].valueChanges
				.subscribe(x => {
					this.formChangedEntries.subFormGroup_apd[0][fControl] = x;
				//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
				//this.lastValue = x[0];
				//console.log("in ValueChanged x = ",x);
				 if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_FormGroup.controls['subFormGroup_apd']['controls'][fControl]);
				 if (this.main_FormGroup.dirty) this.setChangeDetected(true,fControl);
				});
		}

		//for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_ac']['controls'][0]['controls']))
		for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_ac']['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_FormGroup.controls['subFormGroup_ac']['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_ac[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					//if (dbgPrint_formEntryChanged)console.log("formControl", fControl," =",this.main_FormGroup.controls['subFormGroup_ac']['controls'][fControl]);
					if (this.main_FormGroup.dirty == true) this.setChangeDetected(true,fControl);
				});
		}

		//for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_ac2']['controls'][0]['controls']))
		for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_ac2']['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_FormGroup.controls['subFormGroup_ac2']['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_ac2[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_FormGroup.controls['subFormGroup_ac2']['controls'][fControl]);
					if (this.main_FormGroup.dirty) this.setChangeDetected(true,fControl);
				});
		}

		//for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_oi']['controls'][0]['controls']))
		for (let fControl in  (<FormControl>this.main_FormGroup.controls['subFormGroup_oi']['controls']))
		{
			//let castVar = (<FormControl>fControl);
			this.main_FormGroup.controls['subFormGroup_oi']['controls'][fControl].valueChanges
                .subscribe(x => {
					this.formChangedEntries.subFormGroup_oi[0][fControl] = x;
					//this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
					//this.lastValue = x[0];
					//console.log("in ValueChanged x = ",x);
					if (dbgPrint_formEntryChanged) console.log("formControl", fControl," =",this.main_FormGroup.controls['subFormGroup_oi']['controls'][fControl]);
					if (this.main_FormGroup.dirty) this.setChangeDetected(true,fControl);
				});
		}
		*/

		//this.reset_formChangedEntries();
		this._rtFormSrv.reset_formEntries_changed_ObjList();
		this.setChangeDetected(false);

	 }

	saveFormObj() {

		//this._rtRestService.setUaObject(this._authService.auth_getCurrentUser(),this.main_FormGroup.value);

        if (dbgPrint_save) console.log("In saveFormObj, this.main_FormGroup=",this.main_FormGroup.value);
		if (dbgPrint_save) console.log("In saveFormObj, this.formChangedEntries=",this._rtFormSrv.formEntries_changed_ObjList);


        this._authService.auth_setFormObj(this._rtFormSrv.formEntries_changed_ObjList,true)
			.then(response => {console.log("Save Data Successful",response)})
			.catch(err => {
				if (err.statusText) this.dialogsService.info('Save Data Error:' + err.statusText ,err._body);
				else this.dialogsService.info('Save Data Error:',err);
				//console.log("In saveFormObj err=",err)
			}) ;

		this.setChangeDetected(false);
		//this.reset_formChangedEntries();
		this._rtFormSrv.reset_formEntries_changed_ObjList();
	}


	select_subFormTab(wantedSubForm: string) {
		//if (dbgPrint)
		console.log("In select_comp4User, wantedSubForm=",wantedSubForm);

		let foundTab = false;

		for (let i=0;i<this.formStruct.subForms.length;i++) {

			if (this.formStruct.subForms[i].key === wantedSubForm)
			{
				for (let j=0;j<this.formStruct.subForms.length;j++)
				{
					if (this.formStruct.subForms[j].key == this.formStruct.subForms[i].site)
					{
						this.selectedIndex = j;
						foundTab = true;
					}
				}
			}
		}

		//iterate over subForm-children
		if (foundTab == false)
		{
			for (let i=0;i<this.formStruct.subForms.length;i++) {

				if (this.formStruct.subForms[i].childrenFormsArray !== undefined) {

					for (let k = 0; k < this.formStruct.subForms[i].childrenFormsArray.length; k++) {

						if (this.formStruct.subForms[i].childrenFormsArray[k].key === wantedSubForm) {
							for (let j = 0; j < this.formStruct.subForms.length; j++) {
								if (this.formStruct.subForms[j].key == this.formStruct.subForms[i].childrenFormsArray[k].site) {
									this.selectedIndex = j;
									foundTab = true;
								}
							}
						}
					}
				}
			}
		}
	}


	showMissingInput() {
		if (this.main_FormGroup)
		{
			for (let subForm in this.main_FormGroup.controls)
			{
				if (this.main_FormGroup.controls[subForm].invalid)
				{

					//console.log("subform: ",this.main_FormGroup.controls[subForm]);

					this.select_subFormTab(subForm.toString());

					setTimeout(()=>{  //is needed to make focus on element working ! ...i think, because of the child tab-switch
					for (let subFormControl in this.main_FormGroup.controls[subForm]['controls'])
					{

						let currControl = this.main_FormGroup.controls[subForm]['controls'][subFormControl];

						//if (this.main_FormGroup.controls[subForm]['controls'][subFormControl].invalid)
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

		console.log("In user-application ngAfterViewInit2, after get data!",this.main_FormGroup);
		/*//console.log("this.main_FormGroup=",this.main_FormGroup);
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
