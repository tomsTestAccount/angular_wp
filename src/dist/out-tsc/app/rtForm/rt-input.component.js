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
//import { lmu_formBase }     from './question-base';
//var html = require('./rt-input.component.html!text');
//var css = require('./rtForm.css!text');
var rtInputComponent = (function () {
    function rtInputComponent() {
        //console.log("formEntry=",this.formEntry);
        // console.log("formgroup=",this.formgroup);
        //formgroup: FormGroup;
        //@Input() form: FormBuilder ;
        //get isValid() { return this.form.controls[this.question.key].valid; }
        this.showTooltip = false;
        this.dateValue = new Date("01-08-2016");
    }
    rtInputComponent.prototype.ngOnInit = function () {
        this.valObj = this.formgroup.controls[this.formEntry.key].value;
        if (Object.prototype.toString.call(this.valObj) === '[object Array]') {
            this.tmpArray = this.formgroup.controls[this.formEntry.key].value;
        }
        this.dateValue = new Date("01-08-2016");
        if (this.formEntry.key == "dateOfBirth") {
            console.log("this.formgroup.controls[dateOfBirth] =", this.formgroup.controls[this.formEntry.key].value);
            this.dateValue = new Date(this.formgroup.controls["dateOfBirth"].value);
        }
    };
    rtInputComponent.prototype.onChangeDate = function (e, controlName) {
        //this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
        //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
        console.log(this.formgroup[controlName]);
        console.log("e=", e);
        //console.log("this.peForm=",this.peForm);
    };
    rtInputComponent.prototype.toggleInfo = function (e) {
        this.showTooltip = !this.showTooltip;
        e.stopPropagation();
    };
    return rtInputComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], rtInputComponent.prototype, "formEntry", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", forms_1.FormGroup)
], rtInputComponent.prototype, "formgroup", void 0);
rtInputComponent = __decorate([
    core_1.Component({
        //moduleId: module.id,
        selector: 'rt-input',
        //template:html,
        //styleUrls: ['../css/rtForm.css']
        //styles:[css]
        templateUrl: 'rt-input.component.html',
    }),
    __metadata("design:paramtypes", [])
], rtInputComponent);
exports.rtInputComponent = rtInputComponent;
//# sourceMappingURL=rt-input.component.js.map