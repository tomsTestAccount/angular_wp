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
var rt_form_validators_service_1 = require("../_services/rt-form-validators.service");
//import { ViewContainerRef } from '@angular/core';
//var html = require('./ua-ope.component.html!text');
var LmuUserOpeComponent = (function () {
    //----------------------------------------------------
    function LmuUserOpeComponent(fb) {
        this.fb = fb;
        //--------------------------------------------
        /*showTooltip1 = false;
        fU_progress_ope: number = 0;
        fU_response_ope: any = {};
    
        hasBaseDropZoneOver_ope: boolean = false;
        options_degreeUpload_ope: Object;
        uploadedData_Degree_ope : any[];
    
        */
        //--------------------------------------------------------
        this.rtValidators = new rt_form_validators_service_1.rtFormValidators;
        this.dbgIsOpen = false;
        //file-upload init
        /*this.zone = new NgZone({ enableLongStackTrace: false });

        this.uploadedData_Degree_ope = new Array(); //TODO: load via restApi (Mock first)
        this.options_degreeUpload_ope= {
            url: 'http://localhost:3001/upload',
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        };
        */
    }
    //---------------------------------------------------
    LmuUserOpeComponent.prototype.ngOnInit = function () {
        this.buildForm();
        // this.isDragDropAvailable();
    };
    LmuUserOpeComponent.prototype.buildForm = function () {
        var _this = this;
        this.opeForm = this.fb.group({
            'acadEdu_ope': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'acadLvl_ope': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'acadInst_ope': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'degreeConferralDate_ope': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'copyOfDegreeCert_ope': [[], forms_1.Validators.compose([forms_1.Validators.required, this.rtValidators.validateArray])],
        });
        //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
        this.opeForm.statusChanges.subscribe(function (data) { return _this.onFormStatusChanged(data); });
        this.opeForm.value.copyOfDegreeCert_ope = new Array();
        this.formEntries = [
            {
                formgroup: this.opeForm,
                key: 'acadEdu_ope',
                title: 'Academic Education *',
                type: 'textarea',
                required: true
            },
            {
                formgroup: this.opeForm,
                key: 'acadLvl_ope',
                title: 'Academic Level *',
                type: 'textarea',
                required: true
            },
            {
                formgroup: this.opeForm,
                key: 'acadInst_ope',
                title: 'Academic Institution *',
                type: 'textarea',
                required: true
            },
            {
                //formgroup: this.opeForm,
                key: 'degreeConferralDate_ope',
                title: 'Degree Conferral Date *',
                type: 'date',
                required: true
            },
            {
                formgroup: this.opeForm,
                key: 'copyOfDegreeCert_ope',
                title: 'Copy of Degree Certificate *',
                type: 'fileUpload',
                options: {
                    url: 'http://localhost:3001/upload',
                    filterExtensions: true,
                    allowedExtensions: ['application/pdf'],
                    calculateSpeed: true,
                },
                required: true
            }
        ];
    };
    LmuUserOpeComponent.prototype.onFormStatusChanged = function (data) {
        var tmpStatus = false;
        if (data === 'VALID') {
            console.log("onFormStatusChanged", data);
            tmpStatus = true;
        }
        this.usermodel = this.opeForm;
        //this.onFormEvent_pe.emit(tmpStatus);
    };
    Object.defineProperty(LmuUserOpeComponent.prototype, "diagnostic", {
        /*
            //----------- for file upload -----------------------------------------------
        
            bIsDDavailable = false;
        
            isDragDropAvailable(){
                var div = document.createElement('div');
                this.bIsDDavailable = ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
                //console.log("bIsDDavailable=",this.bIsDDavailable);
            }
        
            getFileSize(bytes:number):string{
                if(bytes == 0) return '0 Byte';
                var k = 1000;
                var decimals = 2;
                var dm = decimals || 3;
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return +parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        
        
            //------ for file upload degreeCertificate ope
        
        
            handleUpload(section:string,data): void {
                if (section=='degreeUpload_ope') {
                    this.zone.run(() => {
        
                        this.hasBaseDropZoneOver_ope = null;
        
                        this.fU_response_ope = data;
        
                        this.fU_progress_ope = Math.floor(data.progress.percent / 100);
        
                        if (data && data.response) {
                            this.uploadedData_Degree_ope.push(data);
                            //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).updateValueAndValidity();
                            (<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(this.uploadedData_Degree_ope);
                            //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(data.originalName);
        
                            console.log("uploaded file=", data);
        
        
                            //var fileList = []
                            //for(var i=0;i<this.uploadedData_Degree_ope.length;i++)
                            {
        
                            }
                            //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(data.originalName);
        
                        }
                    });
                }
        
            }
        
            fileOverBase(section:string,e:any):void {
                if (section=='degreeUpload_ope') {
                    this.hasBaseDropZoneOver_ope = e;
                }
        
            }
        
        
            deleteFile(section:string,file:any):void{
        
                if (section=='degreeUpload_ope') {
                    let index = this.uploadedData_Degree_ope.indexOf(file);
                    if (index > -1) {
                        this.uploadedData_Degree_ope.splice(index, 1);
        
                    }
        
                    if (this.uploadedData_Degree_ope.length == 0) {
                        (<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).reset();
                    }
                }
            }
        
        */
        //------------------- debug ---------------------------------------------
        // TODO: Remove this when we're done
        get: function () { return JSON.stringify(this.usermodel); },
        enumerable: true,
        configurable: true
    });
    LmuUserOpeComponent.prototype.toggleDbg = function () {
        this.dbgIsOpen = !this.dbgIsOpen;
        console.log("this.dbgIsOpen=", this.dbgIsOpen);
        console.log("opeForm=", this.opeForm);
    };
    LmuUserOpeComponent.prototype.onChange = function (e) {
        //this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
        //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
        console.log(this.opeForm.controls['copyOfDegreeCert_ope']);
        console.log("e=", e);
    };
    return LmuUserOpeComponent;
}());
LmuUserOpeComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'lmu_user_ope',
        templateUrl: 'ua-ope.component.html',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], LmuUserOpeComponent);
exports.LmuUserOpeComponent = LmuUserOpeComponent;
//# sourceMappingURL=ua-ope.component.js.map