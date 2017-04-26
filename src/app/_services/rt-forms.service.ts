import {Validators, FormGroup, FormControl,FormBuilder } from '@angular/forms';
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import {formList} from '../_models/formConfigurator';


export class cFormObject {
    constructor(
        public formgroup : FormGroup,
        public formEntries:any[]
        //public isRequired:boolean
     ){}
}

export class cFormInfo {
    title: string;
    key: string;
    site: string;
    formGroup: FormGroup;
    formEntries?: [any];
    childrenFormsArray?:[any];
}

export class cWholeFormObject {
    mainForm:cFormInfo;
    subForms:[cFormInfo]
}

//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_subFormUpdate = false;
const dbgPrint_lifecyclehooks = false;
const dbgPrint_buildFormObject = false;
const dbgPrint_handle4local = false;
const dbgPrint_handle4server = false;


//----------------------------------------------------------------------------------------------------------------------

@Injectable()
export class RtFormService {


    private wFO:cWholeFormObject;             //wholeFormObject

    constructor(private _fb:FormBuilder)
    {
        this.wFO = JSON.parse(JSON.stringify(formList));

        //init subform update events
        for (let i=0;i<this.wFO.subForms.length;i++)
        {
            this.configSubforms4UpdateEvent(this.wFO.subForms[i].key);

        }

        this.build_wholeFormGroup();

        if (dbgPrint_lifecyclehooks) console.log("In RtFormService constructor,this.wholeFormObject= ",this.wFO);
    }

    //----------------------------------------handle data 4 local ------------------------------------------------------

    private _handleFormEntry4GridBox(formEntry:any,givenValue:any) {

        var newValue = {
            average:"",
            table:[]
        };


        if ( (givenValue !== null)
            && (givenValue.table !== undefined) && (givenValue.average !== undefined) )
        {

            newValue.average = givenValue.average;

            if (dbgPrint_handle4local) console.log("givenValue=", givenValue);
            //if (givenValue.table)

            for (let rIdx = 0; rIdx < givenValue.table.length; rIdx++) {

                for (let p in givenValue.table[rIdx]) //cellParameter (id) i.e. course, ects, grade in givenValue
                {

                    if (dbgPrint_handle4local) console.log("found cell-info ", p," in givenValue.table for ", givenValue.table[rIdx]);

                    for (let cIdx = 0; cIdx < formEntry.options.gridCells.length; cIdx++)
                    {
                        if (dbgPrint_handle4local) console.log("found cell-info in fromEntry-Definition for ",formEntry.options.gridCells[cIdx]['id'], "=",formEntry.options.gridCells[cIdx])

                        if (p === formEntry.options.gridCells[cIdx]['id'])  //cellinformation i.e. course, ects, grade in formEntry
                        {
                            let tableRowIsNOTSetAlready  = false;

                            if (newValue.table[rIdx] == undefined)
                            {
                                tableRowIsNOTSetAlready  = true;
                                newValue.table[rIdx] = {};
                            }
                            else if (newValue.table[rIdx][cIdx] == undefined) tableRowIsNOTSetAlready   = true; //check validation (has params?) of given table-row

                            if (tableRowIsNOTSetAlready == true)
                            {
                                newValue.table[rIdx][p] = JSON.parse(JSON.stringify(formEntry.options.gridCells[cIdx]));
                                newValue.table[rIdx][p]['value'] = JSON.parse(JSON.stringify(givenValue.table[rIdx][p]));

                                if (dbgPrint_handle4local) console.log("givenValue.table[", rIdx, "][", p, "]=", givenValue.table[rIdx][p]);
                            }


                        }
                    }
                }
            }

        }

        if (dbgPrint_handle4local)  console.log("newValue=",newValue);

        return newValue;

    }

