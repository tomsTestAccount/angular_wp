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


const dbgPrint_Pe =false;

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


	usermodel : any;

	showTooltip1 = false;

	avgr2Object_formModel : any;
	/***************file upload *****************************
	 * TODO: build directive-component for that, because at the moment code is redundant
	 *


	//uploadFile: any;

	zone: NgZone;

	//--------------------------------------------


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


	//avgr2_courseObj : {name:String, ects:Number, grade:Number};

	avgr2_courseComplete: boolean;

	avgr2_courseList : Object[] ;



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

	* */
	rtValidators = new rtFormValidators;
	//----------------------------------------------------

	dbgIsOpen : boolean;


	lmu_ua_form= new lmu_ua_formList();
	currentFormObject:cFormObject;

	//ac2_formObj:cFormObject;
    ac2Open = false;

	degreeCertAvailable:boolean=true;

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
                if (dbgPrint_Pe) console.log("formCtrl.value = ", formCtrls[key].value," for ",key);
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


	//------------------- debug ---------------------------------------------

	// TODO: Remove this when we're done
	get diagnostic(){ return JSON.stringify(this.usermodel); }


	toggleDbg() : void{
		this.dbgIsOpen = !this.dbgIsOpen;
		console.log("this.dbgIsOpen=",this.dbgIsOpen);
	}

}
