
import {Component,Injectable} from '@angular/core';

import { CountryList} from '../_models/countries';

import { RtFormService ,cFormObject} from '../_services/rt-forms.service';
import {FormGroup, FormArray, FormBuilder,Validators} from "@angular/forms";
import {rtFormValidators}  from '../_services/rt-form-validators.service';
import {constSrvUrl} from './configFile';


var fileUploadUrl="";

//--------------------------------------------------------------------------------

var formEntries_apd = [
    {
        key: 'lastname',
        title: 'Surname / Family Name *',
        type: 'text',
        validators: ['required','minLength=5'],
        required: true
    },
    {
        key: 'firstname',
        title: 'First Name(s) / Given Name(s) *',
        type: 'text',
        validators: ['required','minLength=3'],
        required: true
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
        required: true
    }, {

        key: 'dateofbirth',
        title: 'Date of Birth *',
        type: 'date',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'nationality',
        title: 'Country of Nationality *',
        type: 'select',
        validators: ['required','minLength=3'],
        options: CountryList,
        required: true
    },
    {

        key: 'street',
        title: 'Street Name and House Number *',
        type: 'text',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'postalcode',
        title: 'Postcode / ZIP Code *',
        type: 'text',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'residence',
        title: 'Place of Residence  *',
        type: 'text',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'country',
        title: 'Country of Residence *',
        type: 'select',
        validators: ['required','minLength=3'],
        options: CountryList,
        required: true
    },
    {

        key: 'phone',
        title: 'Phonenumber  *',
        type: 'number',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'phone2',
        title: 'other Phonenumber  (optional)',
        type: 'number',
        validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'email',
        title: 'Email Address *',
        type: 'email',
        validators: ['required','minLength=3'],
        required: true
    },
    {

        key: 'email2',
        title: 'Other Email Address (optional)',
        type: 'email',
        //validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'homepage',
        title: 'Homepage (optional)',
        type: 'text',
        //validators: ['required','minLength=3'],
        required: false
    }
];

