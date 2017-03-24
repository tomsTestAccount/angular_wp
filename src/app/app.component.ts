import { Component,OnDestroy,Input } from '@angular/core';
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
    {}
}
