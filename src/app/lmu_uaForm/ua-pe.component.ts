import { Component,OnInit,AfterViewInit,HostListener,Input ,NgZone,ElementRef} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

import { CountryList} from '../_models/countries';

import {rtFormValidators}  from '../_services/rt-form-validators.service';

import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';

//@import 'app/candy-carousel/candy-carousel-theme.scss';

//for animations
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';


//var html = require('./ua-pe.component.html!text');


const dbgPrint_Pe =true;

@Component({
	//moduleId: module.id,
	selector: 'lmu_user_pe',
    //template:html,
	templateUrl: 'ua-pe.component.html',
	//styleUrls: ['lmu-ua-styles.css'],
	//providers: [CountryList]

})

/*
export interface Avgr2Obj {
	name: string;
	ects: number;
	grade: number;
}
*/





//---------------------------------------------------------

export class LmuUserPeComponent implements AfterViewInit{

	peForm : FormGroup;

	peForm_inner : FormGroup;

	countries : any;

	usermodel : any;

	/***************file upload *****************************
	 * TODO: build directive-component for that, because at the moment code is redundant
	 *
	 * */

	//uploadFile: any;

	zone: NgZone;

	//--------------------------------------------

	showTooltip1 = false;
	fU_progress: number = 0;
	fU_response: any = {};

	hasBaseDropZoneOver: boolean = false;
	options_degreeUpload: Object;
	uploadedData_Degree : any[];

	//-----------------------------------------------

	fU_progress2: number = 0;
	fU_response2: any = {};
	hasBaseDropZoneOver2 : boolean = false;
	options_transcriptOrOtherGrades: Object;
	uploadedData_transcriptOrOtherGrades : any[];

	secParagraphText_toG : string[] = [`Please provide evidence of your English Language Proficiency.`,
	`Note: German proficiency is no requirement, as our program is exclusively taught and assessed in English.`,
	`Different information on the website of LMU International Office may be ignored as this applies only to German programs.`];


	//----------------------------------------------------
	/*
		avgr2_courseObj : Object;
		avgr2_courselist : Object[];
	*/

	//avgr2_courseObj : {name:String, ects:Number, grade:Number};

	avgr2_courseComplete: boolean;

	avgr2_courseList : Object[] ;

	avgr2Object_formModel : any;

	avgr2_newCourseObj : Object ;
	//----------------------------------------------------

	avgr3_courseComplete: boolean;

	avgr3_courseList : Object[] ;

	avgr3Object_formModel : any;

	avgr3_newCourseObj : Object ;

	//----------------------------------------------------
	fU_progress3: number = 0;
	fU_response3: any = {};
	hasBaseDropZoneOver3: boolean = false;
	options_proofEnglish: Object;
	uploadedData_proofEnglish: any[];

	//---------------------------------------------------

	formEntries:Object[];

	rtValidators = new rtFormValidators;
	//----------------------------------------------------

	dbgIsOpen : boolean;


	lmu_ua_form= new lmu_ua_formList();
	currentFormObject:cFormObject;

	//ac2_formObj:cFormObject;
    ac2Open = false;
	//----------------------------------------------------



	currentForm:FormGroup;
    @Input() set setForm(givenForm: FormGroup){

        if (dbgPrint_Pe) console.log("givenForm=",givenForm);
        this.currentForm = <FormGroup>givenForm.controls[0];
        //this.currentForm = givenForm;

    };

	currentFormEntries:[any];
	@Input() set setFormEntries(formEntries:[any]){

		this.currentFormEntries = formEntries;

	};


    currentForm2:FormGroup;
    @Input() set setForm2(givenForm: FormGroup){


        this.currentForm2 = <FormGroup>givenForm.controls[0];
        if (dbgPrint_Pe) console.log("this.currentFormObject2=",this.currentForm2);
        let formCtrls = this.currentForm2['controls'];
        for (let key in formCtrls)
        {
            //console.log("formCtrl = ", key);

            if (formCtrls[key].value !== '' &&
                formCtrls[key].value!== [] &&
                formCtrls[key].value !== 'undefined')
            {
                //if (dbgPrint_Pe)
                    console.log("formCtrl.value = ", formCtrls[key].value," for ",key);
                this.ac2Open = true;
            }
        }

    };

    currentFormEntries2:[any];
    @Input() set setFormEntries2(formEntries:[any]){

        this.currentFormEntries2 = formEntries;

        if (dbgPrint_Pe) console.log("this.currentFormEntries=",this.currentFormEntries2);
    };


