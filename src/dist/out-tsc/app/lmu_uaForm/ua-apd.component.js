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
//import { ViewContainerRef } from '@angular/core';
//var html = require('./ua-apd.component.html!text');
var LmuUserApdComponent = (function () {
    /*
    @Input() genderCheckBox_clicked()
    {
        if (this.model.genderM) this.model.genderF = false;
        else if(this.model.genderF) this.model.genderM = false;
        console.log("In genderCheckBox_clicked, this.model.genderM,this.model.genderF= ",this.model.genderM,this.model.genderF );
    }
    */
    //lmu_ua_form= new lmu_ua_formList();
    function LmuUserApdComponent(fb) {
        //console.log("In LmuUserApdComponent");
        this.fb = fb;
        this.onFormEvent_apd = new core_1.EventEmitter();
        this.dbgPrint = false;
        this.dbgIsOpen = false;
        this.submitted = false;
        //this.currentForm = new lmu_ua_formList();
        //this.apdForm = this.lmu_ua_form.buildFormObject_apd();
        //this.countries = CountryList;
        //this.usermodel = {uid:1 ,surname : "", givenName : "", gender : 'male', dateOfBirth : { day:0, month:0, year:0}};
        //this.usermodel = UserModel;
        //this.usermodel = { };
        // this.usermodel['dateOfBirth'] = {};
        //console.log("In LmuUserApdComponent constructor, usermodel",this.usermodel); //, ', this.countries=',this.countries);
    }
    Object.defineProperty(LmuUserApdComponent.prototype, "setForm", {
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
    Object.defineProperty(LmuUserApdComponent.prototype, "setFormEntries", {
        set: function (formEntries) {
            this.currentFormEntries = formEntries;
        },
        enumerable: true,
        configurable: true
    });
    ;
    LmuUserApdComponent.prototype.ngOnInit = function () {
        if (this.dbgPrint)
            console.log("this.currentForm=", this.currentForm);
        if (this.dbgPrint)
            console.log("formEntries=", this.currentFormEntries);
        var currentUserObj = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUserObj) {
            //console.log("In apdForm, currentUserObj=",currentUserObj);
            this.currentForm.controls['lastname'].patchValue(currentUserObj['lastName']);
            this.currentForm.controls['firstname'].patchValue(currentUserObj['firstName']);
            this.currentForm.controls['email'].patchValue(currentUserObj['email']);
        }
        //console.log("currentForm.controls.apd_formArray=",this.currentForm.controls['apd_formArray']);
        //this.buildForm();
        /*this.currentFormObject= this.lmu_ua_form.buildFormObject_apd();

        let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUserObj) {

            //console.log("In apdForm, currentUserObj=",currentUserObj);

            this.currentFormObject.formgroup.controls['lastname'].patchValue(currentUserObj['lastName']);
            this.currentFormObject.formgroup.controls['firstname'].patchValue(currentUserObj['firstName']);
            this.currentFormObject.formgroup.controls['email'].patchValue(currentUserObj['email']);
        }
        */
    };
    Object.defineProperty(LmuUserApdComponent.prototype, "diagnostic", {
        /*
            toFormGroup(entries:any){				//TODO: build own rt-form-service for that stuff
        
                //console.log("entries=",entries);
        
                let group:any = {};
        
                //console.log("this.currentForm=",this.currentForm.entries);
        
                entries.forEach(entry => {
                    console.log("entry=",entry.key);
                 group[entry.key]= new FormControl(entry.key.defaultValue || '',entry.key.validators);
                 })
        
        
        
                return new FormGroup(group);
            }
        
        */
        /*
            buildFormObject(): void {
        
        
        
                    this.apdForm = this.fb.group({
                        //'surname': '',
                        'lastname': ['', Validators.compose([Validators.minLength(3)])],
                        //'surname': ['', Validators.minLength(3)],
                        'givenname': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'gender': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'nationality': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'dateOfBirth2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'address1': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'address2': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'address3': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'address4': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        'phoneNumber': ['', Validators.compose([Validators.required,Validators.minLength(3)])],
                        //'phoneNumber2': ['', Validators.compose([Validators.maxLength(20),Validators.minLength(3)])],
                        'phoneNumber2': ['', Validators.compose([Validators.maxLength(20),Validators.minLength(3)])],
                        'email': ['', Validators.compose([Validators.required,Validators.minLength(3)])]
                    });
        
                    //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
                    this.apdForm.statusChanges.subscribe(data => this.onFormStatusChanged(data));
        
        
                    this.formgroup = this.apdForm;
                    this.formEntries = [
                        {   //formgroup : this.apdForm,
                            key : 'lastname',
                            title : 'Surname / Family Name *',
                            type: 'text',
                            required: true
                        },
                        {   //formgroup : this.apdForm,
                            key : 'givenname',
                            title : 'First Name(s) / Given Name(s) *',
                            type: 'text',
                            required: true
                        },
                        {   //formgroup : this.apdForm,
                            key : 'gender',
                            title : 'Gender *',
                            type: 'select',
                            options : [
                                {
                                    name : 'male'
                                },
                                {
                                    name : 'female'
                                }
                            ],
                            required: true
                        },{
                            //formgroup : this.apdForm,
                            key : 'dateOfBirth2',
                            title : 'Date of Birth *',
                            type: 'date',
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'nationality',
                            title : 'Country of Nationality *',
                            type: 'select',
                            options : this.countries,
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'address1',
                            title : 'Street Name and House Number *',
                            type: 'text',
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'address2',
                            title : 'Postcode / ZIP Code *',
                            type: 'text',
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'address3',
                            title : 'Place of Residence  *',
                            type: 'text',
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'address4',
                            title : 'Country of Residence *',
                            type: 'select',
                            options : this.countries,
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'phoneNumber',
                            title : 'Phonenumber  *',
                            type: 'number',
                            required: true
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'phoneNumber2',
                            title : 'other Phonenumber  (optional)',
                            type: 'number',
                            required: false
                        },
                        {
                            //formgroup : this.apdForm,
                            key : 'email',
                            title : 'Email Address *',
                            type: 'email',
                            required: true
                        }
        
                    ];
        
        
        
        
                let currentUserObj = JSON.parse(localStorage.getItem('currentUser'));
        
                if (currentUserObj) {
        
                    //console.log("In apdForm, currentUserObj=",currentUserObj);
        
                    this.currentFormObject.formgroup.controls['lastname'].patchValue(currentUserObj['lastName']);
                    this.currentFormObject.formgroup.controls['firstname'].patchValue(currentUserObj['firstName']);
                    this.currentFormObject.formgroup.controls['email'].patchValue(currentUserObj['email']);
                }
        
            }
        */
        /*
            onFormValueChanged(data)
            {
                console.log("onValueChanged",data);
            }
        */
        /*
            onFormStatusChanged(data)
            {
                var tmpStatus = false;
        
                if( data === 'VALID')
                {
                    console.log("onFormStatusChanged",data);
                    tmpStatus = true;
                }
        
        
                this.onFormEvent_apd.emit(tmpStatus);
        
            }
            */
        /*
        onSubmit()
        {
            console.log("In onSubmit() , this.fb",this.fb, " , this.apdForm",this.apdForm);
                this.submitted = true;
                this.uasubmit = true;
        }
    
        */
        /*
        ngOnChanges(changes: SimpleChanges) {
            // changes.prop contains the old and the new value...
            console.log("InngOnChanges , changes=",changes);
        }
        */
        /*
        @Input() set myUnless(condition: boolean) {
            if (!condition) {
              this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
              this.viewContainer.clear();
            }
        }
        */
        /*
        public getFormStatus()
        {
            return this.submitted;
        }
        */
        //test
        // TODO: Remove this when we're done
        get: function () {
            //return JSON.stringify(this.usermodel);
            return JSON.stringify(this.fb.group);
        },
        enumerable: true,
        configurable: true
    });
    LmuUserApdComponent.prototype.toggleDbg = function () {
        this.dbgIsOpen = !this.dbgIsOpen;
        if (this.dbgPrint)
            console.log("this.dbgIsOpen=", this.dbgIsOpen);
    };
    return LmuUserApdComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], LmuUserApdComponent.prototype, "uasubmit", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], LmuUserApdComponent.prototype, "onFormEvent_apd", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup),
    __metadata("design:paramtypes", [forms_1.FormGroup])
], LmuUserApdComponent.prototype, "setForm", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array),
    __metadata("design:paramtypes", [Array])
], LmuUserApdComponent.prototype, "setFormEntries", null);
LmuUserApdComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: "lmu_user_apd",
        templateUrl: 'ua-apd.component.html',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder])
], LmuUserApdComponent);
exports.LmuUserApdComponent = LmuUserApdComponent;
//# sourceMappingURL=ua-apd.component.js.map