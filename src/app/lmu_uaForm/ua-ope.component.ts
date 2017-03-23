import { Component,OnInit,HostListener,Input ,NgZone,ElementRef,} from '@angular/core';

import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';

import {rtFormValidators}  from '../_services/rt-form-validators.service';

//import { CountryList} from '../app/_models/countries';



//@import 'app/candy-carousel/candy-carousel-theme.scss';

//for animations
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/core';


//import { ViewContainerRef } from '@angular/core';

//var html = require('./ua-ope.component.html!text');

@Component({
    //moduleId: module.id,
    selector: 'lmu_user_ope',
    templateUrl: 'ua-ope.component.html',
    //template:html
    //styleUrls: ['lmu-ua-styles.css'],
    //providers: [CountryList]

})


export class LmuUserOpeComponent implements OnInit{

    opeForm : FormGroup;

    //countries : any;

    usermodel : any;


    /***************file upload *****************************
     * TODO: build directive-component for that, because at the moment code is redundant
     *
     * */

        //uploadFile: any;

    zone: NgZone;

    //--------------------------------------------

    /*showTooltip1 = false;
    fU_progress_ope: number = 0;
    fU_response_ope: any = {};

    hasBaseDropZoneOver_ope: boolean = false;
    options_degreeUpload_ope: Object;
    uploadedData_Degree_ope : any[];

    */

    //--------------------------------------------------------
    rtValidators = new rtFormValidators;
    formEntries:Object[];


        //----------------------------------------------------

    dbgIsOpen : boolean;


    //----------------------------------------------------

    constructor(private fb: FormBuilder) {

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


    ngOnInit(): void {
        this.buildForm();
       // this.isDragDropAvailable();
    }

    buildForm(): void {

        this.opeForm = this.fb.group({
            'acadEdu_ope': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'acadLvl_ope': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'acadInst_ope': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'degreeConferralDate_ope': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            'copyOfDegreeCert_ope': [[], Validators.compose([Validators.required, this.rtValidators.validateArray])],

        });

        //this.apdForm.valueChanges.subscribe(data => this.onFormValueChanged(data));
        this.opeForm.statusChanges.subscribe(data => this.onFormStatusChanged(data));

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
        ]
    }

    onFormStatusChanged(data)
    {
        var tmpStatus = false;

        if( data === 'VALID')
        {
            console.log("onFormStatusChanged",data);
            tmpStatus = true;
        }

        this.usermodel = this.opeForm;

        //this.onFormEvent_pe.emit(tmpStatus);

    }


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
    get diagnostic(){ return JSON.stringify(this.usermodel); }


    toggleDbg() : void{
        this.dbgIsOpen = !this.dbgIsOpen;
        console.log("this.dbgIsOpen=",this.dbgIsOpen);
        console.log("opeForm=",this.opeForm);
    }


    onChange(e:any):void{
        //this.opeForm.controls.copyOfDegreeCert_ope._onChange(e);
        //(<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']).patchValue(e.value);
        console.log((<FormControl>this.opeForm.controls['copyOfDegreeCert_ope']));
        console.log("e=",e);
    }
}