	constructor(private fb: FormBuilder) {

	}

	//---------------------------------------------------

	/*
	validateArray(c: FormControl) {


		let retValue = null;
		if (c != undefined) {

			retValue = (c.value.length == 0) ? {notA: true} : null;

			console.log("In validateArray, c=",c, ', c.value.length=', c.value.length);
		}
		return retValue

	}
	*/

	/*
	ngAfterViewChecked(){
		console.log("In afterViewchecked ac this.currentFormObject=",this.currentFormObject);
	}
	*/


    ngAfterViewInit():void{
	//ngOnInit(): void {

		//if (dbgPrint_Pe)
        if (dbgPrint_Pe) console.log("In LmuUserPeComponent,ngAfterViewInit ac this.currentFormObject=",this.currentFormObject);
        if (dbgPrint_Pe) console.log("In LmuUserPeComponent,ngAfterViewInit ac this.currentFormEntries=",this.currentFormEntries);

		//this.buildForm();
		//this.isDragDropAvailable();

        if (dbgPrint_Pe) console.log("In LmuUserPeComponent,ngAfterViewInit this.ac2Open",this.ac2Open);
	}



	onFormStatusChanged(data)
	{
		var tmpStatus = false;

		if( data === 'VALID')
		{
			console.log("onFormStatusChanged",data);
			tmpStatus = true;
		}

		this.usermodel = this.peForm;

		//this.onFormEvent_pe.emit(tmpStatus);

	}

	onFormStatusChanged_2(data)
	{
		var tmpStatus = false;

		if( data === 'VALID')
		{
			console.log("onFormStatusChanged_2",data);
			tmpStatus = true;
		}

		this.avgr2Object_formModel = this.peForm_inner;

		//this.onFormEvent_pe.emit(tmpStatus);

	}


	formInputValid(formInput:string)
	{
		return false;
	}

	onChange(e:any):void{
		//this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
		//(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
		if (dbgPrint_Pe) console.log((<FormControl>this.peForm.controls['typeOfInst4bach']));
		if (dbgPrint_Pe) console.log("e=",e);
		if (dbgPrint_Pe) console.log("this.peForm=",this.peForm);
	}

	//----------- has previous degree yet section

	/*
	hasDegreeToggled(e:any):void{

		this.peForm.value.degreeCertNotAvailable = e.checked;
		console.log("peForm=",this.peForm, e);

	}
	*/


	toggleInfo(e:any):void{
		this.showTooltip1 = !this.showTooltip1;
		e.stopPropagation();
	}

