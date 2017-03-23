import { Ng2UploaderModule } from 'ng2-uploader/ng2-uploader';

import { Component,OnInit,EventEmitter,Input,Output ,NgZone,ElementRef} from '@angular/core';

import {FormGroup,FormControl} from '@angular/forms';

//import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

import {AuthenticationService} from '../_services/rt-authentication.service';

//for animations
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';

const dbgPrint = false;

//var html = require('./rt-grid-box-add.component.html!text');
//var css = require('./rtForm.css!text');

@Component({
    //moduleId: module.id,
    selector: 'rt-grid-box-add',
    templateUrl: 'rt-grid-box-add.component.html',
    styleUrls: ['rtForm.css']
    //template:html,
    //styles:[css]
})


export class rtGridBoxAddComponent implements OnInit
{

    /*
    @Input() title : string = 'title string missing';
    @Input() secParagraph : string = 'secParagrap string missing';
    @Input() secParagraphArray : string[] = new Array();

    @Input() compId : string;

    @Input() formCtrlName : string;
    @Input() required: boolean = false;
    */

    @Input() formEntry : any;

    @Input() formgroup: FormGroup;

    //@Input() gridOptions : any;



    //--------------------------------------------


    avgr2_courseComplete: boolean;

    avgr2_courseList : Object[] ;

    avgr2Object_formModel : any;

    newAddObj : Object ;

    //@Output() uploadedDataRes : any = new Array();  //TODO: load via restApi (Mock first)
    //@Output('change') uploadedDataChanged = new EventEmitter();

    //@Input() colsAll : number = 9;
    //@Input() rowHeight : number = 42;

    //tmpAddArray : any;//Array<{}> ;

    gridOptions : any;

    currentUaFormObj : any;

    averageCalculated = '0.0';
    avrgValueSet : number;

    setObj = {courses: new Array(),avrValue:'0.0'};

    setValue : string;
    isValValid = false;
    //----------------------------------------------------

    //constructor(compId:string,t:string,secP:string,fCN:string) {
    constructor(private _authService:AuthenticationService) {

        //this.tmpAddArray = new Array() ;

        //this.newAddObj = null;

    }

    ngOnInit(): void {


        this.gridOptions = this.formEntry.options;
        //this.tmpAddArray = this.formgroup.controls[this.formEntry.key].value || [];

        this.newAddObj = null;

        //TODO this.currentUaFormObj = this._authService.auth_getFormObject();

        if (dbgPrint) console.log("In rtGridBoxAddComponent , this formgroup=",this.formgroup);
        if (dbgPrint) console.log("In rtGridBoxAddComponent , this formEntry=",this.formEntry);

        //this.tmpAddArray = new Array();

        for (let formCtrlKey in this.formgroup.value) {
            if (formCtrlKey === this.formEntry.key)
            {
                if (this.formgroup.value[formCtrlKey] === 'undefined' ||
                    this.formgroup.value[formCtrlKey] === null ||
                    this.formgroup.value[formCtrlKey] === '')
                {
                    break;
                }

                console.log("found key ",formCtrlKey, ", value=",this.formgroup.value[formCtrlKey]);
                let tmpObj = this.formgroup.value[formCtrlKey];

                if (!(this.formgroup.value[formCtrlKey].courses === 'undefined'))
                {
                    /*for (let i=0;i< this.formgroup.value[formCtrlKey].courses.length;i++)   //for (let objkKey in tmpObj.courses)
                    {
                        this.tmpAddArray.push(this.formgroup.value[formCtrlKey].courses[i]);
                    }
                    this.avrgValueSet = this.formgroup.value[formCtrlKey].avrValue;
                    */

                    this.setObj.courses = tmpObj.courses;
                    this.setValue = tmpObj.avrValue;
                }
            }
        }

        if (dbgPrint) console.log("this.setObj=",this.setObj);
        if (dbgPrint) console.log("In rtGridBoxAddComponent in ngOnInit ,this.newAddObj=",this.newAddObj);



    }


    //---------------------------------------------------


    addNewLine_grTbl():void {


        //let tmpObj = {name:"",ects:0,grade:0,complete:false};

        let tmpObj = {};
        for (let i = 0;i<this.gridOptions.gridCells.length;i++)
        {
            tmpObj[this.gridOptions.gridCells[i].id] = this.gridOptions.gridCells[i];
            //tmpObj[this.gridOptions.gridCells[i].id]['value'];

            if (this.gridOptions.gridCells[i].type == 'text')tmpObj[this.gridOptions.gridCells[i].id]['value']='';
            else if (this.gridOptions.gridCells[i].type == 'number') tmpObj[this.gridOptions.gridCells[i].id]['value']=0;
        }

        if (Object.keys(tmpObj).length != 0)
        {
            tmpObj['complete']=false;
            this.newAddObj = tmpObj;
        }

        if (dbgPrint) console.log("this.newAddObj=",this.newAddObj);
        if (dbgPrint) console.log("tmpObj=",tmpObj);


    }

