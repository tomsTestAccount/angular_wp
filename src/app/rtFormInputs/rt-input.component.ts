import {Component, Input, DoCheck, OnInit,AfterViewInit} from '@angular/core';
import { FormGroup,FormControl,FormBuilder }        from '@angular/forms';
//import { ChangeDetectorRef } from '@angular/core';

//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_lifecyclehooks = false;
const dbgPrint_dateEntry = false;
const dbgPrint_fileEntry = false;
//----------------------------------------------------------------------------------------------------------------------


@Component({
    //moduleId: module.id,
    selector: 'rt-input',
    //template:html,
    //styleUrls: ['../css/rtFormInputs.css']
    //styles:[css]
    templateUrl: 'rt-input.component.html',
    styleUrls: ['rtForm.css']
})
export class rtInputComponent implements OnInit,DoCheck,AfterViewInit {


    valueAsDate : Date;
    minDate : Date;
    maxDate : Date;

    tmpArray : any[];
    valObj: any;
    //------------------------------

    @Input() formEntry: any;
    @Input() formgroup: FormGroup;
    @Input() dbgPrint:boolean;

    showTooltip =  false;
    isOpened=true;
    entryErrorString : string;

    constructor()
    {

       //if(dbgPrint_lifecyclehooks) console.log("In rt-input constructor, this.formEntry = ", this.formEntry );
    }

    ngDoCheck() {

        if (this.formEntry !== undefined)
        {
            this.checkValidationErrorExists();
        }
    }

    ngOnInit(): void {


        if (this.dbgPrint) console.log("In rt-Input ngOnInit: Formgroup=", this.formgroup,", this.formEntry=", this.formEntry.key);

        if (this.formEntry.collapsible_box_title) {

            this.isOpened = false;
            this.toggle_isOpened();     ////this.formgroup.controls[this.formEntry.key].disable();

           // setTimeout(() => {this.isOpened = false},1);
        }

        if (this.formEntry.type == 'fileUpload') {


            //if (dbgPrint_fileEntry) console.log("Input-entry: File-upload, this.formEntry=", this.formEntry);

            if (dbgPrint_fileEntry)
            {
                if (this.formEntry.key == 'copy_of_certificate') {
                    //console.log("Input-entry: File-upload, this.formEntry=", this.formEntry);
                    console.log("FormControl copy_of_certificate : FormControl=", this.formgroup.controls[this.formEntry.key]);
                }
            }

            if ( (this.formEntry.defaultValue) && (this.formEntry.defaultValue.filename))
            {
                this.isOpened = true;
                this.toggle_isOpened();     ////this.formgroup.controls[this.formEntry.key].enable();

                //setTimeout(() => {this.isOpened = true},1);
            }
        }
        else if (this.formEntry.type == 'date') {


             if (dbgPrint_dateEntry) console.log("Input-entry: DATE, this.formEntry=", this.formEntry);


             if (this.formEntry.options.minDate !== undefined && this.formEntry.options.maxDate !== undefined) {
                this.formEntry.options.minDate = new Date(this.formEntry.options.minDate);
                this.formEntry.options.maxDate = new Date(this.formEntry.options.maxDate);
             }
             else if (this.formEntry.options.yearRange !== undefined) {
                let range = this.formEntry.options.yearRange.split(':');
                this.formEntry.options.minDate =  new Date(range[0] + '-01-01');
                this.formEntry.options.maxDate =  new Date(range[1] + '-12-31');
             }
             else
             {
                this.formEntry.options.minDate = new Date("1975-01-01");
                this.formEntry.options.maxDate = new Date();
             }

             //defaultDate (minDate) or loadedDate
             if (this.formEntry.defaultValue) {
                 this.formEntry.defaultValue = new Date(this.formEntry.defaultValue);
             }
             let showedDate = this.formEntry.defaultValue || this.formEntry.options.minDate;
             this.valueAsDate = showedDate;

             //this.formEntry.options.minDate = null;
             //this.formEntry.options.maxDate = null;

             if (dbgPrint_dateEntry) console.log("this.formEntry.options=", this.formEntry.options);
        }



    }



    ngAfterViewInit():void {


    }


    toggleInfo(e:any):void{
        this.showTooltip = !this.showTooltip;
        e.stopPropagation();
    }

    toggle_isOpened(value?) {

        setTimeout(()=> {			//bugfix for angular.io changeDetection in Dev-Mode; see issue #6005 (EXCEPTION: Expression has changed after it was checked)
            if (!this.isOpened)
            {
                this.formgroup.controls[this.formEntry.key].disable();
            }
            else
            {
                this.formgroup.controls[this.formEntry.key].enable();
            }

            /*if (this.formEntry.key == 'copy_of_certificate') {
                //console.log("Input-entry: File-upload, this.formEntry=", this.formEntry);
                console.log("FormControl copy_of_certificate : FormControl=", this.formgroup.controls[this.formEntry.key]);
            }
            */

        },1);

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