    private _set_formEntryValue4Local(key:string,value:any) {

        //TODO: make this more general , i.e. this._handleFormEntry4GridBox to this.handleSpecialEntries

        for (let i=0;i<this.wFO.subForms.length;i++) {

            for (let y=0;y<this.wFO.subForms[i].formEntries.length;y++) {

                if (key.toString() === this.wFO.subForms[i].formEntries[y]['key']) {

                    //type: 'grid-box-add'
                    if (this.wFO.subForms[i].formEntries[y].type === 'grid-box-add') {
                        let newValue = this._handleFormEntry4GridBox(this.wFO.subForms[i].formEntries[y], value);
                        if (newValue) value = newValue;

                    }
                    this.wFO.subForms[i].formEntries[y]['defaultValue'] = value;
                    return;
                }
            }

            if (this.wFO.subForms[i].childrenFormsArray) {

                for (let z = 0; z < this.wFO.subForms[i].childrenFormsArray.length; z++) {

                    for (let y = 0; y < this.wFO.subForms[i].childrenFormsArray[z].formEntries.length; y++) {

                        if (key.toString() === this.wFO.subForms[i].childrenFormsArray[z].formEntries[y]['key']) {

                            //type: 'grid-box-add'
                            if (this.wFO.subForms[i].formEntries[y].type === 'grid-box-add') {
                                let newValue = this._handleFormEntry4GridBox(this.wFO.subForms[i].childrenFormsArray[z].formEntries[y], value);
                                if (newValue) value = newValue;

                            }
                            this.wFO.subForms[i].childrenFormsArray[z].formEntries[y]['defaultValue'] = value;
                            return;
                        }
                    }

                }
            }

        }

        if (dbgPrint_handle4local) console.log("FormEntry: ",key," NOT FOUND !!!!!");
    }

    public handleServerFormObject4localWorking(formObjFromServer:any) {

        if (dbgPrint_handle4local) console.log("In auth_handleFormObject4localWorking formObjFromServer=",formObjFromServer);

        //check if formObject is valid
        if ((typeof formObjFromServer === 'object') && (Object.keys(formObjFromServer).length !== 0))
        {

            if (dbgPrint_handle4local)  console.log("formObjFromServer",formObjFromServer);

            for (var p in formObjFromServer)
            {
                //console.log("p=",p);
                this._set_formEntryValue4Local(p,formObjFromServer[p]);
            }

        }
        else
        {
            console.log("formObjFromServer is empty!!!!");
        }

        //init class with given values and return
        //this.wFO.mainForm.formGroup = this.toFormGroup4SubForms(this.wFO.subForms);
        return this.wFO.mainForm.formGroup;
    };

    //------------------------------------ handle data 4 server --------------------------------------------------------


