import { Component,OnInit,AfterViewInit,HostListener,Input ,NgZone,ElementRef} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {RtFormService} from "../_services/rt-forms.service";


//----------------------------------------------------------------------------------------------------------------------
const dbgPrint_ac =false;
const dbgPrint_ac2 =false;

const dbgPrint_lifecyclehooks = true;

//----------------------------------------------------------------------------------------------------------------------

@Component({
	//moduleId: module.id,
	selector: 'lmu_user_pe',
    //template:html,
	templateUrl: 'ua-pe.component.html',
	//styleUrls: ['lmu-ua-styles.css'],
	//providers: [CountryList]

})
export class LmuUserPeComponent implements OnInit, AfterViewInit{


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
        //let formCtrls = this.currentForm2['controls'];


    };


    @Input() set setFormEntries2(formEntries:[any]){

        this.currentFormEntries2 = formEntries;

        if (dbgPrint_ac2) console.log("this.currentFormEntries=",this.currentFormEntries2);
    };


	//---------------------------------------------------

	constructor(private _rtFomrsService:RtFormService) {}


	ngOnInit(): void {

		if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for pe-component");

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
						},10);
					}
				}
			}
		}

		this.toggle_degreeCertAvailable();

        if (dbgPrint_ac2) console.log("In LmuUserPeComponent,ngAfterViewInit this.ac2_hasValues",this.ac2_hasValues);
	}

	ngAfterViewInit():void{
		if (dbgPrint_lifecyclehooks) console.log("In ngAfterViewInit for pe-component");


		//check/uncheck checkbox for sub-subform
		for (let key in this.currentForm2['controls'])
		{
			//console.log("formCtrl = ", key);

			if (this.currentForm2['controls'][key].value !== null &&
				this.currentForm2['controls'][key].value !== '' &&
				this.currentForm2['controls'][key].value !== [] &&
				this.currentForm2['controls'][key].value !== 'undefined')
			{
				if (dbgPrint_ac2) console.log("this.currentForm2['controls'].value = ", this.currentForm2['controls'][key].value," for ",key);
		 		setTimeout(()=> {this.ac2_hasValues = true},10);
				//this.ac2_hasValues = true;
			}
		}

		this._rtFomrsService.set_subForm_PE_Updated(true);
	}

	/*ngAfterViewInit():void{
		this._rtFomrsService.set_subForm_PE_Updated(true);
	};
	*/

	toggle_degreeCertAvailable(this_component?) {

		setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
			if (!this.degreeCertAvailable )
			{
				this.currentForm.controls['copy_of_certificate'].disable();
			}
			else
			{
				this.currentForm.controls['copy_of_certificate'].enable();
			}
		},1);

	}




	/*
	onChange(e:any):void{
		//this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
		//(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
		if (dbgPrint_ac) console.log((<FormControl>this.peForm.controls['typeOfInst4bach']));
		if (dbgPrint_ac) console.log("e=",e);
		if (dbgPrint_ac) console.log("this.peForm=",this.peForm);
	}

	 nullValidator(c: FormControl) {
	 return null;
	 }
	 formInputValid(formInput:string)
	 {
	 return false;
	 }

	 */



	//----------- has previous degree yet section



	toggleInfo(e:any):void{
		this.showTooltip1 = !this.showTooltip1;
		e.stopPropagation();
	}


}
