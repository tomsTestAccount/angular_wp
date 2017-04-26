import {Component,Injectable} from '@angular/core';
import { CountryList} from '../_models/countries';
import { RtFormService ,cFormObject} from '../_services/rt-forms.service';
import {FormGroup, FormArray, FormBuilder,Validators} from "@angular/forms";
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import {constSrvUrl} from './configFile';

//----------------------------------------------------------------------------------------------------------------------

const dbgPrint_lifecyclehooks = true;
const dbgPrint = false;
const dbgPrint_handle4local = false;
const dbgPrint_handle4server = false;

//----------------------------------------------------------------------------------------------------------------------


var fileUploadUrl="";

var formEntries_apd = [
        {
            key: 'lastname',
            title: 'Surname / Family Name *',
            type: 'text',
            validators: ['required','minLength=5'],
            //required:  true
        },
        {
            key: 'firstname',
            title: 'First Name(s) / Given Name(s) *',
            type: 'text',
            validators: ['required','minLength=3'],
            //required:  true
        },
        {
            key: 'gender',
            title: 'Gender *',
            type: 'select',
            validators: ['required','minLength=3'],
            options: [
                {
                    name: 'male'
                },
                {
                    name: 'female'
                }
            ],
            //required:  true
        },{

            key: 'dateofbirth',
            title: 'Date of Birth *',
            type: 'date',
            validators: ['required','minLength=8'],
            options: {
                dateFormat: "yy-mm-dd",
                dataType: "string",
                yearRange: "1965:1999",
                placeholder: "yyyy-mm-dd"
            },
            //required:  true
        },
        {

            key: 'nationality',
            title: 'Country of Nationality *',
            type: 'select',
            validators: ['required','minLength=3'],
            options: CountryList,
            //required:  true
        },
        {

            key: 'street',
            title: 'Street Name and House Number *',
            type: 'text',
            validators: ['required','minLength=3'],
            //required:  true
        },
        {

            key: 'postalcode',
            title: 'Postcode / ZIP Code *',
            type: 'text',
            validators: ['required','minLength=3'],
            //required:  true
        },
        {

            key: 'residence',
            title: 'Place of Residence  *',
            type: 'text',
            validators: ['required','minLength=3'],
            //required:  true
        },
        {

            key: 'country',
            title: 'Country of Residence *',
            type: 'select',
            validators: ['required','minLength=3'],
            options: CountryList,
            //required:  true
        },
        {

            key: 'phone',
            title: 'Phonenumber  *',
            type: 'number',
            validators: ['required','minLength=3'],
            //required:  true
        },
        {

            key: 'phone2',
            title: 'other Phonenumber  (optional)',
            type: 'number',
            validators: ['minLength=3'],
            //required:  false
        },
        {

            key: 'email',
            title: 'Email Address *',
            type: 'email',
            validators: ['required','validateEmail'],
            //required:  true
        },
        {

            key: 'email2',
            title: 'Other Email Address (optional)',
            type: 'email',
            validators: ['validateEmail'],
            //required:  false
        },
        {

            key: 'homepage',
            title: 'Homepage (optional)',
            type: 'text',
            validators: ['minLength=5'],
            //required:  false
        }
];

