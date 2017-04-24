import {Validators, FormGroup, FormControl } from '@angular/forms';
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

export class cFormObject {
    constructor(
        public formgroup : FormGroup,
        public formEntries:any[]
        //public isRequired:boolean
     ){}
}

/*
export class uaFormObj {
    apd_formObj : cFormObject;
    ac_formObj : cFormObject;
    ac2_formObj : cFormObject;
    oi_formObj : cFormObject;
};
*/

const dbg_print = false;



@Injectable()
export class RtFormService {


    //---------------- subForm - services - vor view/data init --------------------------------



    private subForm_APD_Updated = false;
    private subForm_PE_Updated = false;
    private subForm_OI_Updated = false;

    private subFormsAreUpdated_Src = new Subject<boolean>();



    //subForm_APD_Updated$ = this.subForm_APD_Updated_Src.asObservable();
    set_subForm_APD_Updated(bVal : boolean) {
        this.subForm_APD_Updated = bVal;
        if (dbg_print) console.log("In rtFormService subForm_APD_Updated$");

        this.checkAllSubformsUpdated();
    }

    //subForm_PE_Updated$ = this.subForm_PE_Updated_Src.asObservable();
    set_subForm_PE_Updated(bVal : boolean) {
        this.subForm_PE_Updated = bVal;
        if (dbg_print) console.log("In rtFormService subForm_PE_Updated$");

        this.checkAllSubformsUpdated();
    }

    //subForm_OI_Updated$ = this.subForm_OI_Updated_Src.asObservable();
    set_subForm_OI_Updated(bVal : boolean) {
        this.subForm_OI_Updated = bVal;
        if (dbg_print) console.log("In rtFormService subForm_OI_Updated$");

        this.checkAllSubformsUpdated();
    }

    subFormsAreUpdated$ = this.subFormsAreUpdated_Src.asObservable();
    set_subFormsAreUpdated(bVal : boolean) {
        this.subFormsAreUpdated_Src.next(bVal);
        if (dbg_print) console.log("In rtFormService subFormWasUpdated");
    }

    private checkAllSubformsUpdated()
    {
        /*
        console.log("this.subForm_APD_Updated$=",this.subForm_APD_Updated);
        console.log("this.subForm_PE_Updated$=",this.subForm_PE_Updated);
        console.log("this.subForm_OI_Updated$=",this.subForm_OI_Updated);
        */

        //if ( this.subForm_APD_Updated &&  this.subForm_OI_Updated ) this.set_subFormsAreUpdated(true);
        if ( this.subForm_APD_Updated &&  this.subForm_PE_Updated &&  this.subForm_OI_Updated ) this.set_subFormsAreUpdated(true);
        //else if(this.subFormsAreUpdated$._isScalar) this.set_subFormsAreUpdated(false);
    }

    //----------------------------------------------------------------

    rtValidators = new rtFormValidators;

    buildFormObject(form:FormGroup,entries:any):cFormObject {
        return new cFormObject(form,entries);
    }

    // Get function from string for Validator-Function. With or without scopes (by Nicolas Gauthier)
    getFunctionCallFromString = function(stringArray) {
        if (stringArray == undefined) return null;
        if (!Array.isArray(stringArray)) return null;
        if (stringArray.length == 0 ) return null;

        var found_require = false;
        var found_minLength = 0;

        var validatorArray = [];

       for (var i = 0;i<stringArray.length;i++)
       {
           if (stringArray[i].indexOf('required')!=-1)
           {
               found_require = true;
               validatorArray.push(Validators.required);
               //break;
           }
           else if (stringArray[i].indexOf('minLength')!=-1)
           {
               var splitString = stringArray[i].split('=');
               found_minLength = splitString[splitString.length-1];
               //console.log("found_minLength =",found_minLength );
               validatorArray.push(Validators.minLength(found_minLength));
           }
           else if (stringArray[i].indexOf('maxLength')!=-1)
           {
               var splitString = stringArray[i].split('=');
               let found_maxLength = splitString[splitString.length-1];0
               //console.log("found_maxLength =",found_maxLength );
               validatorArray.push(Validators.minLength(found_maxLength));
           }
           else if (stringArray[i].indexOf('length')!=-1)
           {
               var splitString = stringArray[i].split('=');
               let found_Length = splitString[splitString.length-1];
               //console.log("found_Length =",found_Length );
               validatorArray.push(Validators.minLength(found_Length));
               validatorArray.push(Validators.maxLength(found_Length));
           }
           else if (stringArray[i].indexOf('validateFileUpload')!=-1)
           {
               validatorArray.push(this.rtValidators.validateFileUpload);
           }
           else if (stringArray[i].indexOf('validateCourseList')!=-1)
           {
               validatorArray.push(this.rtValidators.validateCourseList);
           }
           else if (stringArray[i].indexOf('validateEmail')!=-1)
           {
               validatorArray.push(this.rtValidators.validateEmail);
           }
           else if (stringArray[i].indexOf('validateNumberNotZero')!=-1)
           {
               validatorArray.push(this.rtValidators.validateNumberNotZero);
           }


       }

           //console.log("validatorArray=",validatorArray);

        return Validators.compose(validatorArray);
    }


    toFormGroup(entries: any) {


        //console.log("entries=",entries);

        let group: any = {};

        //console.log("this.currentForm=", this.currentForm.entries);

        //'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],

        entries.forEach(entry => {
                //console.log("entry=", entry);
                //Validators.compose([Validators.required,Validators.minLength(3)])
                let defaultValue = null;
                if (entry.defaultValue !== undefined) defaultValue = entry.defaultValue;
                group[entry.key] = new FormControl(defaultValue, this.getFunctionCallFromString(entry.validators) );

        });

        return new FormGroup(group);

    }



}
