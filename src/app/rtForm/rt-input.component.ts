import {Component, Input, OnInit} from '@angular/core';
import { FormGroup,FormControl,FormBuilder }        from '@angular/forms';

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
export class rtInputComponent implements OnInit {


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


    constructor()
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

        if (this.formEntry.type == 'date')
        {
            if (dbgPrint_dateEntry) console.log("Input-entry: DATE, this.formEntry=",this.formEntry);
            //this.formEntry.defaultValue = null;
            this.valueAsDate = new Date(this.formEntry.defaultValue);

            if (this.formEntry.options.minDate === undefined)
            {
                this.minDate = new Date(this.formEntry.options.minDate);
            }
            else this.minDate = new Date("1970-01-01");


            this.maxDate = new Date("2010-01-01");

        }
    }


    toggleInfo(e:any):void{
        this.showTooltip = !this.showTooltip;
        e.stopPropagation();
    }


}