var formEntries_ac2 = [
    {

        key: 'ac_education2',
        title: 'Academic Education *',
        type: 'textarea',
        validators: ['minLength=3'],
        //required:  false
    },
    {

        key: 'ac_level2',
        title: 'Academic Level *',
        type: 'textarea',
        validators: ['minLength=3'],
        //required:  false
    },
    {

        key: 'ac_institution2',
        title: 'Academic Institution *',
        type: 'textarea',
        validators: ['minLength=3'],
        //required:  false
    },
    {

        key: 'degree_conferral_date2',
        title: 'Degree Conferral Date *',
        type: 'date',
        options: {
            dateFormat: "yy-mm-dd",
            dataType: "string",
            yearRange: "2001:2017",
            placeholder: "yyyy-mm-dd"
        },
        validators: ['minLength=8'],
        //required:  false
    },
    {

        key: 'copy_of_certificate2',
        title: 'Copy of Degree Certificate *',
        type: 'fileUpload',
        //validators: ['validateFileUpload'],  //TODO:   just a workaround here -> we have to wait for max for implementing to setting null to file-entries to plone-serialization
        options: {
            url: fileUploadUrl,// fileUploadURL,

            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        //required:  false
    }
];

var formEntries_ac = [
    {
        key: 'ac_education',
        title: 'Academic Education *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please enter your previous or your current study program:'],
        //required:  true
    },
    {
        key: 'ac_level',
        title: 'Academic Level *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please enter the name of the academic degree you already',
            'hold or you will receive once you have finished your current studies'],
        //required:  true
    },
    {
        key: 'ac_institution',
        title: 'Academic Institution *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please give the exact name, location and country of the \
                               academic institution where you have received or will \
                        receive your academic degree:'],
        //required:  true
    }, {

        key: 'degree_conferral_date',
        title: 'Degree Conferral Date *',
        type: 'date',
        validators: ['required','minLength=8'],
        options: {
            dateFormat: "yy-mm-dd",
            dataType: "string",
            yearRange: "2001:2017",
            placeholder: "yyyy-mm-dd"
        },
        secParagraphArray: ['Please indicate the date (year-month-day) in which you \
                        received or expect to receive the degree mentioned above:'],
        //required:  true
    },
    /*
    {

        ignored4Server:true, //will not be used for formObject send to server --> only to enable/disable ''copy_of_certificate'-validation  //TODO: create an more general mechanism (formarray/formgroup,etc..)
        key: 'copy_of_certificate_availableCheckbox',
        title: '',
        type: 'checkbox',
        //validators: ['required'],
        //required:  false
    },
    */
    {

        key: 'copy_of_certificate',
        title: 'Copy of Degree Certificate (e.g. Bachelor) *',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        secParagraphArray: ['Please upload a PDF copy of your degree certificate'],
        options: {
            url: fileUploadUrl,//fileUploadURL,

            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        collapsible_box_title:'Copy of Degree Certificate (e.g. Bachelor) already available ?',
        collapsible_info_text:"Please uncheck this box if you are unable to provide your degree certificate (e.g. bachelor's)  \
                                by the application deadline because it will be issued by your academic institution only after the deadline",
        //required:  true

    },
    {
        key: 'copy_of_tor',
        title: 'Transcript of Records or Other Proof of Grades *',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        secParagraphArray: ['Please upload your Transcript of Records (or other proof of grades) in PDF format. \
                        The transcript must include at least 30 ECTS in Computational Methods \
                        and 30 ECTS in Data-Based Modelling (see below)'],
        options: {
            url: fileUploadUrl,// fileUploadURL,

            allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
            calculateSpeed: true,
        },
        ////required:  true
    },
    {
        key: 'av_grade1',
        title: 'Average Grade of the Best Performance = AvGr1 *',
        type: 'number',
        validators: ['required','validateNumberNotZero'],
        secParagraphArray: [`Please calculate the average grade from the best performance (equivalent to 150 ECTS) and enter this in the field below.`,
            `Note: Applicants whose Transcript of Records does not include ECTS: A 6-semester study program equals a workload of 180 ECTS.`,
            `Divide this workload between the different courses you took during your study program and upload your calculation at the end of this online application in the field Other documents`],
        //required:  true
    },
    {
        key: 'av_grade2',
        title: 'Computational Methods = AvGr2 *',
        validators: ['required','validateCourseList'],
        secParagraphArray: ['Please enter the courses you attended in Computational Methods', '(this includes, for example, informatics, database-orientated methods, computational statistics, optimisation)'],
        type: 'grid-box-add',
        averageId:'average', //need for iteration in component.ts, has to be distinct for that entry //TODO: not using at the moment. average-objectmember in rest-object and component is named "average"
        showAverage: true,
        options: {
            whatToAdd: 'Course', // string for the element to add
            allCols: 7,   // realAllCols - allCols = reservedCols e.g.  9-7 = 2; 2 cols are reserved for the add-button, see the number of cols of the gridCells below
            rowHeight: '42px',
            gridCells: [
                {
                rows: 1,
                cols: 3,
                title: 'Course Name',
                //secParagraph: 'E.g.: Database Systems',
                id: 'course', //need for iteration in component.ts, has to be distinct for that entry
                type: 'text',
                placeHolder: 'E.g.: Database Systems'

                },
                {
                    rows: 1,
                    cols: 2,
                    title: 'ECTS',
                    //secParagraph:  'E.g.: 6 or 4.5',
                    id: 'ects', //need for iteration in component.ts, has to be distinct for that entry
                    type: 'number',
                    placeHolder: 'E.g.: 6 or 4.5'
                },
                {
                    rows: 1,
                    cols: 2,
                    title: 'Grade',
                    //secParagraph:  'E.g.: 1.5',
                    id: 'grade', //need for iteration in component.ts, has to be distinct for that entry
                    type: 'number',
                    placeHolder: 'E.g.: 1.5'
                }],
        },
        //required:  true
    },
    {
        key: 'av_grade3',
        title: 'Data-Based Modelling = AvGr 3 *',
        secParagraphArray: ['Please enter the courses you attended in Data-Based Modelling', ' (this includes, for example, statistics, data mining, probability theory, machine learning)'],
        type: 'grid-box-add',
        validators: ['required','validateCourseList'],
        averageId:'average', //need for iteration in component.ts, has to be distinct for that entry
        showAverage: true,
        options: {
            whatToAdd: 'Course', // string for the element to add
            allCols: 7,   //9-7 = 2; 2 cols are reserved for the add-button, see the number of cols of the gridCells below
            rowHeight: '42px',
            gridCells: [{
                rows: 1,
                cols: 3,
                title: 'Course Name',
                //secParagraph: 'E.g.: Database Systems',
                id: 'course', //need for iteration in component.ts, has to be distinct for that entry
                type: 'text',
                placeHolder: 'E.g.: Database Systems'

            },
                {
                    rows: 1,
                    cols: 2,
                    title: 'ECTS',
                    //secParagraph:  'E.g.: 6 or 4.5',
                    id: 'ects', //need for iteration in component.ts, has to be distinct for that entry
                    type: 'number',
                    placeHolder: 'E.g.: 6 or 4.5'
                },
                {
                    rows: 1,
                    cols: 2,
                    title: 'Grade',
                    //secParagraph:  'E.g.: 1.5',
                    id: 'grade', //need for iteration in component.ts, has to be distinct for that entry
                    type: 'number',
                    placeHolder: 'E.g.: 1.5'
                }],
        },
        //required:  true
    },

    {
        key: 'src_bachelor',
        title: "Institution at which Bachelor's Degree was Received *",
        type: 'select',
        validators: ['required'],
        options: [
            {
                name: 'LMU'
            },
            {
                name: 'other University'
            },
            {
                name: 'University of Applied Sciences'
            },
            {
                name: 'Other kind of Institution'
            }
        ],
        //required:  true
    },
    {
        key: 'lang_cert',
        title: 'Proof of English Language Proficiency *',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        options: {
            url: fileUploadUrl,// fileUploadURL,

            allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
            calculateSpeed: true,
        },
        //required:  true
    }
];