    cancelNewLine_grTbl():void {

        if (dbgPrint) console.log("this.newAddObj=",this.newAddObj);

        this.newAddObj = null;

    }


    deleteObjFromList(courseItem):void {

            //console.log("delete courseItem=", courseItem);
            let index = this.setObj.courses.indexOf(courseItem);
            if (index > -1) {
                this.setObj.courses.splice(index, 1);
            }

        this.calculate_average();
    }

    change_colEntry(currentColEntry:any,newObj:Object,evt)
    {
        newObj[currentColEntry.id].value = evt.target.value;
        this.checkNewAddObj();
    }

    checkNewAddObj():void{
        var isComplete = true;
        for (let key in this.newAddObj)
        {
            if (key != 'complete')
            {
                //console.log("colEntry=",key);
                var obj = this.newAddObj[key];
                if (obj['value'] == '0' || obj['value'] == '' || obj['value'] == 0)
                {
                    isComplete = false;
                    break;
                }
            }
        }

        this.newAddObj['complete'] = isComplete;
        //console.log("this.newAddObj=",this.newAddObj);
    }

    addObjToList(newObj:Object):void {

        let newAddObj_Deep = this.copyDeep(newObj);
        //newObj = this.newAddObj; // for copying by value and not by reference

        this.setObj.courses.push(newAddObj_Deep);

        //(<FormControl>this.formgroup.controls[this.formEntry.key]).setValue(this.tmpAddArray);

        this.newAddObj = null;

        if (dbgPrint) console.log('this.setObj.courses',this.setObj.courses);

        this.calculate_average();
    }

    copyDeep(o:Object):Object {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copyDeep(v) : v;
        }
        return output;
    }


    calculate_average(){
        let sumValues:number = 0;

        for (let i=0;i<this.setObj.courses.length;i++) {

            sumValues = sumValues + parseFloat(this.setObj.courses[i].grade.value);

            this.averageCalculated = (sumValues/(i+1)).toFixed(1);


            if (dbgPrint) console.log("sumValues=",sumValues,i,this.setObj.courses[i]);
        }

        //this.change_averageValue();
    }



    change_averageValue(evt?:any)
    {
        //newObj[currentColEntry.id].value = evt.target.value;
        let tmpSetValue:string = '0.0';

        if (evt!= undefined ) tmpSetValue = parseFloat(evt.target.value).toFixed(1);
        else tmpSetValue =   parseFloat(this.averageCalculated).toFixed(1);


        //this.setObj.courses = this.tmpAddArray;
        this.setObj.avrValue = tmpSetValue;

        //console.log("in change_averageValue,this.setObj.avrValue=",this.setObj.avrValue);

        if (isNaN(parseFloat(this.setObj.avrValue)))
        {
            if (dbgPrint) console.log("in isNan,evt=",evt);
            this.calculate_average();

            //evt.srcE.placeholder = this.averageCalculated;
            this.setObj.avrValue = '';
            (<FormControl>this.formgroup.controls[this.formEntry.key]).setValue('');
            this.isValValid;
        }
        else
        {
            (<FormControl>this.formgroup.controls[this.formEntry.key]).setValue(this.setObj);
            this.isValValid = true;
        }

         //setValue(setObj);

        if (dbgPrint) console.log("this.formgroup=",(<FormControl>this.formgroup.controls[this.formEntry.key])); //this.setObj.courses;

    }

    /*
    isValueValid()
    {
        if ( isNaN(parseFloatthis.setValue) )
        {
            return false;
        }
        else return true;
    }
    */

    //------------old stuff-----------------------------

    /*
    change_courseName(obj:Object,evt):void{
        //console.log("change Name=", evt.target.value);
        obj['name'] =  evt.target.value;
        //console.log("change Name=", course);
        this.checkNewCourseObj(obj);
    }

    change_courseECTS(obj:Object,evt):void{
        //console.log("change Name=", evt.target.value);
        obj['ects'] =  evt.target.value;
        //console.log("change Name=", course);
        this.checkNewCourseObj(obj);
    }

    change_courseGrade(obj:Object,evt):void{
        //console.log("change Name=", evt.target.value);
        obj['grade'] =  evt.target.value;
        //console.log("change Name=", course);
        this.checkNewCourseObj(obj);
    }

    checkNewCourseObj(obj:Object):void{
        if (obj['name'] !='' && obj['ects']!=0 && obj['grade']!=0)
        {
            obj['courseComplete'] = true;
        }
        else { obj['courseComplete'] = false}
    }
*/




    //------------------- debug ---------------------------------------------


}
