
import {Component, OnInit, Input } from '@angular/core';
import {FormGroup,FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


const dbgPrint = false;


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

    @Input() formEntry : any;

    @Input() formgroup: FormGroup;

    newAddObj : Object ;

    gridOptions : any;

    averageCalculated = 0.0;
    avrgValueDisplayed : string;           //a string is used because of different display of floating point number in different countries  problems of browser

    setObj : any ;

    isValValid = false;
    differ:any;
    //----------------------------------------------------

    constructor() {
    }

    ngOnInit(): void {

        this.setObj = {table: new Array(),average:0};       //will be updated by server -data see parent (userApplication-Form)
        this.gridOptions = this.formEntry.options;          //will be updated by server -data see parent (userApplication-Form)

        this.newAddObj = null;


        //if (dbgPrint) console.log("In rtGridBoxAddComponent , this formgroup=",this.formgroup);
        if (dbgPrint) console.log("In rtGridBoxAddComponent , this formEntry=",this.formEntry);



        for (let formCtrlKey in this.formgroup.value) {
            if (formCtrlKey === this.formEntry.key)
            {
                if (this.formgroup.value[formCtrlKey] === 'undefined' ||
                    this.formgroup.value[formCtrlKey] === null ||
                    this.formgroup.value[formCtrlKey] === '')
                {
                    break;
                }

                if (dbgPrint) console.log("found key ",formCtrlKey, ", value=",this.formgroup.value[formCtrlKey]);

                let tmpObj = JSON.parse(JSON.stringify(this.formgroup.value[formCtrlKey]));

                if ((tmpObj.table !== undefined) && (tmpObj.average!==undefined))           //updated data
                //if ((tmpObj.table) && (tmpObj.average))
                {

                    this.setObj.table = tmpObj.table;
                    //this.setObj.average = parseFloat(tmpObj.average);
                    this.setObj.average = tmpObj.average;
                    this.avrgValueDisplayed = tmpObj.average;
                }

                if (dbgPrint) console.log("this.formgroup.controls=",this.formgroup.controls, ", formCtrlKey=",formCtrlKey);

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

        /*
        setTimeout(()=>{
        if (this.setObj.table.length == 1)
        {
            this.avrgValueDisplayed = "0.0";
            this.setObj.average = null;
            this.setObj.table = [];
            this.setFormControlValue(this.setObj);
        }
        },10);
        */

        //setTimeout(()=>{
            /*
            if (this.setObj.table.length == 1)
            {
                this.avrgValueDisplayed = "0.0";
                this.setObj.average = 0;
                this.setObj.table = [];

                //this.setFormControlValue(this.setObj);
            }
            else
            */
            {


                let index = this.setObj.table.indexOf(courseItem);
                if (index > -1)
                {
                    this.setObj.table.splice(index, 1);
                }

                /*if (this.setObj.table.length >= 1)
                {
                    this.calculate_average();
                }
                */

                //set average-value to 0, invalid => so user has to re-set average-value
                if (this.setObj.table.length == 0)
                {
                    this.setObj.average = 0;
                    this.setObj.table = [];
                    this.avrgValueDisplayed = "0.0";
                }
                else
                {
                    this.setObj.average = 0;

                    this.avrgValueDisplayed = "0.0";

                }
            }

        this.setFormControlValue(this.setObj);

        //},10);


    }

    change_colEntry(currentColEntry:any,newObj:Object,evt) {
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

        let newAddObj_Deep = JSON.parse(JSON.stringify(newObj));  //this.copyDeep(newObj);

        this.setObj.table.push(newAddObj_Deep);

        this.newAddObj = null;

        if (dbgPrint) console.log('this.setObj.courses',this.setObj.table);

        //(<FormControl>this.formgroup.controls[this.formEntry.key]).setValue(this.setObj.table);

        //this.calculate_average();
        this.setObj.average = 0;            //set average-value to 0, invalid => so user has to re-set average-value
        this.avrgValueDisplayed = "0.0";
        this.setFormControlValue(this.setObj);
    }

    calculate_average(){
        let sumValues:number = 0.0;

        for (let i=0;i<this.setObj.table.length;i++) {

            let currNum : number = parseFloat(this.setObj.table[i].grade.value);
            sumValues = sumValues + currNum;

            this.averageCalculated = parseFloat((sumValues/(i+1)).toFixed(1));


            if (dbgPrint) console.log("sumValues=",sumValues,i,this.setObj.table[i]);
        }

        this.change_averageValue();
    }

    timeOutHndl:any;
    oldValue:any;
    change_averageValue_evt(evt?:any) {

        if (evt.target.value != this.oldValue) {

            this.setObj.average = parseFloat(evt.target.value);

            clearTimeout(this.timeOutHndl);
            this.timeOutHndl = setTimeout(() => {
                if (isNaN(this.setObj.average)) {
                    this.setObj.average = 0;
                    this.avrgValueDisplayed = "0.0";             //at first time we set a wrong value, we overwrite value given by  server
                }
                else this.avrgValueDisplayed = this.setObj.average;

                this.setFormControlValue(this.setObj);
            }, 10);

            this.oldValue = this.setObj.average;
        }
        /*setTimeout(() => {
            this.change_averageValue(evt.target.value)
        },1500);
        */
    }

    change_averageValue(newValue?:any) {

        //newObj[currentColEntry.id].value = evt.target.value;
        let tmpSetValue:string = '0.0';

        if (newValue != undefined )
        {
            tmpSetValue = newValue;
        }
        else
        {
            tmpSetValue =  this.averageCalculated.toFixed(1);
        }

        this.setObj.average = parseFloat(tmpSetValue).toFixed(1);


        this.setFormControlValue(this.setObj);



    }

    setFormControlValue(setObject:any) {
        //let setObjReally = setObject;
        setTimeout(() => {

            if (setObject.table.length == 0) this.formgroup.controls[this.formEntry.key].setValue(null);
            else this.formgroup.controls[this.formEntry.key].setValue(setObject);

            this.formgroup.controls[this.formEntry.key].markAsDirty();

            //if (dbgPrint)
            console.log("this.formEntry for ",this.formEntry.key," =",(<FormControl>this.formgroup.controls[this.formEntry.key])); //this.setObj.courses;

        },15);
    }



}
