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
var lmu_ua_formList_1 = require("../_models/lmu_ua_formList");
//var html = require('./ua-oi.component.html!text');
var LmuUserOiComponent = (function () {
    //----------------------------------------------------
    function LmuUserOiComponent(fb) {
        this.fb = fb;
        this.rtValidators = new rt_form_validators_service_1.rtFormValidators;
        //----------------------------------------------------
        this.lmu_ua_form = new lmu_ua_formList_1.lmu_ua_formList();
        //----------------------------------------------------
        this.dbgPrint = false;
        this.dbgIsOpen = false;
        //for file-upload-components
        /*this.title_essay_oi = 'Essay "Data Science"';
        this.secParagraph_essay_oi = 'Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.The essay musst not exceed 1,000 words.'

        this.options4upload_essay_oi= {
            url: 'http://localhost:3001/upload',
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        };

        this.uploadedDataArray_essay_oi = new Array(); //TODO: load via restApi (Mock first)



        this.secParagraph_otherDoc_oi = 'Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc., as well as your ECTS calculation document within a single PDF file.'
        //this.uploadedData_otherDoc_oi = new Array(); //TODO: load via restApi (Mock first)
        this.options4upload_otherDoc_oi= {
            url: 'http://localhost:3001/upload',
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        };

        this.titleTest = "das ist ein test";
        */
        //this.currentFormObject = this.lmu_ua_form.buildFormObject_oi();
    }
    Object.defineProperty(LmuUserOiComponent.prototype, "setForm", {
        set: function (givenForm) {
            if (this.dbgPrint)
                console.log("givenForm=", givenForm);
            this.currentForm = givenForm.controls[0];
            //this.currentForm = givenForm;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LmuUserOiComponent.prototype, "setFormEntries", {
        set: function (formEntries) {
            this.currentFormEntries = formEntries;
        },
        enumerable: true,
        configurable: true
    });
    ;
    //---------------------------------------------------
    LmuUserOiComponent.prototype.ngOnInit = function () {
        // this.buildForm();
        if (this.dbgPrint)
            console.log("this.currentFormObject=", this.currentFormObject);
    };
    LmuUserOiComponent.prototype.buildForm = function () {
        //this.oiForm.value.uploadedData_essay_oi = this.uploadedDataArray_essay_oi ;
        var _this = this;
        this.oiForm = this.fb.group({
            'uploadedData_essay_oi': [[], forms_1.Validators.compose([forms_1.Validators.required, this.rtValidators.validateArray])],
            'uploadedData_otherDoc_oi': [[], forms_1.Validators.compose([forms_1.Validators.required, this.rtValidators.validateArray])],
            'anyOtherInfos_oi': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'specialProv4Interview': ['', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])],
            'wantEmailnotifications': [true, forms_1.Validators.required]
        });
        //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
        this.oiForm.statusChanges.subscribe(function (data) { return _this.onFormStatusChanged(data); });
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
                secParagraphArray: ['Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc.,', ' as well as your ECTS calculation document within a single PDF file.'],
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
                key: 'anyOtherInfos_oi',
                title: 'Any other information  *',
                type: 'textarea',
                required: true
            },
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
        ];
    };
    LmuUserOiComponent.prototype.onFormStatusChanged = function (data) {
        var tmpStatus = false;
        if (data === 'VALID') {
            console.log("onFormStatusChanged", data);
            tmpStatus = true;
        }
        //this.usermodel = this.oiForm;
        //this.onFormEvent_pe.emit(tmpStatus);
    };
    LmuUserOiComponent.prototype.uploadedDataChanged_essay_oi = function (e) {
        this.oiForm.value.uploadedData_essay_oi = e.value;
        if (this.dbgPrint)
            console.log("In uploadedDataChanged_essay_oi, e=", e);
    };
    LmuUserOiComponent.prototype.uploadedDataChanged_otherDoc_oi = function (e) {
        this.oiForm.value.uploadedData_otherDoc_oi = e.value;
        if (this.dbgPrint)
            console.log("In uploadedDataChanged_otherDoc_oi, e=", e);
    };
    //------------------- debug ---------------------------------------------
    // TODO: Remove this when we're done
    //get diagnostic(){ return JSON.stringify(this.usermodel); }
    LmuUserOiComponent.prototype.toggleDbg = function () {
        this.dbgIsOpen = !this.dbgIsOpen;
        if (this.dbgPrint)
            console.log("this.dbgIsOpen=", this.dbgIsOpen);
        //console.log("this.uploadedDataArray_essay_oi=",this.uploadedDataArray_essay_oi);
    };
    return LmuUserOiComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup),
    __metadata("design:paramtypes", [forms_1.FormGroup])
], LmuUserOiComponent.prototype, "setForm", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], LmuUserOiComponent.prototype, "setFormEntries", null);
LmuUserOiComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'lmu_user_oi',
        templateUrl: 'ua-oi.component.html',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], LmuUserOiComponent);
exports.LmuUserOiComponent = LmuUserOiComponent;
//# sourceMappingURL=ua-oi.component.js.map