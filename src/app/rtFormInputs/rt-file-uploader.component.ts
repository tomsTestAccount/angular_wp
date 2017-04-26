import { NgUploaderOptions, UploadedFile, UploadRejected } from 'ngx-uploader';

import { Component,OnInit,AfterViewInit,EventEmitter,Input,Output ,NgZone,Inject} from '@angular/core';

import {FormControl,FormGroup} from '@angular/forms';

import {AuthenticationService} from '../_services/rt-authentication.service'

const dbgPrint = false;

//import { ViewContainerRef } from '@angular/core';

//var html = require('./rt-file-uploader.component.html!text');
//var css = require('./rtFormInputs.css!text');

@Component({
    //moduleId: module.id,
    selector: 'rt-file-uploader',
    templateUrl: 'rt-file-uploader.component.html',
    styleUrls: ['rtForm.css']
    //template:html,
    //styles:[css]

})

export class rtFileUploaderComponent implements AfterViewInit,OnInit
//export class rtFileUploaderComponent
{


    title : string = 'title string missing';
    secParagraph : string = 'secParagrap string missing';
    secParagraphArray : string[] = new Array();

    compId : string;

    options: NgUploaderOptions;

    showTooltip1 = false;

    fU_progress: number = 0;
    fU_response: any = {};

    hasBaseDropZoneOver: boolean = false;
    startUploadEvent: EventEmitter<string>;
    previewData: any;

    bIsDDavailable: boolean;

    localFileArray:any[];

    //--------------------------------------------


    currentForm:FormGroup;
    @Input() set formgroup(givenForm: FormGroup){

        //if (dbgPrint) console.log("givenForm=",givenForm);
        this.currentForm = <FormGroup>givenForm;
        //if (dbgPrint)  console.log("In rtFileUploaderComponent this.currentForm=",this.currentForm);

    };

    currentFormEntry:any;
    @Input() set formEntry(formEntry:any){

        this.currentFormEntry = formEntry;
        if (dbgPrint)  console.log("In rtFileUploaderComponent this.currentFormEntry=",this.currentFormEntry);
    };


    fileUpload_url:string;
    currentToken:string;
    authSrv:AuthenticationService;
    //srvCfgs:any;
    //----------------------------------------------------

    //constructor(compId:string,t:string,secP:string,fCN:string) {
    constructor( //srvCfg:ServerConfigs,
                authSrvInst:AuthenticationService,
                @Inject(NgZone) private zone: NgZone) {

        this.zone = new NgZone({ enableLongStackTrace: false });


        //this.srvCfgs = srvCfg;

        this.authSrv = authSrvInst;

        this.currentToken = authSrvInst.auth_getCurrentToken();

        this.startUploadEvent = new EventEmitter<string>();

        this.bIsDDavailable = false;

        //this.isDragDropAvailable();

        this.localFileArray = new Array();


    }



    //---------------------------------------------------


    ngAfterViewInit(): void {

    };



    ngOnInit():void{


        this.title = this.currentFormEntry.title;
        this.secParagraphArray =  this.currentFormEntry.secParagraphArray;
        this.compId = this.currentFormEntry.key;

        //this.fileUpload_url = this.srvCfgs.get_serverConfigs().url + '/applications/' + this.srvCfgs.get_serverConfigs().userId + '/' + this.srvCfgs.get_serverConfigs().userId + '/' + this.currentFormEntry.key;
        this.fileUpload_url = ""; //"not neccessary here, because of fileUpload via stringStream in formObject";

        this.options = new NgUploaderOptions({
            url : this.fileUpload_url,
            autoUpload: false,
            filterExtensions: true,
            allowedExtensions: this.currentFormEntry.options.allowedExtensions,//['application/pdf'],
            calculateSpeed: true,
            data:{
                '@type': "File",
                "title": "My file 666",
                "file": {
                    "data": "TG9yZW0gSXBzdW0u",
                    "encoding": "base64",
                    "filename": "test666.txt",
                    "content-type": "application/pdf"}
               },
            //fieldName: 'file',
            //fieldReset: true,
            maxUploads: 1,
            method: 'POST',
            //multipart:false,
            //previewUrl: 'preview',
            customHeaders: {
                'Authorization': 'Bearer ' + this.currentToken,
                //'Content-Type':'application/json',
                'Accept':'application/json'
            },
            //plainJson: true,
            withCredentials: false,
            cors:false
        });


        //if (dbgPrint) console.log("fileUpload_url= ",this.fileUpload_url);


        if (this.currentFormEntry.defaultValue)
        {
            if (this.currentFormEntry.defaultValue.filename) {
                if (dbgPrint) console.log("this.currentFormEntry.defaultValue= ", this.currentFormEntry.defaultValue);
                this.localFileArray[0] = this.currentFormEntry.defaultValue;
                (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(this.localFileArray[0]);
                if (dbgPrint) console.log(">this.currentForm.controls[this.currentFormEntry.key]= ", this.currentForm.controls[this.currentFormEntry.key]);
            }
        }

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

    beforeUpload(ev : Event) {

        if (dbgPrint) console.log("In beforeUpload, e=", ev);


        var file: File =  ev.target['files'][0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            let tmpB64String = myReader.result.split(',');
            if (dbgPrint) console.log("tmpB64String.length",tmpB64String.length);
            this.options['data']['file']['data'] = tmpB64String[1] ;
            this.options['data']['file']['filename'] = file.name;
            this.options['data']['title'] = file.name;


            if (dbgPrint) console.log("file encoded");

            if (this.localFileArray.length) this.deleteFile(this.localFileArray[0]);

            this.localFileArray[0] =  this.options['data'].file;
            (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(this.localFileArray[0]);

            //we send data via formContent (for plone) though no extra file-upload here
                //this.startUploadEvent.emit("startUpload");

        }
        myReader.readAsDataURL(file);

    }

    handleUpload(data): void {

            this.zone.run(() => {

                if (dbgPrint) console.log("In handleUpload, data=", data);

                this.hasBaseDropZoneOver = null;

                this.fU_response = data;

                this.fU_progress = Math.floor(data.progress.percent / 100);

                if (data && data.response) {

                    //this.localFileArray.push(data);
                    //if (dbgPrint) console.log("localFileArray=", this.localFileArray);
                    let respObj = JSON.parse(data.response);

                    //if (respObj.file.size) respObj.file['size'] = respObj.file.size.toString();

                    if (dbgPrint) console.log("respObj.file=", respObj.file);

                    //if (dbgPrint) console.log("formgroup.controls[",this.currentFormEntry.key,"]=", this.currentForm.controls[this.currentFormEntry.key]);

                    // we only allowed one file in the list

                    if (this.localFileArray.length) this.deleteFile(this.localFileArray[0]);

                    this.localFileArray[0] = (respObj.file);
                    (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(this.localFileArray[0]);

                }
            });

    }

    handlePreviewData(data: any) {
        this.previewData = data;

        console.log("In handlePreviewData, this.previewData=", this.previewData);
    }


    fileOverBase(e:any):void {
        //console.log("In fileOverBase, e=", e);
        this.hasBaseDropZoneOver = e;

    }


    deleteFile(file:any):void {

        if (dbgPrint) console.log("In defleteFile, file =",file);

        let index = this.localFileArray.indexOf(file);
        if (index > -1) {
            this.localFileArray.splice(index, 1);

            var delObj = {
                //"content-type": "application/octet-stream",
                "download": file['download'],
                "filename": null,
                "size": 0
            };

            //var delObj2 = {};  //TODO: ask Max, because set formObject-value = null from type 'file' isn't accepted by plone-server at the moment ??

            (<FormControl>this.currentForm.controls[this.currentFormEntry.key]).patchValue(delObj);  //only one fileObject used at the moment

        }

        if (dbgPrint) console.log("formgroup.controls[",this.currentFormEntry.key,"]=", this.currentForm.controls[this.currentFormEntry.key]);


    }


    downloadFile_envDev(fileObj:any)
    {
        this.authSrv.auth_downloadFile_devEnv(fileObj);
    }

    //------------------- debug ---------------------------------------------


}
