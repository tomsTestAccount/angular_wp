"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var forms_1 = require("@angular/forms");
var rt_form_validators_service_1 = require("../_services/rt-form-validators.service");
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var cFormObject = (function () {
    function cFormObject(formgroup, formEntries) {
        this.formgroup = formgroup;
        this.formEntries = formEntries;
    }
    return cFormObject;
}());
exports.cFormObject = cFormObject;
var uaFormObj = (function () {
    function uaFormObj() {
    }
    return uaFormObj;
}());
exports.uaFormObj = uaFormObj;
;
var RtFormService = (function () {
    function RtFormService() {
        //---------------- subForm- services --------------------------------
        // Observable sources
        this.subFormObject_apd = new Subject_1.Subject();
        this.subFormObject_ac = new Subject_1.Subject();
        this.subFormObject_oi = new Subject_1.Subject();
        this.subFormObject_ac2 = new Subject_1.Subject();
        this.subFormIsUpdated = new Subject_1.Subject();
        //announcement
        this.subFormAnnounced_apd$ = this.subFormObject_apd.asObservable();
        this.subFormAnnounced_ac$ = this.subFormObject_ac.asObservable();
        this.subFormAnnounced_oi$ = this.subFormObject_oi.asObservable();
        this.subFormAnnounced_ac2$ = this.subFormObject_ac2.asObservable();
        this.subFormIsUpdated$ = this.subFormIsUpdated.asObservable();
        //----------------------------------------------------------------
        this.rtValidators = new rt_form_validators_service_1.rtFormValidators;
        // Get function from string, with or without scopes (by Nicolas Gauthier)
        this.getFunctionCallFromString = function (stringArray) {
            if (stringArray == undefined)
                return null;
            if (!Array.isArray(stringArray))
                return null;
            if (stringArray.length == 0)
                return null;
            var found_require = false;
            var found_minLength = 0;
            var vallArary = [];
            for (var i = 0; i < stringArray.length; i++) {
                if (stringArray[i].indexOf('required') != -1) {
                    found_require = true;
                    vallArary.push(forms_1.Validators.required);
                }
                else if (stringArray[i].indexOf('minLength') != -1) {
                    var splitString = stringArray[i].split('=');
                    found_minLength = splitString[splitString.length - 1];
                    //console.log("found_minLength =",found_minLength );
                    vallArary.push(forms_1.Validators.minLength(found_minLength));
                }
            }
            //console.log("vallArary=",vallArary);
            return forms_1.Validators.compose(vallArary);
        };
        /*
        addFormArray2Group(entries: any,required:boolean,parentForm:FormGroup) {
    
    
            let formControlGroup: any = {};
            //let formControlGroup: [FormControl] = [];
    
            //console.log("this.currentForm=", this.currentForm.entries);
    
            //'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
    
    
    
            let formArray:FormArray;
            if (required) formArray = new FormArray(formControlGroup,Validators.compose([Validators.required]));
            else formArray= new FormArray(formControlGroup);
    
            return parentForm;
        }
        */
        /*
        buildForm(entries:[any],required:boolean):FormGroup{
    
    
            //let formObj= new cFormObject(name,entries,required);
    
            let form:FormGroup;
            //form = this.toFormGroup(entries);
    
    
            //let formArray:FormArray;
    
            form = this.addFormArray2Group(entries,required,form);
    
            //formArray.setParent(form);
    
            //form. = 'dsjhdg';
    
    
    
            return form;
    
        }
        */
    }
    // Service commands
    RtFormService.prototype.prepareSubForm_apd = function (subForm) {
        this.subFormObject_apd.next(subForm);
    };
    RtFormService.prototype.prepareSubForm_ac = function (subForm) {
        this.subFormObject_ac.next(subForm);
    };
    RtFormService.prototype.prepareSubForm_ac2 = function (subForm) {
        this.subFormObject_ac2.next(subForm);
    };
    RtFormService.prototype.prepareSubForm_oi = function (subForm) {
        this.subFormObject_oi.next(subForm);
    };
    RtFormService.prototype.subFormsUpdated = function (bVal) {
        this.subFormIsUpdated.next(bVal);
    };
    RtFormService.prototype.buildFormObject = function (form, entries) {
        return new cFormObject(form, entries);
    };
    RtFormService.prototype.toFormGroup = function (entries) {
        //console.log("entries=",entries);
        var _this = this;
        var group = {};
        //console.log("this.currentForm=", this.currentForm.entries);
        //'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
        entries.forEach(function (entry) {
            if (entry.defaultValue != undefined) {
            }
            if (entry.type == 'fileUpload' || entry.type == 'grid-box-add') {
                group[entry.key] = new forms_1.FormControl(entry.defaultValue || '', entry.key.validators); //TODO: validator
            }
            else if (entry.key == 'firstname') {
                group[entry.key] = new forms_1.FormControl(entry.defaultValue || '', forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.minLength(3)])); //TODO: validator
            }
            else {
                //console.log("entry=", entry);
                //Validators.compose([Validators.required,Validators.minLength(3)])
                group[entry.key] = new forms_1.FormControl(entry.defaultValue || '', _this.getFunctionCallFromString(entry.validators)); //TODO: validator
            }
        });
        return new forms_1.FormGroup(group);
        //return new FormArray(group);
    };
    return RtFormService;
}());
RtFormService = __decorate([
    core_1.Injectable()
], RtFormService);
exports.RtFormService = RtFormService;
//# sourceMappingURL=rt-forms.service.js.map