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
var configFile_1 = require("../_models/configFile");
var dbgPrint = false;
//import { ViewContainerRef } from '@angular/core';
//var html = require('./rt-file-uploader.component.html!text');
//var css = require('./rtForm.css!text');
var rtFileUploaderComponent = (function () {
    //----------------------------------------------------
    //constructor(compId:string,t:string,secP:string,fCN:string) {
    function rtFileUploaderComponent(srvCfg) {
        /*
        @Input() title : string = 'title string missing';
        @Input() secParagraph : string = 'secParagrap string missing';
        @Input() secParagraphArray : string[] = new Array();
    
        @Input() compId : string;
        */
        this.title = 'title string missing';
        this.secParagraph = 'secParagrap string missing';
        this.secParagraphArray = new Array();
        this.options = {};
        //@Output() uploadedDataRes : any = new Array();  //TODO: load via restApi (Mock first)
        //@Output('change') uploadedDataChanged = new EventEmitter();
        this.uploadedData = new Array();
        this.uploadedDataChanged = new core_1.EventEmitter();
        this.showTooltip1 = false;
        this.fU_progress = 0;
        this.fU_response = {};
        this.hasBaseDropZoneOver = false;
        this.zone = new core_1.NgZone({ enableLongStackTrace: false });
        /*
        if (this.uploadedData.length == 0) {
            this.uploadedData = new Array();
        }
        */
        //var fileUpload_url = 'http://' + ServerConfigs.fileUploadServer_ip + ':' + ServerConfigs.fileUploadServer_port + '/upload';
        var fileUpload_url = srvCfg.get_serverConfigs().url + '/upload';
        if (dbgPrint)
            console.log("fileUpload_url= ", fileUpload_url);
        if (dbgPrint)
            console.log("this.options= ", this.options);
        if (this.options === {}) {
            this.options = {
                url: fileUpload_url,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],
                calculateSpeed: true,
            };
        }
        this.bIsDDavailable = false;
        //this.uploadedDataArray = new Array();
    }
    Object.defineProperty(rtFileUploaderComponent.prototype, "formgroup", {
        set: function (givenForm) {
            //if (dbgPrint) console.log("givenForm=",givenForm);
            this.currentForm = givenForm;
            if (dbgPrint)
                console.log("In rtFileUploaderComponent this.currentForm=", this.currentForm);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(rtFileUploaderComponent.prototype, "formEntry", {
        set: function (formEntry) {
            this.currentFormEntry = formEntry;
            if (dbgPrint)
                console.log("In rtFileUploaderComponent this.currentFormEntry=", this.currentFormEntry);
        },
        enumerable: true,
        configurable: true
    });
    ;
    //---------------------------------------------------
    rtFileUploaderComponent.prototype.ngOnInit = function () {
        this.isDragDropAvailable();
        this.uploadedDataArray = this.currentForm.controls[this.currentFormEntry.key].value || new Array(); //= this.formCtrlGroup.controls[this.formEntry.key].value; //TODO: handle data from restAPI here
        this.title = this.currentFormEntry.title;
        this.secParagraphArray = this.currentFormEntry.secParagraphArray;
        this.compId = this.currentFormEntry.key;
        this.options = this.currentFormEntry.options;
        //console.log("In rt-file-uploader , formEntry=",this.formEntry);
        // console.log("In rt-file-uploader , formgroup=",this.formgroup);
        //console.log("this.uploadedDataArray=",this.uploadedDataArray);
    };
    rtFileUploaderComponent.prototype.isDragDropAvailable = function () {
        var div = document.createElement('div');
        this.bIsDDavailable = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
        //console.log("bIsDDavailable=",this.bIsDDavailable);
    };
    rtFileUploaderComponent.prototype.getFileSize = function (bytes) {
        if (bytes == 0)
            return '0 Byte';
        var k = 1000;
        var decimals = 2;
        var dm = decimals || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return +parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };
    rtFileUploaderComponent.prototype.handleUpload = function (data) {
        var _this = this;
        this.zone.run(function () {
            _this.hasBaseDropZoneOver = null;
            _this.fU_response = data;
            _this.fU_progress = Math.floor(data.progress.percent / 100);
            if (data && data.response) {
                //this.uploadedData.push(data);
                _this.uploadedDataArray.push(data);
                //console.log("uploaded file=", data);
                //console.log("uploadedDataArray=", this.uploadedDataArray);
                if (dbgPrint)
                    console.log("formgroup.controls[", _this.currentFormEntry.key, "]=", _this.currentForm.controls[_this.currentFormEntry.key]);
                //(<FormControl>this.formCtrlGroup.controls[this.formCtrlName]).patchValue(this.uploadedDataArray);
                _this.currentForm.controls[_this.currentFormEntry.key].patchValue(_this.uploadedDataArray);
            }
        });
    };
    rtFileUploaderComponent.prototype.fileOverBase = function (e) {
        this.hasBaseDropZoneOver = e;
    };
    rtFileUploaderComponent.prototype.deleteFile = function (file) {
        var index = this.uploadedDataArray.indexOf(file);
        if (index > -1) {
            this.uploadedDataArray.splice(index, 1);
        }
        this.currentForm.controls[this.currentFormEntry.key].patchValue(this.uploadedDataArray);
        if (dbgPrint)
            console.log("formgroup.controls[", this.currentFormEntry.key, "]=", this.currentForm.controls[this.currentFormEntry.key]);
        /*
        if (this.uploadedDataArray.length == 0) {
            console.log("uploadarray is empty! reset fromcontrol");
            //(<FormControl>this.formCtrlGroup.controls[this.formCtrlName]).reset();
            (<FormControl>this.formCtrlGroup.controls[this.formEntry.key]).reset();
        }
        else  console.log("uploadarray =",this.uploadedDataArray);
        */
    };
    rtFileUploaderComponent.prototype.uploadChanged = function (list) {
        if (dbgPrint)
            console.log("In uploadChanged, list=", list);
        this.uploadedDataChanged.emit({
            value: this.uploadedData
        });
    };
    return rtFileUploaderComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], rtFileUploaderComponent.prototype, "uploadedDataChanged", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup),
    __metadata("design:paramtypes", [forms_1.FormGroup])
], rtFileUploaderComponent.prototype, "formgroup", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], rtFileUploaderComponent.prototype, "formEntry", null);
rtFileUploaderComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'rt-file-uploader',
        templateUrl: 'rt-file-uploader.component.html'
    }),
    __metadata("design:paramtypes", [configFile_1.ServerConfigs])
], rtFileUploaderComponent);
exports.rtFileUploaderComponent = rtFileUploaderComponent;
//# sourceMappingURL=rt-file-uploader.component.js.map