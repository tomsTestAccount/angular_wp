import { Component,OnDestroy,Input } from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../app/_services/rt-authentication.service';
import { Subscription }   from 'rxjs/Subscription';
import {Location} from '@angular/common';




import {UserApplicationComponent} from '../app/lmu_uaForm/user-application.component';

@Component({
    selector: 'my-app',
    template: `
		<div class="container">
		
          <my-userApplication></my-userApplication>
  
        </div>
    `,
    providers: [UserApplicationComponent]
})

export class AppComponent{

    constructor( public uaFormComp:UserApplicationComponent)
    {
        var cookies = document.cookie;
        console.log("cookies = ",cookies);

        //this.uaFormComp.ngOnInit();
    }

}