var formEntries_ac = [
    {
        key: 'ac_education',
        title: 'Academic Education *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please enter your previous or your current study program:'],
        required: true
    },
    {
        key: 'ac_level',
        title: 'Academic Level *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please enter the name of the academic degree you already',
            'hold or you will receive once you have finished your current studies'],
        required: true
    },
    {
        key: 'ac_institution',
        title: 'Academic Institution *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        secParagraphArray: ['Please give the exact name, location and country of the \
                               academic institution where you have received or will \
                        receive your academic degree:'],
        required: true
    }, {

        key: 'degree_conferral_date',
        title: 'Degree Conferral Date *',
        type: 'date',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        secParagraphArray: ['Please indicate the date (day/month/year) in which you \
                        received or expect to receive the degree mentioned above:'],
        required: true
    },
    {
        //will not be used by rtForms mechanism --> Todo : create subForm method here for copy_of_certificate above
        key: 'degreeCertAvailable',
        title: '',
        type: 'checkbox',
        required: true
    },
    {

        key: 'copy_of_certificate',
        title: 'Copy of Degree Certificate (e.g. Bachelor) *',
        type: 'fileUpload',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        secParagraphArray: ['Please upload a PDF copy of your degree certificate'],
        options: {
            url: fileUploadUrl,//fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        required: true
    },
    {
        key: 'copy_of_tor',
        title: 'Transcript of Records or Other Proof of Grades *',
        type: 'fileUpload',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        secParagraphArray: ['Please upload your Transcript of Records (or other proof of grades) in PDF format. \
                        The transcript must include at least 30 ECTS in Computational Methods \
                        and 30 ECTS in Data-Based Modelling (see below)'],
        options: {
            url: fileUploadUrl,// fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
            calculateSpeed: true,
        },
        required: true
    },
    {
        key: 'av_grade1',
        title: 'Average Grade of the Best Performance = AvGr1 *',
        type: 'number',
        validators: ['required','minLength=3'],
        secParagraphArray: [`Please calculate the average grade from the best performance (equivalent to 150 ECTS) and enter this in the field below.`,
            `Note: Applicants whose Transcript of Records does not include ECTS: A 6-semester study program equals a workload of 180 ECTS.`,
            `Divide this workload between the different courses you took during your study program and upload your calculation at the end of this online application in the field Other documents`],
        required: true
    },
    {
        key: 'av_grade2',
        title: 'Computational Methods = AvGr2 *',
        validators: 'Validators.compose([Validators.required,this.rtValidators.validateCourseList])',
        secParagraphArray: ['Please enter the courses you attended in Computational Methods', '(this includes, for example, informatics, database-orientated methods, computational statistics, optimisation)'],
        type: 'grid-box-add',
        showAverage: true,
        options: {
            whatToAdd: 'Course', // string for the element to add
            allCols: 7,   // realAllCols - allCols = reservedCols e.g.  9-7 = 2; 2 cols are reserved for the add-button, see the number of cols of the gridCells below
            rowHeight: '42px',
            gridCells: [{
                rows: 1,
                cols: 3,
                title: 'Course Name',
                //secParagraph: 'E.g.: Database Systems',
                id: 'name', //need for iteration in component.ts, has to be distinct for that entry
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
        required: true
    },
    {
        key: 'av_grade3',
        title: 'Data-Based Modelling = AvGr 3 *',
        secParagraphArray: ['Please enter the courses you attended in Data-Based Modelling', ' (this includes, for example, statistics, data mining, probability theory, machine learning)'],
        type: 'grid-box-add',
        validators: 'Validators.compose([Validators.required,this.rtValidators.validateCourseList])',
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
                id: 'name', //need for iteration in component.ts, has to be distinct for that entry
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
        required: true
    },
    {
        key: 'src_bachelor',
        title: "Institution at which Bachelor's Degree was Received *",
        type: 'select',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
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
        required: true
    },
    {
        key: 'lang_cert',
        title: 'Proof of English Language Proficiency *',
        type: 'fileUpload',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        options: {
            url: fileUploadUrl,// fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
            calculateSpeed: true,
        },
        required: true
    }
];

var formEntries_oi = [
    {

        key: 'essay',
        title: 'Essay "Data Science * ',
        type: 'fileUpload',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        secParagraphArray: ['Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.',
            'The essay musst not exceed 1,000 words'],
        options: {
            url: fileUploadUrl,// fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        required: true
    },
    {
        key: 'further_certificates',
        title: 'Other documents *',
        type: 'fileUpload',
        validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
        secParagraphArray: ['Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc.,', ' as well as your ECTS calculation document within a single PDF file.'],
        options: {
            url: fileUploadUrl,// fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        required: true
    }
    ,
    {
        key: 'other_info',
        title: 'Any other information  *',
        validators: ['required','minLength=3'],
        type: 'textarea',
        required: true
    }
    ,
    {
        key: 'spec_interview_prov',
        title: 'Special provisions for the interview needed? (e.g. because of disability): *',
        validators: ['required','minLength=3'],
        type: 'textarea',
        required: true
    },
    {
        key: 'notification_emailed',
        title: ' I want to receive email notifications ',
        infoText: 'You will be notified of the outcome of the aptitude assessment procedure by email. If you wish to be notified by mail, please select this field.',
        type: 'checkBox',
        validators: ' Validators.compose([Validators.required])',
        required: false
    }

];

var formEntries_ac2 = [
    {

        key: 'ac_education2',
        title: 'Academic Education *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'ac_level2',
        title: 'Academic Level *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'ac_institution2',
        title: 'Academic Institution *',
        type: 'textarea',
        validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'degree_conferral_date2',
        title: 'Degree Conferral Date *',
        type: 'date',
        validators: ['required','minLength=3'],
        required: false
    },
    {

        key: 'copy_of_certificate2',
        title: 'Copy of Degree Certificate *',
        type: 'fileUpload',
        validators: 'Validators.compose([Validators.required, this.rtValidators.validateArray])',
        options: {
            url: fileUploadUrl,// fileUploadURL,
            filterExtensions: true,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        required: false
    }
];

//--------------------------------------------------------------------------------

const dbgPrint =true;

@Injectable()
export class lmu_ua_formList {

    countryList:any;

    formSrv = new RtFormService();

    rtValidators = new rtFormValidators;

    apd_formObj : cFormObject ;
    ac_formObj : cFormObject ;
    ac2_formObj : cFormObject ;// = this.buildFormObject_ac2();
    oi_formObj : cFormObject;  //= this.buildFormObject_oi();

    // we will initialize our main-lmu-ua-form here
    main_lmu_ua_form: FormGroup;

    private _fb:FormBuilder;

    srvCfg = constSrvUrl;

    constructor() {

        this._fb = new FormBuilder();

        if (dbgPrint) console.log("In lmu_ua_formList 1,constSrvUrl=",constSrvUrl);

        this.countryList = CountryList;

        fileUploadUrl = constSrvUrl  + '/upload';

        this.init_mainForm();

    }

    init_mainForm():FormGroup{


        this.apd_formObj = this.buildFormObject_apd();
        this.ac_formObj  = this.buildFormObject_ac();
        this.ac2_formObj  = this.buildFormObject_ac2();
        this.oi_formObj = this.buildFormObject_oi();




        // we will initialize our main-lmu-ua-form here
        this.main_lmu_ua_form = this._fb.group({
            /*apd_formArray: this._fb.group({'apd_form':
             [this.apd_formObj.formgroup,Validators.required]}
             ),
             */

            subFormGroup_apd: this._fb.group([this.apd_formObj.formgroup,Validators.required]),
            subFormGroup_ac: this._fb.group([this.ac_formObj.formgroup,Validators.required]),
            subFormGroup_oi: this._fb.group([this.oi_formObj.formgroup,Validators.required]),
            subFormGroup_ac2: this._fb.group([this.ac2_formObj.formgroup,Validators.required])

        });

        if (dbgPrint) console.log("In init_mainForm, this._fb=",this._fb);

        return this.main_lmu_ua_form;
    }

    get_mainForm():FormGroup
    {
        console.log("In get_mainForm");
        return this.main_lmu_ua_form;
    }

    //--------------------------------------------------------------------------------------------------

     buildFormObject_apd():cFormObject {

         let formGroup =  this.formSrv.toFormGroup(this.get_formEntries_apd());

         console.log("In buildFormObject_apd,this.get_formEntries_apd=",formEntries_apd);


         return new cFormObject(formGroup,this.get_formEntries_apd());
     }


    buildFormObject_ac():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_form_ac());


        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_form_ac());
    }

    buildFormObject_ac2():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_from_ac2());


        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_from_ac2());
    }

    buildFormObject_oi():cFormObject {

        let formGroup =  this.formSrv.toFormGroup(this.get_form_oi());

        //console.log("formGroup_ac=",formGroup);

        return new cFormObject(formGroup,this.get_form_oi());
    }



    //--------------------------------------------------------------------------

    set_formEntryValue(key:string,value:any)
    {
        for (var i=0; i<formEntries_apd.length;i++)
        {
            //console.log("Search for ",v);
            if (key.toString() === formEntries_apd[i]['key'])
            {

                formEntries_apd[i]['defaultValue']=value;
                return;
            }
        }
        for (var i=0; i<formEntries_ac.length;i++)
        {
            //console.log("Search for ",v);
            if (key.toString() === formEntries_ac[i]['key'])
            {

                formEntries_ac[i]['defaultValue']=value;
                return;
            }
        }
        for (var i=0; i<formEntries_oi.length;i++)
        {
            //console.log("Search for ",v);
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

                formEntries_ac2[i]['defaultValue']=value;
                return;
            }
        }

        console.log("FormEntry: ",key," NOT FOUND !!!!!");
    }


    // ----------------------------------------------------------------------

    get_formEntries_apd() {

    return formEntries_apd ;
        /*
    return [
        {
            key: 'lastname',
            title: 'Surname / Family Name *',
            type: 'text',
            validators: ['required','minLength=3'],
            required: true
        },
        {
            key: 'firstname',
            title: 'First Name(s) / Given Name(s) *',
            type: 'text',
            validators: ['required','minLength=3'],
            required: true
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
            required: true
        }, {

            key: 'dateOfbirth',
            title: 'Date of Birth *',
            type: 'date',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'nationality',
            title: 'Country of Nationality *',
            type: 'select',
            validators: ['required','minLength=3'],
            options: CountryList,
            required: true
        },
        {

            key: 'street',
            title: 'Street Name and House Number *',
            type: 'text',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'postalcode',
            title: 'Postcode / ZIP Code *',
            type: 'text',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'residence',
            title: 'Place of Residence  *',
            type: 'text',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'country',
            title: 'Country of Residence *',
            type: 'select',
            validators: ['required','minLength=3'],
            options: CountryList,
            required: true
        },
        {

            key: 'phone',
            title: 'Phonenumber  *',
            type: 'number',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'phone2',
            title: 'other Phonenumber  (optional)',
            type: 'number',
            validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'email',
            title: 'Email Address *',
            type: 'email',
            validators: ['required','minLength=3'],
            required: true
        },
        {

            key: 'email2',
            title: 'Other Email Address (optional)',
            type: 'email',
            //validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'homepage',
            title: 'Homepage (optional)',
            type: 'text',
            //validators: ['required','minLength=3'],
            required: false
        }
    ]
    */

    }

    get_form_ac() {

    return formEntries_ac;
        /*return [
        {
            key: 'ac_education',
            title: 'Academic Education *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            secParagraphArray: ['Please enter your previous or your current study program:'],
            required: true
        },
        {
            key: 'ac_level',
            title: 'Academic Level *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            secParagraphArray: ['Please enter the name of the academic degree you already',
                'hold or you will receive once you have finished your current studies'],
            required: true
        },
        {
            key: 'ac_institution',
            title: 'Academic Institution *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            secParagraphArray: ['Please give the exact name, location and country of the \
                               academic institution where you have received or will \
                        receive your academic degree:'],
            required: true
        }, {

            key: 'degree_conferral_date',
            title: 'Degree Conferral Date *',
            type: 'date',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            secParagraphArray: ['Please indicate the date (day/month/year) in which you \
                        received or expect to receive the degree mentioned above:'],
            required: true
        },
        {
            //will not be used by rtForms mechanism --> Todo : create subForm method here for copy_of_certificate above
            key: 'degreeCertAvailable',
            title: '',
            type: 'checkbox',
            required: true
        },
        {

            key: 'copy_of_certificate',
            title: 'Copy of Degree Certificate (e.g. Bachelor) *',
            type: 'fileUpload',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            secParagraphArray: ['Please upload a PDF copy of your degree certificate'],
            options: {
                url: fileUploadUrl,//fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],
                calculateSpeed: true,
            },
            required: true
        },
        {
            key: 'copy_of_tor',
            title: 'Transcript of Records or Other Proof of Grades *',
            type: 'fileUpload',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            secParagraphArray: ['Please upload your Transcript of Records (or other proof of grades) in PDF format. \
                        The transcript must include at least 30 ECTS in Computational Methods \
                        and 30 ECTS in Data-Based Modelling (see below)'],
            options: {
                url: fileUploadUrl,// fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
                calculateSpeed: true,
            },
            required: true
        },
        {
            key: 'av_grade1',
            title: 'Average Grade of the Best Performance = AvGr1 *',
            type: 'number',
            validators: ['required','minLength=3'],
            secParagraphArray: [`Please calculate the average grade from the best performance (equivalent to 150 ECTS) and enter this in the field below.`,
                `Note: Applicants whose Transcript of Records does not include ECTS: A 6-semester study program equals a workload of 180 ECTS.`,
                `Divide this workload between the different courses you took during your study program and upload your calculation at the end of this online application in the field Other documents`],
            required: true
        },
        {
            key: 'av_grade2',
            title: 'Computational Methods = AvGr2 *',
            validators: 'Validators.compose([Validators.required,this.rtValidators.validateCourseList])',
            secParagraphArray: ['Please enter the courses you attended in Computational Methods', '(this includes, for example, informatics, database-orientated methods, computational statistics, optimisation)'],
            type: 'grid-box-add',
            showAverage: true,
            options: {
                whatToAdd: 'Course', // string for the element to add
                allCols: 7,   // realAllCols - allCols = reservedCols e.g.  9-7 = 2; 2 cols are reserved for the add-button, see the number of cols of the gridCells below
                rowHeight: '42px',
                gridCells: [{
                    rows: 1,
                    cols: 3,
                    title: 'Course Name',
                    //secParagraph: 'E.g.: Database Systems',
                    id: 'name', //need for iteration in component.ts, has to be distinct for that entry
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
            required: true
        },
        {
            key: 'av_grade3',
            title: 'Data-Based Modelling = AvGr 3 *',
            secParagraphArray: ['Please enter the courses you attended in Data-Based Modelling', ' (this includes, for example, statistics, data mining, probability theory, machine learning)'],
            type: 'grid-box-add',
            validators: 'Validators.compose([Validators.required,this.rtValidators.validateCourseList])',
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
                    id: 'name', //need for iteration in component.ts, has to be distinct for that entry
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
            required: true
        },
        {
            key: 'src_bachelor',
            title: "Institution at which Bachelor's Degree was Received *",
            type: 'select',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
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
            required: true
        },
        {
            key: 'lang_cert',
            title: 'Proof of English Language Proficiency *',
            type: 'fileUpload',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            options: {
                url: fileUploadUrl,// fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
                calculateSpeed: true,
            },
            required: true
        }
    ]
    */
    }

    get_form_oi() {
    return formEntries_oi;
        /*return [
        {

            key: 'essay',
            title: 'Essay "Data Science * ',
            type: 'fileUpload',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            secParagraphArray: ['Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.',
                'The essay musst not exceed 1,000 words'],
            options: {
                url: fileUploadUrl,// fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],
                calculateSpeed: true,
            },
            required: true
        },
        {
            key: 'further_certificates',
            title: 'Other documents *',
            type: 'fileUpload',
            validators: ' Validators.compose([Validators.required,this.rtValidators.validateArray])',
            secParagraphArray: ['Please upload any other certificates regarding internships, vocational training, computer courses, past working experience, etc.,', ' as well as your ECTS calculation document within a single PDF file.'],
            options: {
                url: fileUploadUrl,// fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],
                calculateSpeed: true,
            },
            required: true
        }
        ,
        {
            key: 'other_info',
            title: 'Any other information  *',
            validators: ['required','minLength=3'],
            type: 'textarea',
            required: true
        }
        ,
        {
            key: 'spec_interview_prov',
            title: 'Special provisions for the interview needed? (e.g. because of disability): *',
            validators: ['required','minLength=3'],
            type: 'textarea',
            required: true
        },
        {
            key: 'notification_emailed',
            title: ' I want to receive email notifications ',
            infoText: 'You will be notified of the outcome of the aptitude assessment procedure by email. If you wish to be notified by mail, please select this field.',
            type: 'checkBox',
            validators: ' Validators.compose([Validators.required])',
            required: false
        }

    ]
    */
    }

    get_from_ac2() {
    return formEntries_ac2;
    /*return  [
        {

            key: 'acadEdu_ac2',
            title: 'Academic Education *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'acadLvl_ac2',
            title: 'Academic Level *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'acadInst_ac2',
            title: 'Academic Institution *',
            type: 'textarea',
            validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'degreeConferralDate_ac2',
            title: 'Degree Conferral Date *',
            type: 'date',
            validators: ['required','minLength=3'],
            required: false
        },
        {

            key: 'copyOfDegreeCert_ac2',
            title: 'Copy of Degree Certificate *',
            type: 'fileUpload',
            validators: 'Validators.compose([Validators.required, this.rtValidators.validateArray])',
            options: {
                url: fileUploadUrl,// fileUploadURL,
                filterExtensions: true,
                allowedExtensions: ['application/pdf'],
                calculateSpeed: true,
            },
            required: false
        }
    ]*/
    }

}
