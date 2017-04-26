import {
	Component, OnInit, AfterViewInit, DoCheck, ElementRef
} from '@angular/core';

import {FormGroup,FormControl} from '@angular/forms';

//import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cWholeFormObject} from '../_services/rt-forms.service';

import {AuthenticationService} from  '../_services/rt-authentication.service';
import {ServerConfigs} from '../_models/configFile';
import {DialogsService} from '../_services/dialogs.services'


//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_lifecyclehooks = false;
const dbgPrint_save = false;
const dbgPrint_formChanged = false;
const dbgPrint_formEntryChanged = false;
const dbgPrint_setChildSubForms = false;
const dbgPrint_updateData = false;


//----------------------------------------------------------------------------------------------------------------------

@Component({
	//moduleId: module.id,
	selector: 'rt-mainForm',
    //template:html,
    //styles:[css]
	templateUrl: 'mainForm.component.html',
	styleUrls: ['mainForm.component.css'],
})
export class MainFormComponent implements OnInit,AfterViewInit,DoCheck{


	selectedIndex : number;

	formStruct: cWholeFormObject;

	//------------------------------------------
	main_FormGroup : FormGroup;
	sub_FormGroups : [FormGroup];
	//-------------------------------------------


	dbgIsOpen = false;

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
				//private lmu_ua_form: lmu_ua_formList,
				private dialogsService: DialogsService
				)
    {

		let serverURL = serverConfs.get_serverConfigs().url;
		let userId = serverConfs.get_serverConfigs().userId;
		this.summaryPage_href = serverURL + '/applications/' + userId + '/' + userId ;

		//this.formStruct = this.lmu_ua_form.get_formInfos();

		this.formStruct = this._rtFormSrv.get_formInfos();
		this.main_FormGroup = this.formStruct.mainForm.formGroup;

		//detect changes for form made by server --> detect when download form-data finished and child-views are initialized
		//TODO: We have to know here, when the init-process of child-Views (subFomrs) is finished !?! .... using of lifeCycleHooks (afterContent .. ) ??

		this._rtFormSrv.subFormsAreUpdated$.subscribe(
			isUpdated => {
				setTimeout(()=> {		//not needed , but let the modal-dialog displayed at least for 1sec

					if (dbgPrint_updateData) console.log("In subFormsAreAllUpdated$ ", this.main_FormGroup);

					// subscribe to form changes, so we can detect the formEntries that were changed --> and send only these ones
					this.subscribeToFormEntriesChanges();

					//close loading dialog
					this.dialogsService.closeDialog();
				},1000);
			}
		);


	};


	ngOnInit(): void {


		if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for user-application-component");

		this.dialogsService.loading('Your data is loading ... '); //TODO: put this or a similar message at the beginning -> i.e. in app.component.ts

		this._authService.auth_getFormObject()
            .then(response => {

				if (dbgPrint_lifecyclehooks)console.log("In ngOnInit for user-application , after get data from server, data=!",response);

				this.formStruct = this._rtFormSrv.get_formInfos();
				this.main_FormGroup = this.formStruct.mainForm.formGroup;

				//set event the view is waiting for --> so the childViews (for each subForm) will be initialized
				this.isFormDataLoaded = true;

            })
			.catch(err => {
				this.dialogsService.info('Error for retrieving data from server, err= ',err);
			});


	}

	ngAfterViewInit(): void {

		if (dbgPrint_lifecyclehooks)console.log("In ngAfterViewInit for user-application-component");

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

	private subscribeMainFormValuesChanged() {

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




	//---------------------- dbg

	showDbg(){

		console.log("In user-application ngAfterViewInit2, after get data!",this.main_FormGroup);
	}

}
