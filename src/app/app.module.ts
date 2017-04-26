import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
import { FormsModule }   		from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    		from '@angular/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { MaterialModule } 		from '@angular/material';

import { CalendarModule }            from 'primeng/components/calendar/calendar';
import { NgUploaderModule }        from 'ngx-uploader';

import  'hammerjs';

import {LoginComponent} from './login/rt-login.component';
//import {RtRegisterCompletion} from './register/rt-register-completion.component';

import {getKeyValuePair}        from './_pipes/key-value.pipe';
import {objValuesPipe}          from '../app/_pipes/key-value.pipe';
import {rtFileUploaderComponent} from './rtFormInputs/rt-file-uploader.component';

import {rtInputComponent}       from './rtFormInputs/rt-input.component';
import {rtGridBoxAddComponent}     from './rtFormInputs/rt-grid-box-add.component';


//import { LmuUserApdComponent } 	from './dynamicForm/ua-apd.component';
//import { LmuUserPeComponent } 	from './dynamicForm/ua-pe.component';
//import { LmuUserOpeComponent } 	from './dynamicForm/ua-ope.component';
//import { LmuUserOiComponent } 	from './dynamicForm/ua-oi.component';

import {DynamicSubFormComponent} from'./dynamicForm/dynamic-subform.component'

import { RestService } from './_services/rt-rest.service';
import {AuthenticationService} from './_services/rt-authentication.service';
import {RtFormService} from './_services/rt-forms.service'
import {ServerConfigs} from './_models/configFile';

import {DialogsService}                 from './_services/dialogs.services'
import { DialogComponent}         from './modal/DialogModal.component';
//import {MdDialogRef}                    from '@angular/material';
//import {lmu_ua_formList}                from './_models/lmu_ua_formList'; //TODO

import { MainFormComponent }     from './dynamicForm/mainform.component';

//import { AppComponent} 			from './app.component';
import {StartPageComponent} from './home/start-page.component';
import { AppLoginComponent} 			from './appLogin.component';
import { AppRoutingModule }             from './app-routing';



    var importsList = [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpModule,
        CalendarModule,

        NgUploaderModule,

        AppRoutingModule,

        BrowserAnimationsModule
        //MaterialModule.forRoot(),
        //ModalModule.forRoot(),
        ];

    var declarationList = [
        //AppComponent,

        AppLoginComponent,
        StartPageComponent,
        LoginComponent,

        //RtRegisterCompletion,

        DialogComponent,
        MainFormComponent,
        //LmuUserApdComponent,
        //LmuUserPeComponent,
        DynamicSubFormComponent,
        //LmuUserOpeComponent,
        //LmuUserOiComponent,
        rtFileUploaderComponent,
        rtInputComponent,
        rtGridBoxAddComponent,
        objValuesPipe,
        getKeyValuePair];

    var providersList = [//UserDataService,
        RestService,
        AuthenticationService,
        ServerConfigs,
        //lmu_ua_formList,
        RtFormService,
        DialogsService,
        //MdDialogRef
        // providers used to create fake backend
        //fakeBackendProviderArray,

        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
        //Window
        //{provide: Window, useValue: window}
        //WindowRef
        ];

        /********* Note that DialogComponent has been added to the entryComponents array. ********************************
        *** You need to add any component that is dynamically generated by the component factory resolver to this array.
        ******/
    var entryComponentsList=[
        DialogComponent
        ];

    var bootstrapList = [AppLoginComponent];
    //var bootstrapList = [AppComponent];



@NgModule({
    imports: [ ...importsList ],
    declarations: [ ...declarationList ],
    providers: [ ...providersList],
    entryComponents : [...entryComponentsList],
    bootstrap: [...bootstrapList]
})




    export class AppModule {
    }
