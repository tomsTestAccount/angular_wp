/**
 * Created by Tom on 19.04.2017.
 */

import { ComponentFixture, TestBed,async,tick,fakeAsync } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';



import {UserApplicationComponent} from '../app/dynamicForm/mainform.component';

import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';
import {lmu_ua_formList} from  '../app/_models/lmu_ua_formList';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

//import { LmuUserApdComponent } 	from '../app/dynamicForm/ua-apd.component';
//import { LmuUserPeComponent } 	from '../app/dynamicForm/ua-pe.component';
//import { LmuUserOpeComponent } 	from '../app/dynamicForm/ua-ope.component';
//import { LmuUserOiComponent } 	from '../app/dynamicForm/ua-oi.component';

import {DynamicSubFormComponent} from'../app/dynamicForm/dynamic-subform.component'

import {rtInputComponent}       from '../app/rtFormInputs/rt-input.component';
import {rtGridBoxAddComponent}     from '../app/rtFormInputs/rt-grid-box-add.component';
import { CalendarModule }            from 'primeng/components/calendar/calendar';
import { NgUploaderModule }        from 'ngx-uploader';
import {rtFileUploaderComponent} from '../app/rtFormInputs/rt-file-uploader.component';
import {getKeyValuePair}        from '../app/_pipes/key-value.pipe';
import {objValuesPipe}          from '../app/_pipes/key-value.pipe';

import {AuthenticationService} from  '../app/_services/rt-authentication.service';
import { RtFormService ,cFormObject} from '../app/_services/rt-forms.service';
import {ServerConfigs} from '../app/_models/configFile';
import {DialogsService} from '../app/_services/dialogs.services'

//------------------ mocks/stubs ---------------------------------------------

class AuthenticationService_MOCK
{
    constructor(){};

    public auth_getFormObject():Promise<Object> {
        return new Promise((resolve,reject) =>{
            resolve({});
        })

    }
};

class DialogsService_MOCK {
    constructor(){};

    public loading(title?: string, message?: string)
    {
        console.log("call dialogService.loading: ",title,message);
    };
};

//------------------- test-preparation --------------------------------------------------

describe('UserApplicationComponent', () => {

    var fixture,comp;
    var dialogsService; // = DialogsService_MOCK;


        beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MaterialModule,
                        ReactiveFormsModule,
                        FormsModule,
                        CalendarModule,
                        NgUploaderModule,
                        BrowserAnimationsModule
                    ],
            declarations: [UserApplicationComponent,
                            DynamicSubFormComponent,
                            //LmuUserApdComponent,
                            //LmuUserPeComponent,
                            //LmuUserOiComponent,
                            //LmuUserOpeComponent,
                            rtInputComponent,
                            rtGridBoxAddComponent,
                            rtFileUploaderComponent,
                            objValuesPipe,
                            getKeyValuePair
                            ],
            providers:    [ {provide: AuthenticationService, useValue: new AuthenticationService_MOCK() },
                {provide: DialogsService, useValue: new DialogsService_MOCK() },
                lmu_ua_formList,RtFormService,ServerConfigs]
        });

        // Before each test set our injected Users factory (_Users_) to our local Users variable
        /*beforeEach(inject(function(DialogsService_MOCK) {
            this.dialogsService = DialogsService_MOCK;
        }));
        */
    });

//--------------------------- tests ------------------------------------------------------

    it('should have a defined component', () => {
        expect(UserApplicationComponent).toBeDefined();
    });
    it ('should create Instance', () => {
        fixture = TestBed.createComponent(UserApplicationComponent);
        comp = fixture.componentInstance ;
        expect(comp instanceof UserApplicationComponent).toBe(true, 'should create UserApplicationComponent');


    });
    it ('mock-services should be defined ', () => {
        // DialogsService from the root injector
        //dialogsService =  fixture.debugElement.injector.get(DialogsService);
        comp.dialogsService =  TestBed.get(DialogsService);
        comp._authService =  TestBed.get(AuthenticationService);

        console.log("comp=",comp);
        expect(comp.dialogsService).toBeDefined();
        expect(comp._authService).toBeDefined();
    });
    it('main_lmu_ua_form should be defined (async)', async(() => {
        console.log("comp=",comp);
        console.log("fixture=",fixture);
        comp.ngOnInit();
        //tick();
        fixture.whenStable().then(() => {
            //fixture.detectChanges();
            console.log("main_lmu_ua_form=",comp.main_lmu_ua_form);
            expect(comp.main_lmu_ua_form).toBeDefined();
        });


    }))
});

/*
describe('userApplicationComponent ', () => {

    let comp:    UserApplicationComponent;
    let fixture: ComponentFixture<UserApplicationComponent>;
    //let de:      DebugElement;
    //let el:      HTMLElement;

    /* webpack don't need async
    beforeEach(async() => {
        TestBed.configureTestingModule({
            declarations: [UserApplicationComponent], // declare the test component
        }).compileComponents();  // compile template and css;

    });
    */
/*
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserApplicationComponent], // declare the test component
        });


        fixture = TestBed.createComponent(UserApplicationComponent);


        comp = fixture.componentInstance; // UserApplicationComponent test instance

        // query for the title <h1> by CSS element selector
        //de = fixture.debugElement.query(By.css('h1'));
        //el = de.nativeElement;
    });

    it('should display original title', () => {
        fixture.detectChanges();
        expect(false).toBe(comp.isFormDataLoaded,'should create AppComponent');
    });


});
    */