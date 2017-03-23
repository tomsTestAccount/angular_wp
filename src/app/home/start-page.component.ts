import { Component,OnInit} from '@angular/core';
//import * as test from './start-page.component.html';

//import 'systemjs-plugin-text';
//import * as test from 'templates/start-page.component.html!text' ;

//import template from './templates/start-page.component.html!text';

//import 'text';
//import html from './templates/start-page.component.html';

//var html = require('./start-page.component.html!text');
//var css = require('./start-page.component.css!text');

@Component({
    ////moduleId: module.id,
    selector: 'startPage',
    //template:html,
    templateUrl: 'start-page.component.html',
    styleUrls: ['start-page.component.css']
    //styles:[css]

})



export class StartPageComponent implements OnInit {


    constructor() {};
    //constructor(private userdataservice: UserDataService) {};

    ngOnInit(): void {

    }


}
