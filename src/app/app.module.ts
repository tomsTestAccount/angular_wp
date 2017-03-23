

import { NgModule }      		from '@angular/core';
import { BrowserModule } 		from '@angular/platform-browser';
import { FormsModule }   		from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }    		from '@angular/http';


import { MaterialModule } 		from '@angular/material/';


import { CalendarModule }            from 'primeng/components/calendar/calendar';

import { Ng2UploaderModule }        from 'ng2-uploader/ng2-uploader';

import  'hammerjs';


import {StartPageComponent} from './home/start-page.component';
import { UserApplicationComponent }   from './lmu_uaForm/user-application.component';

import {LoginComponent} from './login/rt-login.component';
import {RtRegisterCompletion} from './register/rt-register-completion.component';

import {getKeyValuePair}        from './_pipes/key-value.pipe';
import {objValuesPipe}          from '../app/_pipes/key-value.pipe';
import {rtFileUploaderComponent} from './rtForm/rt-file-uploader.component';
import {rtInputComponent}       from './rtForm/rt-input.component';
import {rtGridBoxAddComponent}     from './rtForm/rt-grid-box-add.component';


import { LmuUserApdComponent } 	from './lmu_uaForm/ua-apd.component';
import { LmuUserPeComponent } 	from './lmu_uaForm/ua-pe.component';
import { LmuUserOpeComponent } 	from './lmu_uaForm/ua-ope.component';
import { LmuUserOiComponent } 	from './lmu_uaForm/ua-oi.component';


// used to create fake backend
//import {fakeBackendProvider}    from './mock-backend.component_ts.bak';
//import { MockBackend, MockConnection } from '@angular/http/testing';
//import { BaseRequestOptions } from '@angular/http';

import { RestService } from './_services/rt-rest.service';
import {AuthenticationService} from './_services/rt-authentication.service';

import {ServerConfigs} from './_models/configFile';

import {lmu_ua_formList} from './_models/lmu_ua_formList'; //TODO
import {RtFormService} from './_services/rt-forms.service'

import { AppComponent} 			from './app.component';

import { AppLoginComponent} 			from './appLogin.component';
import { AppRoutingModule }             from './app-routing';

import {WindowRef} from './_services/windowRef.service'

//import { environment } from '../environments/environment';

/*
export var importsList:any;
var declarationList:any;
var providersList:any;
var bootstrapList:any;


if (environment.production == false) {
*/
    var importsList = [BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        MaterialModule.forRoot(),
        //ModalModule.forRoot(),
        CalendarModule,
        Ng2UploaderModule];
    var declarationList = [
        AppComponent,
        AppLoginComponent,
        StartPageComponent,
        LoginComponent,
        RtRegisterCompletion,
        UserApplicationComponent,
        LmuUserApdComponent,
        LmuUserPeComponent,
        LmuUserOpeComponent,
        LmuUserOiComponent,
        rtFileUploaderComponent,
        rtInputComponent,
        rtGridBoxAddComponent,
        objValuesPipe,
        getKeyValuePair];
    var providersList = [//UserDataService,
        RestService,
        AuthenticationService,
        ServerConfigs,
        lmu_ua_formList,
        RtFormService,
        // providers used to create fake backend
        //fakeBackendProviderArray,

        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
        //Window
        //{provide: Window, useValue: window}
        WindowRef
        ];
    //var bootstrapList = [AppLoginComponent];
    var bootstrapList = [AppComponent];
//}


//console.log("process.env.NODE_ENV = ",process.env.NODE_ENV);

/*
    importsList.push(BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        MaterialModule.forRoot(),
        //ModalModule.forRoot(),
        CalendarModule,
        Ng2UploaderModule);

    declarationList.push(
        //AppComponent,
        AppLoginComponent,
        StartPageComponent,
        LoginComponent,
        RtRegisterCompletion,
        UserApplicationComponent,
        LmuUserApdComponent,
        LmuUserPeComponent,
        LmuUserOpeComponent,
        LmuUserOiComponent,
        rtFileUploaderComponent,
        rtInputComponent,
        rtGridBoxAddComponent,
        objValuesPipe,
        getKeyValuePair);
    providersList.push(
        //UserDataService,
        RestService,
        AuthenticationService,
        ServerConfigs,
        lmu_ua_formList,
        RtFormService,
        // providers used to create fake backend
        //fakeBackendProviderArray,

        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
        {provide: Window, useValue: window}
    );
    bootstrapList.push(AppLoginComponent);
}
*/

@NgModule({
    imports: [ ...importsList ],
    declarations: [ ...declarationList ],
    providers: [ ...providersList],
    bootstrap: [...bootstrapList]
})


/*
    @NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpModule,
        MaterialModule.forRoot(),
        //ModalModule.forRoot(),
        CalendarModule,
        Ng2UploaderModule,
    ],
    declarations: [
        //AppComponent,
        AppLoginComponent,
        StartPageComponent,
        LoginComponent,
        RtRegisterCompletion,
        UserApplicationComponent,
        LmuUserApdComponent,
        LmuUserPeComponent,
        LmuUserOpeComponent,
        LmuUserOiComponent,
        rtFileUploaderComponent,
        rtInputComponent,
        rtGridBoxAddComponent,
        objValuesPipe,
        getKeyValuePair

    ],
    providers: [
        //UserDataService,
        RestService,
        AuthenticationService,
        ServerConfigs,
        lmu_ua_formList,
        RtFormService,
        // providers used to create fake backend
        //fakeBackendProviderArray,

        //fakeBackendProvider,
        //MockBackend,
        //BaseRequestOptions
        {provide: Window, useValue: window}
    ],
    bootstrap: [AppLoginComponent]

})
*/

    export class AppModule {
    }
