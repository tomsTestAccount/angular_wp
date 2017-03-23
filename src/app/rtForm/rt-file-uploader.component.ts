import { Ng2UploaderModule } from 'ng2-uploader/ng2-uploader';

import { Component,OnInit,EventEmitter,Input,Output ,NgZone,ElementRef} from '@angular/core';

import {FormControl,FormGroup} from '@angular/forms';

//import {Validators, FormGroup,FormControl,FormBuilder} from '@angular/forms';


import {ServerConfigs} from '../_models/configFile';

const dbgPrint = false;

//import { ViewContainerRef } from '@angular/core';

//var html = require('./rt-file-uploader.component.html!text');
//var css = require('./rtForm.css!text');

@Component({
    //moduleId: module.id,
    selector: 'rt-file-uploader',
    templateUrl: 'rt-file-uploader.component.html',
    styleUrls: ['rtForm.css']
    //template:html,
    //styles:[css]

})

export class rtFileUploaderComponent implements OnInit
{


    /*
    @Input() title : string = 'title string missing';
    @Input() secParagraph : string = 'secParagrap string missing';
    @Input() secParagraphArray : string[] = new Array();

    @Input() compId : string;
    */

    title : string = 'title string missing';
    secParagraph : string = 'secParagrap string missing';
    secParagraphArray : string[] = new Array();

    compId : string;

    options: Object = {};

    //@Output() uploadedDataRes : any = new Array();  //TODO: load via restApi (Mock first)
    //@Output('change') uploadedDataChanged = new EventEmitter();


    uploadedData : any = new Array();

    @Output() uploadedDataChanged = new EventEmitter();

    zone: NgZone;

    showTooltip1 = false;

    fU_progress: number = 0;
    fU_response: any = {};

    hasBaseDropZoneOver: boolean = false;

    bIsDDavailable: boolean;

    //sectionName:string;
/*
    @Input() uploadedDataArray:any[];

    @Input() required: boolean;
    @Input() formCtrlName : string = 'formCtrlName string missing';
*/
    uploadedDataArray:any[];

    //--------------------------------------------

    //@Input() formEntry:any;
    //@Input() formgroup:any;


    currentForm:FormGroup;
    @Input() set formgroup(givenForm: FormGroup){

        //if (dbgPrint) console.log("givenForm=",givenForm);
        this.currentForm = <FormGroup>givenForm;
        if (dbgPrint)  console.log("In rtFileUploaderComponent this.currentForm=",this.currentForm);

    };

    currentFormEntry:any;
    @Input() set formEntry(formEntry:any){

        this.currentFormEntry = formEntry;
        if (dbgPrint)  console.log("In rtFileUploaderComponent this.currentFormEntry=",this.currentFormEntry);
    };




    //----------------------------------------------------

    //constructor(compId:string,t:string,secP:string,fCN:string) {
    constructor(srvCfg:ServerConfigs) {

        this.zone = new NgZone({ enableLongStackTrace: false });

        /*
        if (this.uploadedData.length == 0) {
            this.uploadedData = new Array();
        }
        */

        //var fileUpload_url = 'http://' + ServerConfigs.fileUploadServer_ip + ':' + ServerConfigs.fileUploadServer_port + '/upload';

        var fileUpload_url = srvCfg.get_serverConfigs().url  + '/upload';


        if (dbgPrint) console.log("fileUpload_url= ",fileUpload_url);

        if (dbgPrint) console.log("this.options= ",this.options);


        if (this.options === {} ) {
            this.options = {
                url : fileUpload_url,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],  ////TODO: give the url via parameter (input?)
                calculateSpeed: true,
            };
        }

        this.bIsDDavailable = false;

        //this.uploadedDataArray = new Array();

    }



    //---------------------------------------------------


    ngOnInit(): void {
        this.isDragDropAvailable();

        this.uploadedDataArray = this.currentForm.controls[this.currentFormEntry.key].value || new Array();//= this.formCtrlGroup.controls[this.formEntry.key].value; //TODO: handle data from restAPI here
        this.title = this.currentFormEntry.title;
        this.secParagraphArray =  this.currentFormEntry.secParagraphArray;
        this.compId = this.currentFormEntry.key;
        this.options = this.currentFormEntry.options;

        //console.log("In rt-file-uploader , formEntry=",this.formEntry);
       // console.log("In rt-file-uploader , formgroup=",this.formgroup);
        //console.log("this.uploadedDataArray=",this.uploadedDataArray);
    }


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



    handleUpload(data): void {
            this.zone.run(() => {

                this.hasBaseDropZoneOver = null;

                this.fU_response = data;

                this.fU_progress = Math.floor(data.progress.percent / 100);

                if (data && data.response) {
                    //this.uploadedData.push(data);

                    this.uploadedDataArray.push(data);
                    //console.log("uploaded file=", data);
                    //console.log("uploadedDataArray=", this.uploadedDataArray);
                    if (dbgPrint) console.log("formgroup.controls[",this.currentFormEntry.key,"]=", this.currentForm.controls[this.currentFormEntry.key]);

                    //(<FormControl>this.formCtrlGroup.controls[this.formCtrlName]).patchValue(this.uploadedDataArray);
                    (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(this.uploadedDataArray);
                }
            });

    }

    fileOverBase(e:any):void {
        this.hasBaseDropZoneOver = e;
    }


    deleteFile(file:any):void
    {
        let index = this.uploadedDataArray.indexOf(file);
        if (index > -1) {
            this.uploadedDataArray.splice(index, 1);
            //this.uploadChanged(this.uploadedData);
        }

        (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(this.uploadedDataArray);

        if (dbgPrint) console.log("formgroup.controls[",this.currentFormEntry.key,"]=", this.currentForm.controls[this.currentFormEntry.key]);
        /*
        if (this.uploadedDataArray.length == 0) {
            console.log("uploadarray is empty! reset fromcontrol");
            //(<FormControl>this.formCtrlGroup.controls[this.formCtrlName]).reset();
            (<FormControl>this.formCtrlGroup.controls[this.formEntry.key]).reset();
        }
        else  console.log("uploadarray =",this.uploadedDataArray);
        */

    }

    uploadChanged(list:any) : void {
        if (dbgPrint)  console.log("In uploadChanged, list=",list)
        this.uploadedDataChanged.emit({
            value: this.uploadedData
        })
    }

    //------------------- debug ---------------------------------------------


}
