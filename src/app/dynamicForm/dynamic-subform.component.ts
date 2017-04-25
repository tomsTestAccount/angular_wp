/**
 * Created by Tom on 24.04.2017.
 */
import { Component,OnInit,AfterViewInit,HostListener,Input ,NgZone,ElementRef} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {RtFormService} from "../_services/rt-forms.service";


//----------------------------------------------------------------------------------------------------------------------
const dbgPrint_form =false;
const dbgPrint_subForm =false;

const dbgPrint_lifecyclehooks = true;

//----------------------------------------------------------------------------------------------------------------------

@Component({
    //moduleId: module.id,
    selector: 'dynamicSubForm',
    //template:html,
    templateUrl: 'dynamic-subform.component.html',
    //styleUrls: ['lmu-ua-styles.css'],
    //providers: [CountryList]

})
export class DynamicSubFormComponent implements OnInit, AfterViewInit{


    //for ac
    currentFormInfo:any;
    currentForm:FormGroup;
    currentFormEntries:[any];
    currentMainForm:FormGroup;
    //for ac2
    /*subForms:[{
        form:FormGroup,
        formEntries:[any],
        isShown:boolean
    }];
    */
    subFormChildren:[any];



    showTooltip1 = false;

    avgr2Object_formModel : any;

    ac2_hasValues = false;
    test_sub_isOpened = false;

    degreeCertAvailable:boolean=false;

    //----------------------------------------------------

    @Input() set input_mainForm(givenForm: FormGroup){

        //this.currentForm = <FormGroup>givenForm.controls[0];
        this.currentMainForm = <FormGroup>givenForm;
        if (dbgPrint_form) console.log(" this.mainForm=", this.currentMainForm);

    };


    @Input() set input_subFormInfo(givenFormInfo: any){

        //this.currentForm = <FormGroup>givenForm.controls[0];
        this.currentFormInfo = givenFormInfo;
        this.currentForm = <FormGroup>this.currentMainForm.controls[givenFormInfo.key];
        if (dbgPrint_form) console.log(" this.currentForm=", this.currentForm);

    };


    @Input() set input_subFormEntries(formEntries:[any]){

        this.currentFormEntries = formEntries;
        if (dbgPrint_form) console.log("this.currentFormEntries=",this.currentFormEntries);
    };



    //@Input() set setSubForms(currentSubFormObject:{form: FormGroup,formEntries:[any]}){
    @Input() set input_subFormChildren(currentChildFormArray){

        //this.subForms.push({form:currentSubFormObject.givenSubForm,formEntries:currentSubFormObject.subFormEntries});

        if (currentChildFormArray) this.subFormChildren = currentChildFormArray;

        if (dbgPrint_subForm) console.log("this.subFormChildren=",this.subFormChildren);
    }


    /*
    @Input() set setForm2(givenForm: FormGroup){


        this.currentForm2 = <FormGroup>givenForm.controls[0];
        if (dbgPrint_subForm) console.log("this.currentForm2=",this.currentForm2);
        //let formCtrls = this.currentForm2['controls'];


    };


    @Input() set setFormEntries2(formEntries:[any]){

        this.currentFormEntries2 = formEntries;

        if (dbgPrint_subForm) console.log("this.currentFormEntries=",this.currentFormEntries2);
    };
    */

    //---------------------------------------------------

    constructor(private _rtFomrsService:RtFormService) {}


    ngOnInit(): void {

        if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for ",this.currentFormInfo.key);

        this.currentFormEntries =this.currentFormInfo.formObj.formEntries;
        //if (this.currentFormInfo.childrenFormsArray)
        this.subFormChildren = this.currentFormInfo.childrenFormsArray || [];

        //if (this.subFormChildren ==) this.subFormChildren = [];

        for (let i= 0;i<this.subFormChildren.length;i++) {

            for (let y in this.subFormChildren[i].formObj.formEntries)
                {

                    if (this.subFormChildren[i].formObj.formEntries[y].defaultValue != null)
                    {
                        setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
                            this.subFormChildren[i]['isShown'] = true;
                        },10);
                        //break;
                    }

                    //console.log("this.subForms[",i,"].formEntries[",y,"]=",this.subFormChildren[i].formObj.formEntries[y]);
                    console.log("this.subFormChildren[",i,"]=",this.subFormChildren[i]);
                }

        }

        /*
        setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
            this.subForms[0]['hasValues'] = true;
        },10);
        */

        //if (dbgPrint_subForm) console.log("In LmuUserPeComponent,ngAfterViewInit this.ac2_hasValues",this.ac2_hasValues);
    }

    ngAfterViewInit():void{
        if (dbgPrint_lifecyclehooks) console.log("In ngAfterViewInit for ",this.currentFormInfo.key);


        //check/uncheck checkbox for sub-subform
        /*for (let key in this.currentForm2['controls']) //for (let key in this.currentForm2['controls'])
        {
            //console.log("formCtrl = ", key);

            if (this.currentForm2['controls'][key].value !== null &&
                this.currentForm2['controls'][key].value !== '' &&
                this.currentForm2['controls'][key].value !== [] &&
                this.currentForm2['controls'][key].value !== 'undefined')
            {
                if (dbgPrint_subForm) console.log("this.currentForm2['controls'].value = ", this.currentForm2['controls'][key].value," for ",key);
                setTimeout(()=> {this.ac2_hasValues = true},10);
                //this.ac2_hasValues = true;
            }
        }
        */

        //this._rtFomrsService.set_subForm_PE_Updated(true);
        this._rtFomrsService.setSubform_updated(this.currentFormInfo.key);
    }

    /*ngAfterViewInit():void{
     this._rtFomrsService.set_subForm_PE_Updated(true);
     };
     */

    toogle_subForm_isOpened(isShown:boolean) {

        //if (currentsubForm) console.log("currentsubForm = ",currentsubForm);

        setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
            /*if (!this.subForms[0]['hasValues']  )
            {
                this.test_sub_isOpened = false;
            }
            else
            {
                this.test_sub_isOpened = true;
            }*/
            isShown = !isShown;
        },10);

    }




    /*
     onChange(e:any):void{
     //this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
     //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
     if (dbgPrint_form) console.log((<FormControl>this.peForm.controls['typeOfInst4bach']));
     if (dbgPrint_form) console.log("e=",e);
     if (dbgPrint_form) console.log("this.peForm=",this.peForm);
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