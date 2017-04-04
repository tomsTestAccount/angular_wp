import { Observable } from 'rxjs/Rx';
import { uaFormDialog} from '../modal/uaFormModal.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

const dbgDialog_Print = true;

@Injectable()
export class DialogsService {

    private dialogRef: MdDialogRef<uaFormDialog>;
    private  config: MdDialogConfig;

    constructor(private dialog: MdDialog) {
        this.config = new MdDialogConfig(); //disableClose = true;
    }


    public closeDialog()
    {
        this.dialogRef.close();
    }

    public confirm(title: string, message: string): Observable<boolean> {

        if (dbgDialog_Print) console.log("In DialogService,confirm,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.dialogRef = this.dialog.open(uaFormDialog);
        //dialogRef.componentInstance.title = title;
        //dialogRef.componentInstance.message = message;


        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title,
                message:message,
                dialogSelection: 'confirm',
            }
            );

        return this.dialogRef.afterClosed();
    }

    public loading(title?: string, message?: string) {

        if (dbgDialog_Print) console.log("In DialogService,loading,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.config.disableClose = true;

        this.dialogRef = this.dialog.open(uaFormDialog,this.config);
        //dialogRef.componentInstance.title = title;
        //dialogRef.componentInstance.message = message;


        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title || "Wait while Loading Data",
                message:message,
                dialogSelection: 'loading',
            }
        );

        //return dialogRef.afterClosed();
    }

    public info(title: string, message: string) {

        if (dbgDialog_Print) console.log("In DialogService,info,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.dialogRef = this.dialog.open(uaFormDialog);
        //dialogRef.componentInstance.title = title;
        //dialogRef.componentInstance.message = message;


        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title ,
                message:message,
                dialogSelection: 'info',
            }
        );

        //return dialogRef.afterClosed();
    }
}