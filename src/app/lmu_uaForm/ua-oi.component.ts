import { Component,OnInit,AfterViewInit,Input} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';
import {rtFormValidators}  from '../_services/rt-form-validators.service';

//import {lmu_ua_formList} from'../_models/lmu_ua_formList';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';

//for animations
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';


//var html = require('./ua-oi.component.html!text');

const dbgPrint = true;

@Component({
    //moduleId: module.id,
    selector: 'lmu_user_oi',
    templateUrl: 'ua-oi.component.html',
    //template:html
    //styleUrls: ['lmu-ua-styles.css']

})
export class LmuUserOiComponent implements OnInit,AfterViewInit{

    //oiForm : FormGroup;

    //----------------------------------------------------

    dbgIsOpen : boolean;


    rtValidators = new rtFormValidators;
    formEntries:Object[];
    //currentFormObject:cFormObject;

    //----------------------------------------------------

    //lmu_ua_form= new lmu_ua_formList();



    //----------------------------------------------------



    currentForm:FormGroup;
    @Input() set setForm(givenForm: FormGroup){

        if (dbgPrint) console.log("givenForm=",givenForm);
        this.currentForm = <FormGroup>givenForm.controls[0];
        //this.currentForm = givenForm;

    };
    currentFormEntries:[any];
    @Input() set setFormEntries(formEntries:[any]){

        this.currentFormEntries = formEntries

    };


    //----------------------------------------------------

    constructor(private fb: FormBuilder) {

        this.dbgIsOpen = false;

    }

    //---------------------------------------------------



    ngOnInit(): void {
       // this.buildForm();

        //if (dbgPrint) console.log("this.currentFormObject=",this.currentFormObject);

    }

    ngAfterViewInit():void {
        if (dbgPrint) console.log("In LmuUserOiComponent, afterViewInit");
    }

    /*
    buildForm(): void
    {



        //this.oiForm.value.uploadedData_essay_oi = this.uploadedDataArray_essay_oi ;

        this.oiForm = this.fb.group({
            'uploadedData_essay_oi': [[], Validators.compose([Validators.required, this.rtValidators.validateArray])],
            'uploadedData_otherDoc_oi': [[], Validators.compose([Validators.required, this.rtValidators.validateArray])],
            'anyOtherInfos_oi': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'specialProv4Interview': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'wantEmailnotifications': [true, Validators.required]

        });


        //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
        this.oiForm.statusChanges.subscribe(data => this.onFormStatusChanged(data));

        this.formEntries = [
            {
                formgroup: this.oiForm,
                key: 'uploadedData_essay_oi',
                title: 'Essay "Data Science * ',
                type: 'fileUpload',
                secParagraphArray: ['Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.',
                                    'The essay musst not exceed 1,000 words'],
                options: {
                    url: 'http://localhost:3001/upload',
                    filterExtensions: true,
                    allowedExtensions: ['application/pdf'],
                    calculateSpeed: true,
                },
                required: true
            },
            {
                formgroup: this.oiForm,
                key: 'uploadedData_otherDoc_oi',
                title: 'Other documents *',
                type: 'fileUpload',
                secParagraphArray: ['Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc.,',' as well as your ECTS calculation document within a single PDF file.'],
                options: {
                    url: 'http://localhost:3001/upload',
                    filterExtensions: true,
                    allowedExtensions: ['application/pdf'],
                    calculateSpeed: true,
                },
                required: true
            }
            ,
            {
                formgroup: this.oiForm,
                key: 'anyOtherInfos_oi',
                title: 'Any other information  *',
                type: 'textarea',
                required: true
            }
            ,
            {
                formgroup: this.oiForm,
                key: 'specialProv4Interview',
                title: 'Special provisions for the interview needed? (e.g. because of disability): *',
                type: 'textarea',
                required: true
            },
            {
                formgroup: this.oiForm,
                key: 'wantEmailnotifications',
                title: ' I want to receive email notifications ',
                infoText: 'You will be notified of the outcome of the aptitude assessment procedure by email. If you wish to be notified by mail, please select this field.',
                type: 'checkBox',
                required: false
            }

        ]
    }


    onFormStatusChanged(data)
    {
        var tmpStatus = false;

        if( data === 'VALID')
        {
            console.log("onFormStatusChanged",data);
            tmpStatus = true;
        }

        //this.usermodel = this.oiForm;

        //this.onFormEvent_pe.emit(tmpStatus);

    }


    uploadedDataChanged_essay_oi(e)
    {
        this.oiForm.value.uploadedData_essay_oi = e.value;
        if (this.dbgPrint) console.log("In uploadedDataChanged_essay_oi, e=",e)
    }

    uploadedDataChanged_otherDoc_oi(e)
    {
        this.oiForm.value.uploadedData_otherDoc_oi = e.value;
        if (this.dbgPrint) console.log("In uploadedDataChanged_otherDoc_oi, e=",e)
    }



    //------------------- debug ---------------------------------------------

    // TODO: Remove this when we're done
    //get diagnostic(){ return JSON.stringify(this.usermodel); }


    toggleDbg() : void{
        this.dbgIsOpen = !this.dbgIsOpen;
        if (this.dbgPrint) console.log("this.dbgIsOpen=",this.dbgIsOpen);
        //console.log("this.uploadedDataArray_essay_oi=",this.uploadedDataArray_essay_oi);
    }
    */
}