    private _conversionsAndChecks4Obj2Server(o:any,p:any) {

        //console.log("o[",p,"] = ",o[p]);

        var retStruct={
            delete:false,
            send:true,
            value: null
        }


        let newObj = JSON.parse(JSON.stringify(o[p])); //o[p];  we have to deep copy that object, because other components need the localUaObj still


        if (dbgPrint_handle4server) console.log("newObj = ",newObj);

        if (newObj !== null )
        {
            //delete all empty fields (set to null on server)
            if ( (typeof newObj === 'string') || (Object.prototype.toString.call(newObj) === '[object Array]') )
            {
                if (( newObj.length === 0) ) {
                    retStruct.delete = true;
                    if (dbgPrint_handle4server)  console.log("In check for delete , newObj = ", newObj);
                }
            }

            else if (typeof newObj === 'object')
            {
                if ((Object.keys(newObj).length === 0))
                {
                    retStruct.delete = true;
                    if (dbgPrint_handle4server)  console.log("In check for delete 2, newObj = ", newObj);
                }

                for (let p2 in newObj)
                {
                    if (newObj[p2] instanceof Array)
                    {
                        //handle grid-box-add elements
                        if (p2 === 'table')                                  //we got parameter table (array) here (for i.e. grid-bix-add)
                        {
                            //handle invalid or deleted grid-box elements
                            if (newObj[p2].length === 0) retStruct.send = false;

                            for (let i = 0; i < newObj[p2].length; i++)            //we got table-rows content (array index) here
                            {
                                let newListObj = {};
                                for (let p3 in newObj[p2][i]) {
                                    if (typeof newObj[p2][i][p3] === 'object')      //we got table-cell per row content (p3) here (i.e. course, ects, grade), but we exclude the complete flag of each table
                                    {
                                        newListObj[p3] = newObj[p2][i][p3].value;
                                    }
                                }
                                //console.log("newListObj=",newListObj);
                                newObj[p2][i] = newListObj;
                            }
                        }
                    }

                    //handle INVALID file-upload elements
                    if ( (p2 === 'filename') )//&& (newObj[p2] instanceof String) )              //we got parameter 'data' () here (for i.e. file-upload)
                    {
                        if (newObj[p2] === null) {
                            retStruct.delete = true;
                            retStruct.value = newObj;
                            console.log("newObj =", newObj);
                        }
                        else if ( (newObj['download'] !== undefined) )//&& (newObj[p2] instanceof String) )              //we got parameter 'data' () here (for i.e. file-upload)
                        {
                            retStruct.send = false;
                        }
                    }
                }
            }
        }

        if (retStruct.delete == false) retStruct.value = newObj;//JSON.parse(JSON.stringify(newObj));

        return retStruct;
    }

    public handleFormObject2SendToServer(uaObjLocal:any) {

        //if (dbgPrint_handleFormObject2SendToServer) console.log("In auth_handleFormObject4localWorking uaObjLocal=",uaObjLocal);

        let tmpUaObj2Server = {};

        //check if formObject is valid
        if (typeof uaObjLocal !== 'object')
        {
            console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal is undefined!!!!");
        }
        else if (Object.keys(uaObjLocal).length === 0)
        {
            console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal is empty!!!!");
        }
        else
        {
            if (dbgPrint_handle4server) console.log("In handleFormObject2SendToServer uaObjLocal",uaObjLocal);

            for ( let subFormKey in uaObjLocal) {

                for (let controlKey in uaObjLocal[subFormKey]) {
                    let sendStruct = this._conversionsAndChecks4Obj2Server(uaObjLocal[subFormKey], controlKey);
                    if (sendStruct.send) tmpUaObj2Server[controlKey] = sendStruct.value;
                }
            }

            /*
            if (uaObjLocal.subFormGroup_apd != undefined)
            {
                for (let p in uaObjLocal.subFormGroup_apd)
                {
                    let sendStruct = this._conversionsAndChecks4Obj2Server(uaObjLocal.subFormGroup_apd,p);
                    if (sendStruct.send) tmpUaObj2Server[p] = sendStruct.value;
                }
            }
            //else console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal.subFormGroup_apd[0] == undefined !!!!");

            if (uaObjLocal.subFormGroup_ac != undefined)
            {
                for (let p in uaObjLocal.subFormGroup_ac)
                {
                    let sendStruct= this._conversionsAndChecks4Obj2Server(uaObjLocal.subFormGroup_ac,p);
                    if (sendStruct.send) tmpUaObj2Server[p] = sendStruct.value;
                }
            }
            //else console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal.subFormGroup_ac[0] == undefined !!!!");

            if (uaObjLocal.subFormGroup_ac2 != undefined)
            {


                for (let p in uaObjLocal.subFormGroup_ac2)
                {
                    let sendStruct= this._conversionsAndChecks4Obj2Server(uaObjLocal.subFormGroup_ac2,p);
                    if (sendStruct.send) tmpUaObj2Server[p] = sendStruct.value;

                }
            }
            //else console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal.subFormGroup_ac2[0] == undefined !!!!");


            if (uaObjLocal.subFormGroup_oi != undefined)
            {

                for (let p in uaObjLocal.subFormGroup_oi)
                {
                    let sendStruct= this._conversionsAndChecks4Obj2Server(uaObjLocal.subFormGroup_oi,p);
                    if (sendStruct.send) tmpUaObj2Server[p] = sendStruct.value;
                }
            }
            //else console.log("ERROR in auth_handleFormObject4SendToServer, uaObjLocal.subFormGroup_oi[0] == undefined !!!!");
            */
        }

        if (dbgPrint_handle4server) console.log("tmpUaObj2Server=",tmpUaObj2Server);
        return tmpUaObj2Server;
    };

