import { Observable } from 'rxjs/Rx';
import { uaFormDialog} from '../modal/uaFormModal.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

const dbgDialog_Print = true;

@Injectable()
export class DialogsService {

    private dialogRef: MdDialogRef<uaFormDialog>;
    private  config: MdDialogConfig;
    private isDialog_open = false;

    constructor(private dialog: MdDialog) {
        this.config = new MdDialogConfig(); //disableClose = true;
    }


    public closeDialog()
    {
        this.dialogRef.close();
        this.isDialog_open = false;
    }

    public confirm(title: string, message: string): Observable<boolean> {

        if (this.isDialog_open == true) this.closeDialog();

        if (dbgDialog_Print) console.log("In DialogService,confirm,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.dialogRef = this.dialog.open(uaFormDialog);
        this.isDialog_open = true;
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

        if (this.isDialog_open == true) this.closeDialog();

        if (dbgDialog_Print) console.log("In DialogService,loading,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.config.disableClose = true;

        this.dialogRef = this.dialog.open(uaFormDialog,this.config);
        this.isDialog_open = true;
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

        if (this.isDialog_open == true) this.closeDialog();

        if (dbgDialog_Print) console.log("In DialogService,info,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialog>;

        this.dialogRef = this.dialog.open(uaFormDialog);
        this.isDialog_open = true;
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


//------------- example
/*public openConfirmDialog() {
    this.dialogsService
        .confirm('Confirm Dialog', 'Are you sure you want to do this?')
        .subscribe(res => this.dialogResult = res);
}
*/