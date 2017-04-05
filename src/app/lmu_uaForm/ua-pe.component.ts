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

    ac2Open = false;

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
                this.ac2Open = true;
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
						this.degreeCertAvailable = true;
					}
				}
			}

		}

        if (dbgPrint_ac) console.log("In LmuUserPeComponent,ngAfterViewInit this.ac2Open",this.ac2Open);
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
