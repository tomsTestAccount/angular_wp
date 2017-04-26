import {Component,OnInit,DoCheck,AfterViewInit } from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { Subject }    from 'rxjs/Subject';

export interface IDialogStruct {
    title?: string;
    message?: string;
    dialogSelection: string;
}


const dbg_print = true;

@Component({
    selector: 'my-uaFormDialog',
    template: `
            <div *ngIf="ds.dialogSelection == 'loading'"  id="loadingDialog">
                <div  id="spinnerDiv" [style.display]="'flex'" [style.justify-content]="'center'" >
                    <md-spinner></md-spinner>
                </div>
                <p>{{ ds.title }}</p>
                <p>{{ ds.message }}</p>
            </div>    
            
            <div *ngIf="ds.dialogSelection == 'confirm'"  id="confirmDialog">
                <p>{{ ds.title }}</p>
                <p>{{ ds.message }}</p>
                <button type="button" md-raised-button 
                    (click)="dialogRef.close(true)">OK</button>
                <button type="button" md-button 
                    (click)="dialogRef.close()">Cancel</button>
            </div>
            
            <div *ngIf="ds.dialogSelection == 'info'"  id="infoDialog">
                <p>{{ ds.title }}</p>
                <p>{{ ds.message }}</p>
                <button type="button" md-raised-button 
                    (click)="dialogRef.close(true)">OK</button>
                <!--<button type="button" md-button 
                    (click)="dialogRef.close()">Cancel</button>
                 -->
            </div>
    `,
})
export class DialogComponent implements OnInit,DoCheck,AfterViewInit {

    public ds  : IDialogStruct;

    //observable sources
    private dialog_selection = new Subject<IDialogStruct>();

    //announcements
    public dialogSel$ = this.dialog_selection.asObservable();

    // Service commands
    public set_dialogSel(dialogStruct:IDialogStruct) {
        this.dialog_selection.next(dialogStruct);
    }

    constructor(public dialogRef: MdDialogRef<DialogComponent>) {

        if (dbg_print) console.log('In constructor DialogComponent');

         this.dialogSel$.subscribe(
         selStruct => {
            if (selStruct.dialogSelection == 'info'  || selStruct.dialogSelection == 'confirm' || selStruct.dialogSelection == 'loading'  )
            {
                this.ds = selStruct;
                //this.ds.dialogSelection == selStruct.dialogSelection;
                //this.ds.title
            }
            else console.log("Error : In uaFormModal, selStruct.dialogSelection = ",selStruct.dialogSelection );

         });
    }

    ngOnInit()
    {
        console.log("In ngOnInit for DialogComponent");
    }

    ngDoCheck()
    {
      // console.log("ds=",this.ds);
    }

    ngAfterViewInit()
    {
        console.log("In ngAfterViewInit for DialogComponent");
    }


}