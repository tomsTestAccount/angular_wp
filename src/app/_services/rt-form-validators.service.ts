import { Injectable } from '@angular/core';

import {FormControl, Validators, AbstractControl,FormGroup}  from '@angular/forms';


const dbgPrint_Validation = false;

@Injectable()
export class rtFormValidators {

    constructor() { }


    validateArray(c: FormControl) {

        let retValue = null; //= {notValid: true};
        if (c != null) {

            retValue = (c.value.length == 0) ? {notValid: true} : null;

            //console.log("In validateArray, c=",c, ', c.value.length=', c.value.length);
        }

        if (dbgPrint_Validation) console.log("Idsafsd c=",c, ', c.value.length=', c.value.length);

        return retValue

    }

    validateFileUpload(c: FormControl) {

        let retValue = null; // {notValid: true};

        //TODO:   just a workaround here -> we have to wait for max for implementing to setting null to file-entries to plone-serialization

        if (c.value != null) {

            if ((c.value.size !== 'undefined') && (c.value.size <= 10))
            {
                retValue = {notValid: {File: 'was not added'}};
                //console.log("In validateFileUpload c=",c, ', c.value=', c.value);
            }
            //if (dbgPrint_Validation) console.log("In validateArray, c=",c, ',c.value[0].filename =', c.value.filename);
        }


        //if (dbgPrint_Validation)  console.log("In validateFileUpload c=",c, ', c.value=', c.value);


        return retValue

    }

    validateCourseList(c: FormControl) {

        let retValue = null; //{notValid: true};
        if ( (!c.value) || (!c.value['table']) || (c.value['table'].length == 0))
        {
            retValue = {notValid:{Course: 'was not added'}};
        }
        else if ( (c.value['average'] != null) && (c.value['table'].length != 0) ) {

            let numValue = parseFloat(c.value['average']);
            //retValue = (isNaN(numValue) || (numValue<=0)) ? {notValid: true} : null;

            if (isNaN(numValue)) retValue = {notValid:{input: 'is not a number'}};
            else if (numValue<=0) retValue = {notValid:{input: 'is less than/equals zero '}};
            else retValue = null;
            //console.log("In validateCourseList, c=",c, ', retValue=', retValue);
        }

        if (dbgPrint_Validation) console.log("In validateCourseList, c=",c, ', retValue=', retValue);

        return retValue

    }

    validateEmail(c: FormControl)  {

        let retValue = null;

        let required = c.parent; //validator;

        if ( (c.value != null) && (c.value != '') ) {

            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            //console.log(" re.test(c.value)=", re.test(c.value));
            retValue = re.test(c.value) ? null : {notValid:{email: ' wrong email address notation'}} ;
        }



        if (dbgPrint_Validation) console.log("In validateEmail, c=",c, ', retValue=', retValue, required);

        return retValue

    }

    validateNumberNotZero(c: FormControl) {

        let retValue = null; //= {notValid: true};
        if ( (c.value != null)  ) {

            let numValue = parseFloat(c.value);
            if (isNaN(numValue)) retValue = {notValid:{input: 'is not a number'}};
            else if (numValue<=0) retValue = {notValid:{input: 'is less than/equals zero '}};
            else retValue = null;


            //console.log("In validateCourseList, c=",c, ', retValue=', retValue);
        }

        if (dbgPrint_Validation) console.log("In validateNumberNotZero, c=",c, ', retValue=', retValue);

        return retValue

    }

    validatePasswordConfirm(cConfirm: FormControl) {
        let retValue = {equal: false};

        if (cConfirm != null) {

            //console.log("c=",c);

            let cPwd = cConfirm.root.get('password');

            if (cPwd != null)
            {
                //retValue = (cPwd.value === cCPwd.value) ? null : {equal: false} ;

                if (cPwd.value === cConfirm.value)
                {
                    console.log("cPwd=",cPwd.value);
                    console.log("cCPwd=",cConfirm.value);

                    retValue = null;

                }
            }

        }
        return retValue;
    }

    validateGroup_CheckboxEnabled(group: FormGroup) {
        /*
        const range = group.controls[0].find(r => r.id === Number(group.value.range));
        if(range && (group.value.specificValue < range.min || group.value.specificValue > range.max)) {
            return {
                outsideRange: true
            };
        }
        */
    };


/*

 private userDataUrl = 'app/userData';

    constructor(private http: Http) { }


    getUserModels(): Promise<UserModel[]> {
        //return Promise.resolve(HEROES);
        return this.http.get(this.userDataUrl)
            .toPromise()
            .then(response => response.json().data as UserModel[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    //slow connection mock
    getUserModelSlowly(): Promise<UserModel[]> {
        return new Promise<UserModel>(resolve =>
            setTimeout(resolve, 2000)) // delay 2 seconds
            .then(() => this.getUserModels());
    }

    getUserModel(uid : number): Promise<UserModel> {
        return this.getUserModels().then(models => models.find(model => model.uid === uid));
    }


    private headers = new Headers({'Content-Type': 'application/json'});

    update(model: UserModel): Promise<UserModel> {
        const url = `${this.userDataUrl}/${model.uid}`;
        return this.http.put(url, JSON.stringify(model), {headers: this.headers})
            .toPromise()
            .then(() => model)
            .catch(this.handleError);
    }

    /*
     create(name: string, power:string,state: string): Promise<UserModel> {
     return this.http
     .post(this.heroesUrl, JSON.stringify({name: name, power: power, state: state}), {headers: this.headers})
     .toPromise()
     .then(res => res.json().data)
     .catch(this.handleError);
     }
     */

/*
    delete(uid: number): Promise<void> {
        const url = `${this.userDataUrl}/${uid}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    */

}
