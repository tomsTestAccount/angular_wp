/**
 * Created by Tom on 24.04.2017.
 */
import { Component,OnInit,AfterViewInit,Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {RtFormService,cFormInfo} from "../_services/rt-forms.service";


//----------------------------------------------------------------------------------------------------------------------
const dbgPrint_form =false;
const dbgPrint_subForm =false;
const dbgPrint_lifecyclehooks = false;

//----------------------------------------------------------------------------------------------------------------------

@Component({
    //moduleId: module.id,
    selector: 'dynamicSubForm',
    templateUrl: 'dynamic-subform.component.html'
})
export class DynamicSubFormComponent implements OnInit, AfterViewInit{


    currentFormInfo:cFormInfo;
    currentForm:FormGroup;
    currentFormEntries:[any];
    currentMainForm:FormGroup;

    subFormChildren:[cFormInfo];

    //----------------------------------------------------

    @Input() set input_mainForm(givenForm: FormGroup){

        this.currentMainForm = <FormGroup>givenForm;
        if (dbgPrint_form) console.log(" this.mainForm=", this.currentMainForm);
    };


    @Input() set input_subFormInfo(givenFormInfo: any){

        this.currentFormInfo = givenFormInfo;
        this.currentForm = <FormGroup>this.currentMainForm.controls[givenFormInfo.key];
        if (dbgPrint_form) console.log(" this.currentForm=", this.currentForm);

    };


    //---------------------------------------------------

    constructor(private _rtFormsService:RtFormService) {};

    ngOnInit(): void {

        if (dbgPrint_lifecyclehooks) console.log("In ngOnInit for ",this.currentFormInfo.key);

        this.currentFormEntries =this.currentFormInfo.formEntries;
        this.subFormChildren = this.currentFormInfo.childrenFormsArray || [cFormInfo];

        for (let i= 0;i<this.subFormChildren.length;i++) {

            for (let y in this.subFormChildren[i].formEntries) {
                if (dbgPrint_subForm) console.log("this.subFormChildren[",i,"]=",this.subFormChildren[i]);

                if (this.subFormChildren[i].formEntries[y].defaultValue != null)
                {
                    setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
                        this.subFormChildren[i]['isShown'] = true;
                    },10);
                    break;
                }
            }
        }
    }

    ngAfterViewInit():void{
        if (dbgPrint_lifecyclehooks) console.log("In ngAfterViewInit for ",this.currentFormInfo.key);

        this._rtFormsService.setSubform_updated(this.currentFormInfo.key);
    }

    toogle_subForm_isOpened(isShown:boolean) {

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
    toggleInfo(e:any):void{
        this.showTooltip1 = !this.showTooltip1;
        e.stopPropagation();
    }
    */


}