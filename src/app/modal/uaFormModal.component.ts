import {Component} from '@angular/core';
import {MdDialogRef} from '@angular/material';
import { Subject }    from 'rxjs/Subject';

export interface IDialogStruct {
    title?: string;
    message?: string;
    dialogSelection: string;

    /*
     constructor(t:string,m:string,d:string)
     {
     this.title = t;
     this.message = m;
     this.dialogSelection = d;
     }
     */
}




@Component({
    selector: 'uaFormDialog',
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
export class uaFormDialog {

    /*public title: string;
    public message: string;
    public dialogSelection: string;
    */

    public ds  : IDialogStruct;


    //observable sources
    private dialog_selection = new Subject<IDialogStruct>();

    //announcements
    public dialogSel$ = this.dialog_selection.asObservable();

    // Service commands
    public set_dialogSel(dialogStruct:IDialogStruct) {
        this.dialog_selection.next(dialogStruct);
    }

    constructor(public dialogRef: MdDialogRef<uaFormDialog>) {


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
}