    //------------------------------------------------------------------------------------------------------------------

    public updateFormData()
    {

    }


    //------------------------------------------------------------------------------------------------------------------


    /*
    private build_subFormGroups() {

        for (let i=0;i<this.wFO.subForms.length;i++)
        {
            //let subFormGroup :FormGroup;

            this.wFO.subForms[i].formGroup =  this.toFormGroup(this.wFO.subForms[i].formEntries);

            if (dbgPrint_buildFormObject) console.log("In buildFormObject_apd,subFormGroup[",i,"]=",this.wFO.subForms[i].formGroup);
        }
    }
    */

    private build_wholeFormGroup(){

        for (let i=0;i<this.wFO.subForms.length;i++)
        {
            //let subFormGroup :FormGroup;

            this.wFO.subForms[i].formGroup =  this.toFormGroup(this.wFO.subForms[i].formEntries);
            if (this.wFO.subForms[i].childrenFormsArray)
            {
                for (let y = 0;y<this.wFO.subForms[i].childrenFormsArray.length;y++)
                {
                    this.wFO.subForms[i].childrenFormsArray[y].formGroup =  this.toFormGroup(this.wFO.subForms[i].childrenFormsArray[y].formEntries);
                }
            }

            if (dbgPrint_buildFormObject) console.log("In buildFormObject_apd,subFormGroup[",i,"]=",this.wFO.subForms[i].formGroup);

        }

        this.wFO.mainForm.formGroup = this.toFormGroup4SubForms(this.wFO.subForms);
    }


    public get_formInfos():cWholeFormObject {
        this.build_wholeFormGroup();            //after update
        return this.wFO;
    }


    //---------------- subForm - services - for load data and view initialization --------------------------------------



    private subForms_Updated_Array = {};
    private subFormsAreUpdated_Src = new Subject<boolean>();

    private configSubforms4UpdateEvent(subformKey:string) {
        this.subForms_Updated_Array[subformKey] = false;

        //if (dbgPrint_subFormUpdate) console.log("this.subForms_Updated_Array=",this.subForms_Updated_Array);
    }

    //TODO: update-subForms-data as own service ??
    public setSubform_updated(subformKey:string) {
        this.subForms_Updated_Array[subformKey] = true;

        if (dbgPrint_subFormUpdate) console.log("this.subForms_Updated_Array=",this.subForms_Updated_Array);

        this.checkAllSubformsUpdated();
    }

    public subFormsAreUpdated$ = this.subFormsAreUpdated_Src.asObservable();

    private set_subFormsAreUpdated(bVal : boolean) {
        this.subFormsAreUpdated_Src.next(bVal);
        if (dbgPrint_subFormUpdate) console.log("In rtFormService subFormWasUpdated");
    }

    private checkAllSubformsUpdated() {
        let allUpdated = true;

        //if ( this.subForm_APD_Updated &&  this.subForm_PE_Updated &&  this.subForm_OI_Updated ) this.set_subFormsAreUpdated(true);
        for (let subFormUpdateKey in this.subForms_Updated_Array)
        {

            if (dbgPrint_subFormUpdate) console.log("In checkAllSubformsUpdated ,  this.subForms_Updated_Array[",subFormUpdateKey,"]=", this.subForms_Updated_Array[subFormUpdateKey] );

            if ( this.subForms_Updated_Array[subFormUpdateKey] == false) {
                allUpdated = false;
                break;
            }
        }

        if (allUpdated == true) this.set_subFormsAreUpdated(true);

    }

