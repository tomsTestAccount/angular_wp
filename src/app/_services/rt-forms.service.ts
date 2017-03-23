import {Validators, FormGroup, FormControl, FormBuilder, FormArray, FormGroupName, AbstractControl} from '@angular/forms';
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


export class uaFormObj {
    apd_formObj : cFormObject;
    ac_formObj : cFormObject;
    ac2_formObj : cFormObject;
    oi_formObj : cFormObject;
};





@Injectable()
export class RtFormService {


    //---------------- subForm- services --------------------------------

    // Observable sources
    private subFormObject_apd = new Subject<cFormObject>();
    private subFormObject_ac = new Subject<cFormObject>();
    private subFormObject_oi = new Subject<cFormObject>();
    private subFormObject_ac2 = new Subject<cFormObject>();
    private subFormIsUpdated = new Subject<boolean>();

    //announcement
    subFormAnnounced_apd$ = this.subFormObject_apd.asObservable();
    subFormAnnounced_ac$ = this.subFormObject_ac.asObservable();
    subFormAnnounced_oi$ = this.subFormObject_oi.asObservable();
    subFormAnnounced_ac2$ = this.subFormObject_ac2.asObservable();

    subFormIsUpdated$ = this.subFormIsUpdated.asObservable();

    // Service commands
    prepareSubForm_apd(subForm: cFormObject) {
        this.subFormObject_apd.next(subForm);
    }

    prepareSubForm_ac(subForm: cFormObject) {
        this.subFormObject_ac.next(subForm);
    }

    prepareSubForm_ac2(subForm: cFormObject) {
        this.subFormObject_ac2.next(subForm);
    }

    prepareSubForm_oi(subForm: cFormObject) {
        this.subFormObject_oi.next(subForm);
    }

    subFormsUpdated(bVal : boolean) {
        this.subFormIsUpdated.next(bVal);
    }


    //----------------------------------------------------------------

    rtValidators = new rtFormValidators;

    buildFormObject(form:FormGroup,entries:any):cFormObject
    {

        return new cFormObject(form,entries);

    }

    // Get function from string, with or without scopes (by Nicolas Gauthier)
    getFunctionCallFromString = function(stringArray)
    {
        if (stringArray == undefined) return null;
        if (!Array.isArray(stringArray)) return null;
        if (stringArray.length == 0 ) return null;

        var found_require = false;
        var found_minLength = 0;

        var vallArary = [];

       for (var i = 0;i<stringArray.length;i++)
       {
           if (stringArray[i].indexOf('required')!=-1)
           {
               found_require = true;
               vallArary.push(Validators.required);
               //break;
           }
           else if (stringArray[i].indexOf('minLength')!=-1)
           {
               var splitString = stringArray[i].split('=');
               found_minLength = splitString[splitString.length-1];
               //console.log("found_minLength =",found_minLength );
               vallArary.push(Validators.minLength(found_minLength));
           }

       }

           //console.log("vallArary=",vallArary);


        return Validators.compose(vallArary);
    }


    toFormGroup(entries: any) {

        //console.log("entries=",entries);

        let group: any = {};

        //console.log("this.currentForm=", this.currentForm.entries);

        //'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],

        entries.forEach(entry => {
            if (entry.defaultValue != undefined) {

                /*if (entry.key === 'dateofbirth') {
                    entry.defaultValue = entry.defaultValue.replace('-','/');
                 //console.log("entry=", entry);
                }*/
                   // console.log("entry=", entry);
            }

            if (entry.type == 'fileUpload' || entry.type == 'grid-box-add')
            {
                group[entry.key] = new FormControl(entry.defaultValue || '', entry.key.validators); //TODO: validator
            }
            else if (entry.key =='firstname')
            {
                group[entry.key] = new FormControl(entry.defaultValue || '', Validators.compose([Validators.required,Validators.minLength(3)])); //TODO: validator
            }
            else
            {
                //console.log("entry=", entry);
                //Validators.compose([Validators.required,Validators.minLength(3)])
                group[entry.key] = new FormControl(entry.defaultValue || '', this.getFunctionCallFromString(entry.validators) ); //TODO: validator
            }

        })

        return new FormGroup(group);
        //return new FormArray(group);
    }

    /*
    addFormArray2Group(entries: any,required:boolean,parentForm:FormGroup) {


        let formControlGroup: any = {};
        //let formControlGroup: [FormControl] = [];

        //console.log("this.currentForm=", this.currentForm.entries);

        //'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],



        let formArray:FormArray;
        if (required) formArray = new FormArray(formControlGroup,Validators.compose([Validators.required]));
        else formArray= new FormArray(formControlGroup);

        return parentForm;
    }
    */



    /*
    buildForm(entries:[any],required:boolean):FormGroup{


        //let formObj= new cFormObject(name,entries,required);

        let form:FormGroup;
        //form = this.toFormGroup(entries);


        //let formArray:FormArray;

        form = this.addFormArray2Group(entries,required,form);

        //formArray.setParent(form);

        //form. = 'dsjhdg';



        return form;

    }
    */


}
