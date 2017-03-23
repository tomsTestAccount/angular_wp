
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { DashboardComponent }   from './dashboard.component';
import { UserApplicationComponent }   from './lmu_uaForm/user-application.component';
import {LoginComponent} from './login/rt-login.component';
import {StartPageComponent} from './home/start-page.component';
import {RtRegisterCompletion} from './register/rt-register-completion.component';

import {AuthGuard } from '../app/_services/rt-authentication.service';

const routes: Routes = [

	{ path: 'startPage',  component: StartPageComponent },
	{ path: 'userApplication',  component: UserApplicationComponent, canActivate: [AuthGuard] },
	{ path: 'login/:where2go/:from', component: LoginComponent },
	{ path: 'registerCompletion/:userId/:token', component: RtRegisterCompletion},
    { path: '', redirectTo: '/startPage', pathMatch:'full' },
    { path: '404', redirectTo: '/startPage',pathMatch:'full' },
	{ path: '**', redirectTo: '/startPage',pathMatch:'full' }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ],
	providers: [
		AuthGuard
		//,AuthService
	]
})
export class AppRoutingModule {}