    //------------------------------------------------------------------------------------------------------------------

    public formEntries_changed_ObjList = {};

    public reset_formEntries_changed_ObjList() {
        this.formEntries_changed_ObjList = [];
    };

    public get_formEntries_changed_ObjList() {
        return this.formEntries_changed_ObjList;
    };

    //------------------------------------------------------------------------------------------------------------------

    //----------------------------------------------------------------

    rtValidators = new rtFormValidators;

    /*buildFormObject(form:FormGroup,entries:any):cFormObject {
        return new cFormObject(form,entries);
    }
    */

    // Get function from string for Validator-Function. With or without scopes (by Nicolas Gauthier)
    private getFunctionCallFromString = function(stringArray) {
        if (stringArray == undefined) return null;
        if (!Array.isArray(stringArray)) return null;
        if (stringArray.length == 0 ) return null;

        var found_require = false;
        var found_minLength = 0;

        var validatorArray = [];

       for (var i = 0;i<stringArray.length;i++)
       {
           if (stringArray[i].indexOf('required')!=-1)
           {
               found_require = true;
               validatorArray.push(Validators.required);
               //break;
           }
           else if (stringArray[i].indexOf('minLength')!=-1)
           {
               var splitString = stringArray[i].split('=');
               found_minLength = splitString[splitString.length-1];
               //console.log("found_minLength =",found_minLength );
               validatorArray.push(Validators.minLength(found_minLength));
           }
           else if (stringArray[i].indexOf('maxLength')!=-1)
           {
               var splitString = stringArray[i].split('=');
               let found_maxLength = splitString[splitString.length-1];0
               //console.log("found_maxLength =",found_maxLength );
               validatorArray.push(Validators.minLength(found_maxLength));
           }
           else if (stringArray[i].indexOf('length')!=-1)
           {
               var splitString = stringArray[i].split('=');
               let found_Length = splitString[splitString.length-1];
               //console.log("found_Length =",found_Length );
               validatorArray.push(Validators.minLength(found_Length));
               validatorArray.push(Validators.maxLength(found_Length));
           }
           else if (stringArray[i].indexOf('validateFileUpload')!=-1)
           {
               validatorArray.push(this.rtValidators.validateFileUpload);
           }
           else if (stringArray[i].indexOf('validateCourseList')!=-1)
           {
               validatorArray.push(this.rtValidators.validateCourseList);
           }
           else if (stringArray[i].indexOf('validateEmail')!=-1)
           {
               validatorArray.push(this.rtValidators.validateEmail);
           }
           else if (stringArray[i].indexOf('validateNumberNotZero')!=-1)
           {
               validatorArray.push(this.rtValidators.validateNumberNotZero);
           }


       }

           //console.log("validatorArray=",validatorArray);

        return Validators.compose(validatorArray);
    }

    private toFormGroup(entries: any) {

        //console.log("entries=",entries);

        let group: any = {};

        entries.forEach(entry => {
                //console.log("entry=", entry);
                //Validators.compose([Validators.required,Validators.minLength(3)])
                let defaultValue = null;
                if (entry.defaultValue !== undefined) defaultValue = entry.defaultValue;
                group[entry.key] = new FormControl(defaultValue, this.getFunctionCallFromString(entry.validators) );

        });

        return new FormGroup(group);

    }

    private toFormGroup4SubForms(subForms: any) {

        //console.log("entries=",entries);

        let group: any = {};

        subForms.forEach(sForm => {

            group[sForm.key] = sForm.formGroup;//this._fb.group(sForm.formGroup);

            if (sForm.childrenFormsArray)
            {
                for (let y = 0;y<sForm.childrenFormsArray.length;y++)
                {
                    group[sForm.childrenFormsArray[y].key]  =  sForm.childrenFormsArray[y].formGroup;
                }
            }

        });

        return new FormGroup(group);

    }



}
