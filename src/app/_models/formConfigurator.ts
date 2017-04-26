import { CountryList} from '../_models/countries';


const formEntries_apd = [
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

const formEntries_ac2 = [
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
            url: "",// fileUploadURL,
            allowedExtensions: ['application/pdf'],
            calculateSpeed: true,
        },
        //required:  false
    }
];

const formEntries_ac = [
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
            url: "",//fileUploadURL,

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
            url: "",// fileUploadURL,

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
            url: "",// fileUploadURL,
            allowedExtensions: ['application/pdf', 'image/jpeg', 'image/png'],
            calculateSpeed: true,
        },
        //required:  true
    }
];

const formEntries_oi = [
    {

        key: 'essay',
        title: 'Essay "Data Science * ',
        type: 'fileUpload',
        validators: ['required','validateFileUpload'],
        secParagraphArray: ['Please submit a PDF file with an essay on Data Science in which you should look at the developments and perspectives of Data Science as well as your planned area of specialisation, and your previous experience.',
            'The essay musst not exceed 1,000 words'],
        options: {
            url: "",// fileUploadURL,

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
            url: "",// fileUploadURL,

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


export const formList = {
    mainForm : {
        title: " MSc Data Science User Application",                        //not used at the moment
        key: "mainForm_mscDSUa",                                            //not used at the moment
        site: 'mainForm_mscDSUa',                                           //not used at the moment
    },
    subForms : [
        {
            title: " Applicant\'s Personal Details",
            key: "subFormGroup_apd",
            site: 'subFormGroup_apd',
            //formObj: this.apd_formObj
            formEntries: formEntries_apd
        },
        {
            title: "Previous Education",
            key: "subFormGroup_ac",
            site: "subFormGroup_ac",
            //formObj: this.ac_formObj,
            formEntries: formEntries_ac,
            childrenFormsArray:[
                {
                    title: "Other Previous Education (optional)",
                    key: "subFormGroup_ac2",
                    //formObj: this.ac2_formObj,
                    formEntries: formEntries_ac2,
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
            //formObj: this.oi_formObj
            formEntries: formEntries_oi
        }
    ]

}
