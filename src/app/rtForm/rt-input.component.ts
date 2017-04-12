import {Component, Input, DoCheck, OnInit} from '@angular/core';
import { FormGroup,FormControl,FormBuilder }        from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

const dbgPrint_dateEntry=false;

@Component({
    //moduleId: module.id,
    selector: 'rt-input',
    //template:html,
    //styleUrls: ['../css/rtForm.css']
    //styles:[css]
    templateUrl: 'rt-input.component.html',
    styleUrls: ['rtForm.css']
})
export class rtInputComponent implements OnInit,DoCheck {


    valueAsDate : Date;
    minDate : Date;
    maxDate : Date;

    tmpArray : any[];
    valObj: any;
    //------------------------------

    @Input() formEntry: any;
    @Input() formgroup: FormGroup;
    //formgroup: FormGroup;

    //@Input() form: FormBuilder ;

    //get isValid() { return this.form.controls[this.question.key].valid; }
    showTooltip =  false;

    entryErrorString : string;

    constructor(private cdr: ChangeDetectorRef)
    {

    }

    ngOnInit(): void {

        /*this.valObj = this.formgroup.controls[this.formEntry.key].value;
        if( Object.prototype.toString.call( this.valObj ) === '[object Array]' ) {
            this.tmpArray = this.formgroup.controls[this.formEntry.key].value;
        }
        */

        /*
        this.dateValue =  new Date("04-04-2017");

        if (this.formEntry.key == "dateOfBirth")
        {
            console.log("this.formgroup.controls[dateOfBirth] =",this.formgroup.controls[this.formEntry.key].value);
            this.dateValue =  new Date(this.formgroup.controls["dateOfBirth"].value);
            //console.log("this.dateValue =",this.dateValue.value);
        }
        */



        //TODO: parse year-string from year-range
        if (this.formEntry.type == 'date')
        {

            if (dbgPrint_dateEntry) console.log("Input-entry: DATE, this.formEntry=",this.formEntry);
            //this.formEntry.defaultValue = null;
            this.valueAsDate = new Date(this.formEntry.defaultValue);

            if (this.formEntry.options.minDate !== undefined)
            {
                this.minDate = new Date(this.formEntry.options.minDate);
            }
            else this.minDate = new Date("1970-01-01");

            if (this.formEntry.options.maxDate !== undefined)
            {
                this.maxDate = new Date(this.formEntry.options.maxDate);    //this.maxDate = new Date("2010-01-01");
            }
            else this.maxDate = new Date();

        }
    }


    toggleInfo(e:any):void{
        this.showTooltip = !this.showTooltip;
        e.stopPropagation();
    }

    //used in html-template to show info for user for invalid input
    entryErrorString_OLD() {

        let retValue =  "Not an valid input : ";
        let errorInfos = "";

        if (this.formgroup.controls[this.formEntry.key].errors)
        {
            //setTimeout(()=> {                   //bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
                let errRef = this.formgroup.controls[this.formEntry.key].errors;

                //console.log("errType=",errRef);

                for (let errType in errRef) {
                    //console.log("errType=",errType);
                    //retValue += errType.toString + '/n';

                    for (let errReason in errRef[errType]) {
                        errorInfos += ' ,' + errReason.toString() + ":" + errRef[errType][errReason].toString();
                    }
                    //this.cdr.detectChanges(); // detect changes           //bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
                    break;
                }
           // },1);
        }

        errorInfos = errorInfos.slice(2,errorInfos.length);
        retValue = retValue + errorInfos;
        return retValue;
    }


    ngDoCheck() {
        this.checkValidationErrorExists();
    }

    checkValidationErrorExists()
    {
        let retValue =  "Not an valid input : ";
        let errorInfos = "";

        if (this.formgroup.controls[this.formEntry.key].errors)
        {
            //setTimeout(()=> {                   //bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
            let errRef = this.formgroup.controls[this.formEntry.key].errors;

            //console.log("errType=",errRef);

            for (let errType in errRef) {

                //retValue += errType.toString + '/n';

                //if (errType.toString() === 'notValid')
                {

                    for (let errReason in errRef[errType]) {
                        errorInfos += ' ,' + errReason.toString() + ":" + errRef[errType][errReason].toString();
                    }
                    break;
                }

                //this.cdr.detectChanges(); // detect changes           //bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
            }
            // },1);
            //console.log("errorInfos=",errorInfos);
            if (errorInfos.length == 0) retValue = retValue + 'this field is required';
            else {
                errorInfos = errorInfos.slice(2, errorInfos.length);
                retValue = retValue + errorInfos;
            }
            this.entryErrorString = retValue;

        }
        else this.entryErrorString  =  null;
    }

}
