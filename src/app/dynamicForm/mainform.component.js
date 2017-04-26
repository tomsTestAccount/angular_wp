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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lmu_ua_formList_1 = require("../_models/lmu_ua_formList_ts");
var rt_forms_service_1 = require("../_services/rt-forms.service");
var rt_authentication_service_1 = require("../_services/rt-authentication.service");
var configFile_1 = require("../_models/configFile");
var dialogs_services_1 = require("../_services/dialogs.services");
var dbgPrint_lifecyclehooks = true;
var dbgPrint_save = false;
var dbgPrint_formChanged = false;
var dbgPrint_formEntryChanged = false;
var UserApplicationComponent = (function () {
    //-------------------------------------------------------------------------------------------------------------------
    function UserApplicationComponent(//private _fb: FormBuilder,
        _authService, _elementRef, _rtFormSrv, serverConfs, lmu_ua_form, dialogsService) {
        var _this = this;
        this._authService = _authService;
        this._elementRef = _elementRef;
        this._rtFormSrv = _rtFormSrv;
        this.serverConfs = serverConfs;
        this.lmu_ua_form = lmu_ua_form;
        this.dialogsService = dialogsService;
        //TODO: load from form_model_list
        this.subFormEntries = [
            { title: " Applicant\'s Personal Details",
                key: "subFormGroup_apd",
                answerMissing: 0,
                site: 'subFormGroup_apd'
            },
            { title: "Previous Education",
                key: "subFormGroup_ac",
                answerMissing: 0,
                site: "subFormGroup_ac"
            },
            { title: "Other Previous Education (optional)",
                key: "subFormGroup_ac2",
                answerMissing: 0,
                site: "subFormGroup_ac",
                embedded: true,
            },
            { title: "Essay and other information",
                key: "subFormGroup_oi",
                answerMissing: 0,
                site: "subFormGroup_oi"
            }
        ];
        this.dbgIsOpen = false;
        //currentUaObj:any;
        this.dbgFormValues = false;
        this.changeDetected = false;
        this.isFormDataLoaded = false;
        //isFormValueLoadedFromServer = false;
        //public dialogResult: any;
        //public formChangedEntries: any[] = [];
        this.formChangedEntries = {
            subFormGroup_ac: { 0: {} },
            subFormGroup_ac2: { 0: {} },
            subFormGroup_apd: { 0: {} },
            subFormGroup_oi: { 0: {} },
        };
        this.mainFormValid = false;
        this.formEntriesChangeDetected = false;
        var serverURL = serverConfs.get_serverConfigs().url;
        var userId = serverConfs.get_serverConfigs().userId;
        this.summaryPage_href = serverURL + '/applications/' + userId + '/' + userId;
        //detect changes for form made by server --> detect when download form-data finished and child-views are initialized
        //TODO: We have to know here, when the init-process of child-Views (subFomrs) is finished !?! .... using of lifeCycleHooks (afterContent .. ) ??
        this._rtFormSrv.subFormsAreUpdated$.subscribe(function (isUpdated) {
            setTimeout(function () {
                //this.main_lmu_ua_form = this.lmu_ua_form.init_mainForm();
                //if (dbgPrint)
                console.log("In subFormsAreAllUpdated$ ", _this.main_lmu_ua_form);
                // subscribe to form changes, so we can detect the formEntries that were changed --> and send only these ones
                _this.subscribeToFormEntriesChanges();
                //set event the view is waiting for
                //this.isFormUpdated = isUpdated;
                //close loading dialog
                _this.dialogsService.closeDialog();
            }, 1000);
        });
    }
    ;
    UserApplicationComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (dbgPrint_lifecyclehooks)
            console.log("In ngOnInit for user-application-component");
        this.dialogsService.loading('Your data is loading ... '); //TODO: put this or a similar message in the beginning -> i.e. in app.module.ts
        this._authService.auth_getFormObject()
            .then(function (response) {
            if (dbgPrint_lifecyclehooks)
                console.log("In ngOnInit for user-application , after get data from server, data=!", response);
            //init mainForm  --> with the really data downloaded from server !
            _this.main_lmu_ua_form = _this.lmu_ua_form.init_mainForm();
            //we get the subform-entities and the pre-defined formEntries here
            _this.apd_formObj = _this.lmu_ua_form.apd_formObj;
            _this.ac_formObj = _this.lmu_ua_form.ac_formObj;
            _this.ac2_formObj = _this.lmu_ua_form.ac2_formObj;
            _this.oi_formObj = _this.lmu_ua_form.oi_formObj;
            //set event the view is waiting for --> so the childViews (for each subForm) will be initialized
            _this.isFormDataLoaded = true;
            //using of setTimeout works, but is dirty !!!
            /*setTimeout(()=> {
                //console.log("this.apd_formObj=",this.apd_formObj);


                //subscribe to mainform changes... deprecated see form subscribeToFormEntriesChanges() below
                //this.subscribeMainFormValuesChanged();

                // subscribe to form entries changes, so we can detect the formEntries that were changed --> and send only these ones
                this.subscribeToFormEntriesChanges();


                //close loading dialog
                this.dialogsService.closeDialog();

                // has to be set after 'subscribeToFormEntriesChanges', because the subsribe functions are calling this.setChangeDetected()
                //this.reset_formChangedEntries();
                //this.setChangeDetected(false);


                if (dbgPrint_lifecyclehooks) console.log("In user-application ngAfterViewInit2, after get data, this=!",this);
            },1000);
            */
        })
            .catch(function (err) {
            _this.dialogsService.info('Error for retrieving data from server, err= ', err);
        });
    };
    UserApplicationComponent.prototype.ngAfterViewInit = function () {
        if (dbgPrint_lifecyclehooks)
            console.log("In ngAfterViewInit for user-application-component");
        //setTimeout(()=> {
        //var el = this._elementRef.nativeElement.querySelector('lmu_user_apd');
        //console.log(el);},1000);
    };
    UserApplicationComponent.prototype.ngAfterViewChecked = function () {
        //if (dbgPrint_lifecyclehooks)	console.log("In ngAfterViewChecked for user-application-component");
        //let vc = ViewChildren('input');
        //console.log("In ngAfterViewChecked,vc=",vc());
    };
    UserApplicationComponent.prototype.ngDoCheck = function () {
        //console.log("In ngDoCheck");
        this.changeDetected = this.formEntriesChangeDetected;
        if (this.main_lmu_ua_form) {
            this.mainFormValid = this.main_lmu_ua_form.valid;
        }
    };
    UserApplicationComponent.prototype.setChangeDetected = function (value, fControl) {
        var _this = this;
        /*
            if (value == this.changeDetected) return;
            else {
                setTimeout(() => {
                    this.changeDetected = value;
                }, 1);
            }
        */
        //if (value == this.changeDetected) return;
        //else
        {
            setTimeout(function () {
                _this.formEntriesChangeDetected = value;
                _this.main_lmu_ua_form.markAsDirty();
                //if (fControl) console.log("in setChangedDetected:",this.formEntriesChangeDetected, fControl);
                //else console.log("in setChangedDetected:",this.formEntriesChangeDetected);
            }, 100);
        }
    };
    UserApplicationComponent.prototype.reset_formChangedEntries = function () {
        this.formChangedEntries = {
            subFormGroup_ac: { 0: {} },
            subFormGroup_ac2: { 0: {} },
            subFormGroup_apd: { 0: {} },
            subFormGroup_oi: { 0: {} },
        };
    };
    ;
    UserApplicationComponent.prototype.subscribeMainFormValuesChanged = function () {
        /*this.main_lmu_ua_form.controls['subFormGroup_ac'].valueChanges
            .subscribe(x => {
                console.log("in ValueChanged x = ",this.main_lmu_ua_form);
                if (this.main_lmu_ua_form.dirty) this.setChangeDetected(true);
            });
        */
        var _this = this;
        this.main_lmu_ua_form.valueChanges
            .subscribe(function (x) {
            console.log("in ValueChanged x = ", x);
            console.log("in this.main_lmu_ua_form=", _this.main_lmu_ua_form);
            if (_this.main_lmu_ua_form.dirty)
                _this.setChangeDetected(true);
        });
    };
    UserApplicationComponent.prototype.subscribeToFormEntriesChanges = function () {
        var _this = this;
        if (dbgPrint_formEntryChanged)
            console.log("form=", this.main_lmu_ua_form.controls['subFormGroup_apd']);
        this.main_lmu_ua_form.markAsPristine();
        this.main_lmu_ua_form.markAsUntouched();
        var _loop_1 = function (fControl) {
            //let castVar = (<FormControl>fControl);
            this_1.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(function (x) {
                _this.formChangedEntries.subFormGroup_apd[0][fControl] = x;
                //this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
                //this.lastValue = x[0];
                //console.log("in ValueChanged x = ",x);
                if (dbgPrint_formEntryChanged)
                    console.log("formControl", fControl, " =", _this.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls'][fControl]);
                if (_this.main_lmu_ua_form.dirty)
                    _this.setChangeDetected(true, fControl);
            });
        };
        var this_1 = this;
        // initialize stream
        for (var fControl in this.main_lmu_ua_form.controls['subFormGroup_apd']['controls'][0]['controls']) {
            _loop_1(fControl);
        }
        var _loop_2 = function (fControl) {
            //let castVar = (<FormControl>fControl);
            this_2.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(function (x) {
                _this.formChangedEntries.subFormGroup_ac[0][fControl] = x;
                //this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
                //this.lastValue = x[0];
                //console.log("in ValueChanged x = ",x);
                //if (dbgPrint_formEntryChanged)console.log("formControl", fControl," =",this.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls'][fControl]);
                if (_this.main_lmu_ua_form.dirty == true)
                    _this.setChangeDetected(true, fControl);
            });
        };
        var this_2 = this;
        for (var fControl in this.main_lmu_ua_form.controls['subFormGroup_ac']['controls'][0]['controls']) {
            _loop_2(fControl);
        }
        var _loop_3 = function (fControl) {
            //let castVar = (<FormControl>fControl);
            this_3.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(function (x) {
                _this.formChangedEntries.subFormGroup_ac2[0][fControl] = x;
                //this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
                //this.lastValue = x[0];
                //console.log("in ValueChanged x = ",x);
                if (dbgPrint_formEntryChanged)
                    console.log("formControl", fControl, " =", _this.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls'][fControl]);
                if (_this.main_lmu_ua_form.dirty)
                    _this.setChangeDetected(true, fControl);
            });
        };
        var this_3 = this;
        for (var fControl in this.main_lmu_ua_form.controls['subFormGroup_ac2']['controls'][0]['controls']) {
            _loop_3(fControl);
        }
        var _loop_4 = function (fControl) {
            //let castVar = (<FormControl>fControl);
            this_4.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls'][fControl].valueChanges
                .subscribe(function (x) {
                _this.formChangedEntries.subFormGroup_oi[0][fControl] = x;
                //this.formChangedEntries.push({event: 'VALUE_CHANGED', object: fControl})
                //this.lastValue = x[0];
                //console.log("in ValueChanged x = ",x);
                if (dbgPrint_formEntryChanged)
                    console.log("formControl", fControl, " =", _this.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls'][fControl]);
                if (_this.main_lmu_ua_form.dirty)
                    _this.setChangeDetected(true, fControl);
            });
        };
        var this_4 = this;
        for (var fControl in this.main_lmu_ua_form.controls['subFormGroup_oi']['controls'][0]['controls']) {
            _loop_4(fControl);
        }
        this.reset_formChangedEntries();
        this.setChangeDetected(false);
    };
    UserApplicationComponent.prototype.saveFormObj = function () {
        //this._rtRestService.setUaObject(this._authService.auth_getCurrentUser(),this.main_lmu_ua_form.value);
        var _this = this;
        if (dbgPrint_save)
            console.log("In saveFormObj, this.main_lmu_ua_form=", this.main_lmu_ua_form.value);
        if (dbgPrint_save)
            console.log("In saveFormObj, this.formChangedEntries=", this.formChangedEntries);
        this._authService.auth_setFormObj(this.formChangedEntries, true)
            .then(function (response) { console.log("Save Data Successful", response); })
            .catch(function (err) {
            if (err.statusText)
                _this.dialogsService.info('Save Data Error:' + err.statusText, err._body);
            else
                _this.dialogsService.info('Save Data Error:', err);
            //console.log("In saveFormObj err=",err)
        });
        this.setChangeDetected(false);
        this.reset_formChangedEntries();
    };
    UserApplicationComponent.prototype.select_subFormTab = function (wantedSubForm) {
        //if (dbgPrint)
        console.log("In select_comp4User, wantedSubForm=", wantedSubForm);
        var current_ua_sec;
        for (var i = 0; i < this.subFormEntries.length; i++) {
            if (this.subFormEntries[i].key === wantedSubForm) {
                for (var j = 0; j < this.subFormEntries.length; j++) {
                    if (this.subFormEntries[j].key == this.subFormEntries[i].site)
                        this.selectedIndex = j;
                }
            }
        }
    };
    UserApplicationComponent.prototype.showMissingInput = function () {
        var _this = this;
        if (this.main_lmu_ua_form) {
            var _loop_5 = function (subForm) {
                if (this_5.main_lmu_ua_form.controls[subForm].invalid) {
                    //console.log("subform: ",this.main_lmu_ua_form.controls[subForm]);
                    this_5.select_subFormTab(subForm.toString());
                    setTimeout(function () {
                        for (var subFormControl in _this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls']) {
                            var currControl = _this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls'][subFormControl];
                            //if (this.main_lmu_ua_form.controls[subForm]['controls'][0]['controls'][subFormControl].invalid)
                            /*
                            if (0)//(currControl['invalid'])
                            {
                                console.log(subFormControl, ": ", currControl);
    
                                //hjgjj: ElementRef;
                                //ViewChild('fhgfj') hjgjj;
                                //console.log(this.viewChildren);
    
                                //this._elementRef.nativeElement(subFormControl).focus();
                                //navtiveElement.querySelector(subFormControl).focus();
    
    
                                var el1 = this._elementRef.nativeElement.querySelector('rt-input#rtInput_'+subFormControl);
                                console.log(el1);
    
                                //setTimeout(() => {
                                //var el = this._elementRef.nativeElement.querySelector('input#'+subFormControl);
    
                                let el;
    
                                //this._elementRef.nativeElement.querySelector('rt-input#'+subFormControl).focus();
                                if (el = this._elementRef.nativeElement.querySelector('input#'+subFormControl))
                                {
                                    console.log("input-element=",el);
                                    el.focus();
                                }
                                else if (el = this._elementRef.nativeElement.querySelector('textarea#'+subFormControl))
                                {
                                    console.log("textarea-element=",el);
                                    el.focus();
                                }
                                else if (el = this._elementRef.nativeElement.querySelector('select#'+subFormControl))
                                {
                                    console.log("select-element=",el);
                                    el.focus();
                                }
                                else if (el = this._elementRef.nativeElement.querySelector('p-calendar#'+subFormControl))
                                {
                                    console.log("p-calender-element=",el);
                                    el.focus();
                                }
                                else if(el = this._elementRef.nativeElement.querySelector('div.invalidInfo'))
                                {
                                    console.log("invalidInfo=",el);
                                    el.scrollIntoView('center');
                                }
    
    
                                //},1000);
    
                            }
    
    
                            if (0)//(currControl['invalid'])
                            {
                                var el1 = this._elementRef.nativeElement.querySelector('rt-input#'+subFormControl);
                                console.log(el1);
    
                                let element = document.getElementById(subFormControl); //.focus(), .scrollTo();
                                console.log("element=",element);
                                //element.getTar();
                                //this.content.scrollTo(0, element.offsetTop, 500);
                            }
                            */
                            if (currControl['invalid']) {
                                //let element = document.getElementsByTagName('md-card'); //.focus(), .scrollTo();
                                //console.log("element=",element);
                                var el = void 0;
                                if (el = _this._elementRef.nativeElement.querySelector('div.invalidInfo')) {
                                    //console.log("invalidInfo=", el);
                                    el.scrollIntoView(false); //{block:'start',inline:'smooth'});
                                    window.scrollBy(0, 240);
                                    //console.log("window=",window);
                                    break;
                                }
                            }
                        }
                    }, 10);
                    return "break";
                }
            };
            var this_5 = this;
            for (var subForm in this.main_lmu_ua_form.controls) {
                var state_1 = _loop_5(subForm);
                if (state_1 === "break")
                    break;
            }
        }
    };
    UserApplicationComponent.prototype.submitForm = function () {
        //this.saveFormObj();
        //console.log("this.summaryPage_href =",this.summaryPage_href );
    };
    //LmuUserApdComponent.get
    //---------------------- dbg
    UserApplicationComponent.prototype.showDbg = function () {
        console.log("In user-application ngAfterViewInit2, after get data!", this.main_lmu_ua_form);
        /*//console.log("this.main_lmu_ua_form=",this.main_lmu_ua_form);
        let currUsers = JSON.parse(localStorage.getItem('users'));
        console.log("In showDbg, localStorage.getItem('users')=",currUsers);

        let currUserObj = JSON.parse(localStorage.getItem('currentUser'));
        console.log("In showDbg, localStorage.getItem('currUserObj')=",currUserObj);


        //this._authService.auth_getFormObject();
        let currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));
        console.log("In showDbg, localStorage.getItem('currentUaObject')=",currUaObj);

        //currUaObj = JSON.parse(localStorage.getItem('currentUaObject'));
        */
    };
    return UserApplicationComponent;
}());
UserApplicationComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'my-userApplication',
        //template:html,
        //styles:[css]
        templateUrl: 'mainForm.component.html',
        styleUrls: ['mainForm.component.css'],
    }),
    __metadata("design:paramtypes", [rt_authentication_service_1.AuthenticationService,
        core_1.ElementRef,
        rt_forms_service_1.RtFormService,
        configFile_1.ServerConfigs,
        lmu_ua_formList_1.lmu_ua_formList,
        dialogs_services_1.DialogsService])
], UserApplicationComponent);
exports.UserApplicationComponent = UserApplicationComponent;
//# sourceMappingURL=user-application.component.js.map