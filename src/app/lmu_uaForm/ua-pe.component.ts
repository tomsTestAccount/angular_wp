import { Component,OnInit,AfterViewInit,HostListener,Input ,NgZone,ElementRef} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

import { CountryList} from '../_models/countries';

import {rtFormValidators}  from '../_services/rt-form-validators.service';

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
import {ValidateFn} from "codelyzer/walkerFactory/walkerFn";


const dbgPrint_ac =false;
const dbgPrint_ac2 =false;

@Component({
	//moduleId: module.id,
	selector: 'lmu_user_pe',
    //template:html,
	templateUrl: 'ua-pe.component.html',
	//styleUrls: ['lmu-ua-styles.css'],
	//providers: [CountryList]

})

export class LmuUserPeComponent implements AfterViewInit{


	//for ac
	currentForm:FormGroup;
	currentFormEntries:[any];

	//for ac2
	currentForm2:FormGroup;
	currentFormEntries2:[any];

	showTooltip1 = false;

	avgr2Object_formModel : any;

    ac2_hasValues = false;

	degreeCertAvailable:boolean=false;

	//----------------------------------------------------


    @Input() set setForm(givenForm: FormGroup){

        if (dbgPrint_ac) console.log("givenForm=",givenForm);
        this.currentForm = <FormGroup>givenForm.controls[0];

    };


	@Input() set setFormEntries(formEntries:[any]){

		this.currentFormEntries = formEntries;
		if (dbgPrint_ac) console.log("this.currentFormEntries=",this.currentFormEntries);
	};



    @Input() set setForm2(givenForm: FormGroup){


        this.currentForm2 = <FormGroup>givenForm.controls[0];
        if (dbgPrint_ac2) console.log("this.currentForm2=",this.currentForm2);
        let formCtrls = this.currentForm2['controls'];
        for (let key in formCtrls)
        {
            //console.log("formCtrl = ", key);

            if (formCtrls[key].value !== '' &&
                formCtrls[key].value!== [] &&
                formCtrls[key].value !== 'undefined')
            {
                if (dbgPrint_ac2) console.log("formCtrl.value = ", formCtrls[key].value," for ",key);
                this.ac2_hasValues = true;
            }
        }

    };


    @Input() set setFormEntries2(formEntries:[any]){

        this.currentFormEntries2 = formEntries;

        if (dbgPrint_ac2) console.log("this.currentFormEntries=",this.currentFormEntries2);
    };


	//---------------------------------------------------

	constructor() {}

    ngAfterViewInit():void{
	//ngOnInit(): void {

		//TODO: create a more general implementation for that kind of 'collapsible'-forms - or formEntries (i.e ac2)
		//open/close degreeCertAvailable at init-time, if either copy-of-certifcate is loaded or not-->
		for (let i= 0;i<this.currentFormEntries.length;i++) {
			if (this.currentFormEntries[i].key == 'copy_of_certificate')
			{

				if (this.currentFormEntries[i].defaultValue != null)
				{
					if (this.currentFormEntries[i].defaultValue.filename != null)
					{
						setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
							this.degreeCertAvailable = true;
						},1);

					}
				}
			}

		}

		this.toggle_degreeCertAvailable();

        if (dbgPrint_ac) console.log("In LmuUserPeComponent,ngAfterViewInit this.ac2_hasValues",this.ac2_hasValues);
	}


	nullValidator(c: FormControl) {
	return null;
	}

	toggle_degreeCertAvailable(this_component?)
	{
		//if (this_component) console.log("this_component",this_component);
		setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
			//this.degreeCertAvailable = !this.degreeCertAvailable;
			if (!this.degreeCertAvailable )
			{
				//this.currentForm.setControl('copy_of_certificate', new FormControl(''));
				//this.currentForm.removeControl('copy_of_certificate');

				//this.currentForm.controls['copy_of_certificate'].clearValidators();
				//this.currentForm.controls['copy_of_certificate'].setValidators(Validators.nullValidator);

				this.currentForm.controls['copy_of_certificate'].disable();
			}
			else {
				//this.currentForm.addControl('copy_of_certificate', new FormControl('', Validators.required));
				//this.currentForm.setControl('copy_of_certificate', new FormControl('', Validators.required));
				//nullValidator : ValidateFn;

				//this.currentForm.controls['copy_of_certificate'].setValidators(Validators.required);

				this.currentForm.controls['copy_of_certificate'].enable();
			}
		},1);

	}


	formInputValid(formInput:string)
	{
		return false;
	}

	/*
	onChange(e:any):void{
		//this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
		//(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
		if (dbgPrint_ac) console.log((<FormControl>this.peForm.controls['typeOfInst4bach']));
		if (dbgPrint_ac) console.log("e=",e);
		if (dbgPrint_ac) console.log("this.peForm=",this.peForm);
	}
	*/

	//----------- has previous degree yet section



	toggleInfo(e:any):void{
		this.showTooltip1 = !this.showTooltip1;
		e.stopPropagation();
	}


}
