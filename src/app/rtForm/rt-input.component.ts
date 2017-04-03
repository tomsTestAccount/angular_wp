import {Component, Input, OnInit} from '@angular/core';
import { FormGroup,FormControl,FormBuilder }        from '@angular/forms';

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


    dateValue : Date;

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
       //console.log("formEntry=",this.formEntry);
       // console.log("formgroup=",this.formgroup);

        this.dateValue =  new Date("01-08-2016");
    }

    ngOnInit(): void {

        this.valObj = this.formgroup.controls[this.formEntry.key].value;
        if( Object.prototype.toString.call( this.valObj ) === '[object Array]' ) {
            this.tmpArray = this.formgroup.controls[this.formEntry.key].value;
        }


        this.dateValue =  new Date("01-08-2016");

        if (this.formEntry.key == "dateOfBirth")
        {
            console.log("this.formgroup.controls[dateOfBirth] =",this.formgroup.controls[this.formEntry.key].value);
            this.dateValue =  new Date(this.formgroup.controls["dateOfBirth"].value);
            //console.log("this.dateValue =",this.dateValue.value);
        }
    }



    onChangeDate(e:any,controlName:string):void{
        //this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
        //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
        console.log((<FormControl>this.formgroup[controlName]));
        console.log("e=",e);
        //console.log("this.peForm=",this.peForm);
    }

    toggleInfo(e:any):void{
        this.showTooltip = !this.showTooltip;
        e.stopPropagation();
    }


}
