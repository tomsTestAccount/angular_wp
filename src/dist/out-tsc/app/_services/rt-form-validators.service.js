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
//import 'rxjs/add/operator/toPromise';
var rtFormValidators = (function () {
    function rtFormValidators() {
    }
    rtFormValidators.prototype.validateArray = function (c) {
        var retValue = { notValid: true };
        if (c != null) {
            retValue = (c.value.length == 0) ? { notValid: true } : null;
            console.log("In validateArray, c=", c, ', c.value.length=', c.value.length);
        }
        console.log("Idsafsd c=", c, ', c.value.length=', c.value.length);
        return retValue;
    };
    rtFormValidators.prototype.validateCourseList = function (c) {
        var retValue = { notValid: true };
        if (c.value['avrValue'] != null) {
            retValue = isNaN(c.value['avrValue']) ? { notValid: true } : null;
        }
        console.log("In validateCourseList, c=", c, ', retValue=', retValue);
        return retValue;
    };
    rtFormValidators.prototype.validatePasswordConfirm = function (cConfirm) {
        var retValue = { equal: false };
        if (cConfirm != null) {
            //console.log("c=",c);
            var cPwd = cConfirm.root.get('password');
            if (cPwd != null) {
                //retValue = (cPwd.value === cCPwd.value) ? null : {equal: false} ;
                if (cPwd.value === cConfirm.value) {
                    console.log("cPwd=", cPwd.value);
                    console.log("cCPwd=", cConfirm.value);
                    retValue = null;
                }
            }
        }
        return retValue;
    };
    return rtFormValidators;
}());
rtFormValidators = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], rtFormValidators);
exports.rtFormValidators = rtFormValidators;
//# sourceMappingURL=rt-form-validators.service.js.map