	//----------- for file upload -----------------------------------------------
/*
	bIsDDavailable = false;

	isDragDropAvailable(){
		var div = document.createElement('div');
		this.bIsDDavailable = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
		//console.log("bIsDDavailable=",this.bIsDDavailable);
	}

	getFileSize(bytes:number):string{
		if(bytes == 0) return '0 Byte';
		var k = 1000;
		var decimals = 2;
		var dm = decimals || 3;
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		var i = Math.floor(Math.log(bytes) / Math.log(k));
		return +parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}


	//------ for degreeCertificate

	handleUpload_degreeUpload(data): void {
		this.zone.run(() => {

			this.hasBaseDropZoneOver = null;

			this.fU_response = data;

			this.fU_progress = Math.floor(data.progress.percent / 100);

			if (data && data.response)
			{
				this.uploadedData_Degree.push(data);
				console.log("uploaded file=",data);
			}
		});




	}

	fileOverBase_degreeUpload(e:any):void {
		this.hasBaseDropZoneOver = e;

		//this.style.background = 'blue';
		//this.pRnd.setElementStyle(this.pEl.nativeElement, 'backgroundColor', 'green');
	}


	delete_degreeUpload(file:any):void{
		//console.log("delete file=",file);
		let index = this.uploadedData_Degree.indexOf(file);
		if (index > -1) {
			this.uploadedData_Degree.splice(index, 1);
		}
	}

	//--------------- for transcript of records or other proof of grades

	handleUpload_transcriptOrOtherGrades(data): void {
		this.zone.run(() => {

			this.hasBaseDropZoneOver2 = null;

			this.fU_response2 = data;

			this.fU_progress2 = Math.floor(data.progress.percent / 100);

			if (data && data.response)
			{
				this.uploadedData_transcriptOrOtherGrades.push(data);
				console.log("uploaded file=",data);
			}
		});




	}

	fileOverBase_transcriptOrOtherGrades(e:any):void {
		this.hasBaseDropZoneOver2 = e;

		//this.style.background = 'blue';
		//this.pRnd.setElementStyle(this.pEl.nativeElement, 'backgroundColor', 'green');
	}


	delete_transcriptOrOtherGrades(file:any):void{
		//console.log("delete file=",file);
		let index = this.uploadedData_transcriptOrOtherGrades.indexOf(file);
		if (index > -1) {
			this.uploadedData_transcriptOrOtherGrades.splice(index, 1);
		}
	}
*/
	//------------------- avgr2 --------------------------------------------
/*
	addNewLine_grTbl(courseType:string):void {

		//let tmpObj : Avgr2Obj = {name:"",ects:0,grade:0};
		let tmpObj = {name:"",ects:0,grade:0,courseComplete:false};

		if (courseType == 'avgr2')
		{
			//this.avgr2_courseList.push(tmpObj);
			this.avgr2_newCourseObj = tmpObj;
			this.avgr2_courseComplete = false;
		}
		else if (courseType == 'avgr3')
		{
			//this.avgr2_courseList.push(tmpObj);
			this.avgr3_newCourseObj = tmpObj;
			this.avgr3_courseComplete = false;
		}

	}

	cancelNewLine_grTbl(courseType:string):void{

		if (courseType == 'avgr2') this.avgr2_newCourseObj = null;
		else if (courseType == 'avgr3') this.avgr3_newCourseObj = null;
	}


	addCourseToList(courseType:string):void {
		if (courseType == 'avgr2')
		{
			this.avgr2_courseList.push(this.avgr2_newCourseObj);
			this.avgr2_newCourseObj = null;
		}
		else if (courseType == 'avgr3')
		{
			this.avgr3_courseList.push(this.avgr3_newCourseObj);
			this.avgr3_newCourseObj = null;
		}
	}

	deleteCourseFromList(courseType:string,courseItem):void {
		if (courseType == 'avgr2') {
			//console.log("delete courseItem=", courseItem);
			let index = this.avgr2_courseList.indexOf(courseItem);
			if (index > -1) {
				this.avgr2_courseList.splice(index, 1);
			}
		}
		else if (courseType == 'avgr3')
		{
			//console.log("delete courseItem=", courseItem);
			let index = this.avgr3_courseList.indexOf(courseItem);
			if (index > -1) {
				this.avgr3_courseList.splice(index, 1);
			}
		}

	}


	change_courseName(obj:Object,evt):void{
		//console.log("change Name=", evt.target.value);
		obj['name'] =  evt.target.value;
		//console.log("change Name=", course);
		this.checkNewCourseObj(obj);
	}

	change_courseECTS(obj:Object,evt):void{
		//console.log("change Name=", evt.target.value);
		obj['ects'] =  evt.target.value;
		//console.log("change Name=", course);
		this.checkNewCourseObj(obj);
	}

	change_courseGrade(obj:Object,evt):void{
		//console.log("change Name=", evt.target.value);
		obj['grade'] =  evt.target.value;
		//console.log("change Name=", course);
		this.checkNewCourseObj(obj);
	}

	checkNewCourseObj(obj:Object):void{
		if (obj['name'] !='' && obj['ects']!=0 && obj['grade']!=0)
		{
			obj['courseComplete'] = true;
		}
		else { obj['courseComplete'] = false}
	}
*/
	/*
	//------------------- proofEnglish -------------------------------------

	handleUpload(section:string,data): void {
		if (section=='proofEnglish') {
			this.zone.run(() => {

				this.hasBaseDropZoneOver3 = null;

				this.fU_response3 = data;

				this.fU_progress3 = Math.floor(data.progress.percent / 100);

				if (data && data.response) {
					this.uploadedData_proofEnglish.push(data);
					console.log("uploaded file=", data);
				}
			});
		}

	}

	fileOverBase(section:string,e:any):void {
		if (section=='proofEnglish') {
			this.hasBaseDropZoneOver3 = e;
		}

	}


	deleteFile(section:string,file:any):void{
		//console.log("delete file=",file);
		if (section=='proofEnglish') {
			let index = this.uploadedData_proofEnglish.indexOf(file);
			if (index > -1) {
				this.uploadedData_proofEnglish.splice(index, 1);
			}
		}
	}

*/

	//------------------- debug ---------------------------------------------

	// TODO: Remove this when we're done
	get diagnostic(){ return JSON.stringify(this.usermodel); }


	toggleDbg() : void{
		this.dbgIsOpen = !this.dbgIsOpen;
		console.log("this.dbgIsOpen=",this.dbgIsOpen);
	}

}