var formEntries_oi = [
    {

        key: 'essay',
        title: 'Essay "Data Science * ',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        secParagraphArray: ['Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.',
            'The essay musst not exceed 1,000 words'],
        options: {
            url: fileUploadUrl,// fileUploadURL,

            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        //required:  true
    },
    {
        key: 'further_certificates',
        title: 'Other documents *',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        secParagraphArray: ['Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc.,', ' as well as your ECTS calculation document within a single PDF file.'],
        options: {
            url: fileUploadUrl,// fileUploadURL,

            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        //required:  true
    },
    {
        key: 'other_info',
        title: 'Any other information ',
        validators: ['minLength=5'],
        type: 'textarea',
        //required:  false
    },
    {
        key: 'spec_interview_prov',
        title: 'Special provisions for the interview needed? (e.g. because of disability): ',
        validators: ['minLength=5'],
        type: 'textarea',
        //required:  false
    },
    {
        key: 'notification_emailed',
        title: ' I want to receive email notifications ',
        infoText: 'You will be notified of the outcome of the aptitude assessment procedure by email. If you wish to be notified by mail, please select this field.',
        type: 'checkBox',
        //validators: ['validateEmail'],
        //required:  false
    }

];


//----------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------


//TODO: todo rename class and file ( it isn't a list anymore. it's a class with init- and mapping-functions, a.s.o
@Injectable()
export class lmu_ua_formList {

    countryList:any;

    //formSrv = new RtFormService();

    formSrv : RtFormService;

    rtValidators = new rtFormValidators;

    apd_formObj : cFormObject ;
    ac_formObj : cFormObject ;
    ac2_formObj : cFormObject ;// = this.buildFormObject_ac2();
    oi_formObj : cFormObject;  //= this.buildFormObject_oi();

    // we will initialize our main-lmu-ua-form here
    main_lmu_ua_form: FormGroup;

    private _fb:FormBuilder;

    srvCfg = constSrvUrl;

    constructor(private _formSrv:RtFormService) {

        this.formSrv = _formSrv;

        this._fb = new FormBuilder();

        if (dbgPrint_lifecyclehooks)  console.log("In lmu_ua_formList constructor");

        if (dbgPrint) console.log("In lmu_ua_formList 1,constSrvUrl=",constSrvUrl);

        this.countryList = CountryList;

        fileUploadUrl = constSrvUrl  + '/upload';


        this.formSrv.configSubforms4UpdateEvent('subFormGroup_apd');
        this.formSrv.configSubforms4UpdateEvent('subFormGroup_ac');
        this.formSrv.configSubforms4UpdateEvent('subFormGroup_oi');


        this.init_mainForm();

    }


    update_subFormData(){
        this.apd_formObj = this.buildFormObject_apd();
        this.ac_formObj  = this.buildFormObject_ac();
        this.ac2_formObj  = this.buildFormObject_ac2();
        this.oi_formObj = this.buildFormObject_oi();
    }

    init_mainForm():FormGroup{

        this.update_subFormData();

        // we will initialize our main-lmu-ua-form here
        this.main_lmu_ua_form = this._fb.group({

            //TODO: define required validator-values (if necessary) for each subform in form-definition-list
            /*
            subFormGroup_apd: this._fb.group([this.apd_formObj.formgroup]), //,Validators.required]),
            subFormGroup_ac: this._fb.group([this.ac_formObj.formgroup]),
            subFormGroup_oi: this._fb.group([this.oi_formObj.formgroup]),
            subFormGroup_ac2: this._fb.group([this.ac2_formObj.formgroup])
            */

            subFormGroup_apd: this.apd_formObj.formgroup, //,Validators.required]),
            subFormGroup_ac: this.ac_formObj.formgroup,
            subFormGroup_oi: this.oi_formObj.formgroup,
            subFormGroup_ac2: this.ac2_formObj.formgroup

        });

        if (dbgPrint) console.log("In init_mainForm, this._fb=",this._fb);

        return this.main_lmu_ua_form;
    }

    get_mainForm():FormGroup {

        if (dbgPrint) console.log("In get_mainForm");
        return this.main_lmu_ua_form;
    }

    get_formInfos():any{


        this.update_subFormData();

        return {
            mainForm : this.main_lmu_ua_form,
            subForms : [
                {
                    title: " Applicant\'s Personal Details",
                    key: "subFormGroup_apd",
                    site: 'subFormGroup_apd',
                    formObj: this.apd_formObj
                },
                {
                    title: "Previous Education",
                    key: "subFormGroup_ac",
                    site: "subFormGroup_ac",
                    formObj: this.ac_formObj,
                    childrenFormsArray:[
                        {
                            title: "Other Previous Education (optional)",
                            key: "subFormGroup_ac2",
                            formObj: this.ac2_formObj,
                            site: "subFormGroup_ac",		//in which site is that form visible (parent), //has to be equal to a subForm key-value
                            noneOwnTab: true				//indicates that this is a only-childView of an existing subForm-tab ( kind of sub-sub-form)
                        }
                    ]
                },
                /*
                {
                    title: "Other Previous Education (optional)",
                    key: "subFormGroup_ac2",
                    formObj: this.ac2_formObj,
                    site: "subFormGroup_ac",		//in which site is that visible (parent), //has to be equal to a subForm key-value
                    noneOwnTab: true,				//indicates that this is a only-childView of an existing subForm-tab ( kind of sub-sub-form)
                },
                */
                {
                    title: "Essay and other information",
                    key: "subFormGroup_oi",
                    site: "subFormGroup_oi",
                    formObj: this.oi_formObj
                }
            ]
        };
    }

    //--------------------------------------------------------------------------------------------------

    buildFormObject_apd():cFormObject {

         let formGroup =  this.formSrv.toFormGroup(this.get_formEntries_apd());

         if (dbgPrint) console.log("In buildFormObject_apd,this.get_formEntries_apd=",formEntries_apd);

         return new cFormObject(formGroup,this.get_formEntries_apd());
     }

    buildFormObject_ac():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_formEntries_ac());


        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_formEntries_ac());
    }

    buildFormObject_ac2():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_formEntries_ac2());


        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_formEntries_ac2());
    }

    buildFormObject_oi():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_formEntries_oi());

        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_formEntries_oi());
    }

    //---------------------------------------------------------------------------------------------------

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

        //TODO: make this more general , i.e. this._handleFormEntry4GridBox to this.handleSpecialEntries --> see i.e. ac2 handleFileUploads, too

        for (var i=0; i<formEntries_apd.length;i++)
        {
            //console.log("Search for ",v);
            if (key.toString() === formEntries_apd[i]['key'])
            {
                //type: 'grid-box-add'
                if (formEntries_apd[i].type === 'grid-box-add')
                {
                    let newValue = this._handleFormEntry4GridBox(formEntries_apd[i],value);
                    if (newValue) value=newValue;

                }
                formEntries_apd[i]['defaultValue']=value;
                return;
            }
        }
        for (var i=0; i<formEntries_ac.length;i++)
        {

            if (key.toString() === formEntries_ac[i]['key'])
            {

                if (formEntries_ac[i].type === 'grid-box-add')
                {
                    formEntries_ac[i]['defaultValue'] =  this._handleFormEntry4GridBox(formEntries_ac[i],value);
                }
                /*else if (formEntries_ac[i].type === 'fileUpload')
                {
                    if (value)
                    {
                        if (value.filename == null)
                        {
                            value = null;
                        }
                    }

                    formEntries_ac[i]['defaultValue'] = value;
                }
                */
                else formEntries_ac[i]['defaultValue'] = value;
                return;
            }
        }
        for (var i=0; i<formEntries_oi.length;i++)
        {

            if (key.toString() === formEntries_oi[i]['key'])
            {

                formEntries_oi[i]['defaultValue']=value;
                return;
            }
        }
        for (var i=0; i<formEntries_ac2.length;i++)
        {
            //console.log("Search for ",v);
            if (key.toString() === formEntries_ac2[i]['key'])
            {

                if (formEntries_ac2[i].type === 'grid-box-add')
                {
                    value =  this._handleFormEntry4GridBox(formEntries_ac2[i],value);

                }
                else if (formEntries_ac2[i].type === 'fileUpload')
                {
                    if (value)
                    {
                        if (value.filename == null)
                        {
                            value = null;
                        }
                    }
                }


                formEntries_ac2[i]['defaultValue']=value;
                //if (dbgPrint_handle4local) console.log("Set Default-Value for ",formEntries_ac2[i].key, " = ",value);

                return;
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
        return this.init_mainForm();
    };

    // ----------------------------- handle Objects 4 sending to server-----------------------------------------------------------------------


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
            if (dbgPrint_handle4server) console.log("In auth_handleFormObject4localWorking uaObjLocal",uaObjLocal);

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

        }

        if (dbgPrint_handle4server) console.log("tmpUaObj2Server=",tmpUaObj2Server);
        return tmpUaObj2Server;
    };


    // ----------------------------------------------------------------------------------------------------

    get_formEntries_apd() {

    return formEntries_apd ;

    }

    get_formEntries_ac() {

    return formEntries_ac;

    }

    get_formEntries_oi() {
    return formEntries_oi;

    }

    get_formEntries_ac2() {
    return formEntries_ac2;

    }

}
