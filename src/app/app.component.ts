import { Component,OnDestroy,Input } from '@angular/core';
import {MainFormComponent} from './dynamicForm/mainform.component';

@Component({
    selector: 'my-app',
    template: `
		<div class="container">
		
          <rt-mainForm></rt-mainForm>
  
        </div>
    `,
    providers: [MainFormComponent]
})

export class AppComponent{

    constructor( public rtMainFormComp:MainFormComponent)
    {}
}
