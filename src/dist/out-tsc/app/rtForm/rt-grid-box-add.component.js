"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
//import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';
var rt_authentication_service_1 = require("../_services/rt-authentication.service");
var dbgPrint = false;
//var html = require('./rt-grid-box-add.component.html!text');
//var css = require('./rtForm.css!text');
var rtGridBoxAddComponent = (function () {
    //----------------------------------------------------
    //constructor(compId:string,t:string,secP:string,fCN:string) {
    function rtGridBoxAddComponent(_authService) {
        //this.tmpAddArray = new Array() ;
        this._authService = _authService;
        this.averageCalculated = '0.0';
        this.setObj = { courses: new Array(), avrValue: '0.0' };
        this.isValValid = false;
        //this.newAddObj = null;
    }
    rtGridBoxAddComponent.prototype.ngOnInit = function () {
        this.gridOptions = this.formEntry.options;
        //this.tmpAddArray = this.formgroup.controls[this.formEntry.key].value || [];
        this.newAddObj = null;
        //TODO this.currentUaFormObj = this._authService.auth_getFormObject();
        if (dbgPrint)
            console.log("In rtGridBoxAddComponent , this formgroup=", this.formgroup);
        if (dbgPrint)
            console.log("In rtGridBoxAddComponent , this formEntry=", this.formEntry);
        //this.tmpAddArray = new Array();
        for (var formCtrlKey in this.formgroup.value) {
            if (formCtrlKey === this.formEntry.key) {
                if (this.formgroup.value[formCtrlKey] === 'undefined' ||
                    this.formgroup.value[formCtrlKey] === null ||
                    this.formgroup.value[formCtrlKey] === '') {
                    break;
                }
                console.log("found key ", formCtrlKey, ", value=", this.formgroup.value[formCtrlKey]);
                var tmpObj = this.formgroup.value[formCtrlKey];
                if (!(this.formgroup.value[formCtrlKey].courses === 'undefined')) {
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
        if (dbgPrint)
            console.log("this.setObj=", this.setObj);
        if (dbgPrint)
            console.log("In rtGridBoxAddComponent in ngOnInit ,this.newAddObj=", this.newAddObj);
    };
    //---------------------------------------------------
    rtGridBoxAddComponent.prototype.addNewLine_grTbl = function () {
        //let tmpObj = {name:"",ects:0,grade:0,complete:false};
        var tmpObj = {};
        for (var i = 0; i < this.gridOptions.gridCells.length; i++) {
            tmpObj[this.gridOptions.gridCells[i].id] = this.gridOptions.gridCells[i];
            //tmpObj[this.gridOptions.gridCells[i].id]['value'];
            if (this.gridOptions.gridCells[i].type == 'text')
                tmpObj[this.gridOptions.gridCells[i].id]['value'] = '';
            else if (this.gridOptions.gridCells[i].type == 'number')
                tmpObj[this.gridOptions.gridCells[i].id]['value'] = 0;
        }
        if (Object.keys(tmpObj).length != 0) {
            tmpObj['complete'] = false;
            this.newAddObj = tmpObj;
        }
        if (dbgPrint)
            console.log("this.newAddObj=", this.newAddObj);
        if (dbgPrint)
            console.log("tmpObj=", tmpObj);
    };
    rtGridBoxAddComponent.prototype.cancelNewLine_grTbl = function () {
        if (dbgPrint)
            console.log("this.newAddObj=", this.newAddObj);
        this.newAddObj = null;
    };
    rtGridBoxAddComponent.prototype.deleteObjFromList = function (courseItem) {
        //console.log("delete courseItem=", courseItem);
        var index = this.setObj.courses.indexOf(courseItem);
        if (index > -1) {
            this.setObj.courses.splice(index, 1);
        }
        this.calculate_average();
    };
    rtGridBoxAddComponent.prototype.change_colEntry = function (currentColEntry, newObj, evt) {
        newObj[currentColEntry.id].value = evt.target.value;
        this.checkNewAddObj();
    };
    rtGridBoxAddComponent.prototype.checkNewAddObj = function () {
        var isComplete = true;
        for (var key in this.newAddObj) {
            if (key != 'complete') {
                //console.log("colEntry=",key);
                var obj = this.newAddObj[key];
                if (obj['value'] == '0' || obj['value'] == '' || obj['value'] == 0) {
                    isComplete = false;
                    break;
                }
            }
        }
        this.newAddObj['complete'] = isComplete;
        //console.log("this.newAddObj=",this.newAddObj);
    };
    rtGridBoxAddComponent.prototype.addObjToList = function (newObj) {
        var newAddObj_Deep = this.copyDeep(newObj);
        //newObj = this.newAddObj; // for copying by value and not by reference
        this.setObj.courses.push(newAddObj_Deep);
        //(<FormControl>this.formgroup.controls[this.formEntry.key]).setValue(this.tmpAddArray);
        this.newAddObj = null;
        if (dbgPrint)
            console.log('this.setObj.courses', this.setObj.courses);
        this.calculate_average();
    };
    rtGridBoxAddComponent.prototype.copyDeep = function (o) {
        var output, v, key;
        output = Array.isArray(o) ? [] : {};
        for (key in o) {
            v = o[key];
            output[key] = (typeof v === "object") ? this.copyDeep(v) : v;
        }
        return output;
    };
    rtGridBoxAddComponent.prototype.calculate_average = function () {
        var sumValues = 0;
        for (var i = 0; i < this.setObj.courses.length; i++) {
            sumValues = sumValues + parseFloat(this.setObj.courses[i].grade.value);
            this.averageCalculated = (sumValues / (i + 1)).toFixed(1);
            if (dbgPrint)
                console.log("sumValues=", sumValues, i, this.setObj.courses[i]);
        }
        //this.change_averageValue();
    };
    rtGridBoxAddComponent.prototype.change_averageValue = function (evt) {
        //newObj[currentColEntry.id].value = evt.target.value;
        var tmpSetValue = '0.0';
        if (evt != undefined)
            tmpSetValue = parseFloat(evt.target.value).toFixed(1);
        else
            tmpSetValue = parseFloat(this.averageCalculated).toFixed(1);
        //this.setObj.courses = this.tmpAddArray;
        this.setObj.avrValue = tmpSetValue;
        //console.log("in change_averageValue,this.setObj.avrValue=",this.setObj.avrValue);
        if (isNaN(parseFloat(this.setObj.avrValue))) {
            if (dbgPrint)
                console.log("in isNan,evt=", evt);
            this.calculate_average();
            //evt.srcE.placeholder = this.averageCalculated;
            this.setObj.avrValue = '';
            this.formgroup.controls[this.formEntry.key].setValue('');
            this.isValValid;
        }
        else {
            this.formgroup.controls[this.formEntry.key].setValue(this.setObj);
            this.isValValid = true;
        }
        //setValue(setObj);
        if (dbgPrint)
            console.log("this.formgroup=", this.formgroup.controls[this.formEntry.key]); //this.setObj.courses;
    };
    return rtGridBoxAddComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], rtGridBoxAddComponent.prototype, "formEntry", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup)
], rtGridBoxAddComponent.prototype, "formgroup", void 0);
rtGridBoxAddComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'rt-grid-box-add',
        templateUrl: 'rt-grid-box-add.component.html'
    }),
    __metadata("design:paramtypes", [rt_authentication_service_1.AuthenticationService])
], rtGridBoxAddComponent);
exports.rtGridBoxAddComponent = rtGridBoxAddComponent;
//# sourceMappingURL=rt-grid-box-add.component.js.map