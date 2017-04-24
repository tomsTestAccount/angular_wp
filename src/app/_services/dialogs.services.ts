import { Observable } from 'rxjs/Rx';
import { uaFormDialogComponent} from '../modal/uaFormModal.component';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { Injectable } from '@angular/core';

const dbgDialog_Print = true;

@Injectable()
export class DialogsService {

    private dialogRef: MdDialogRef<uaFormDialogComponent>;
    private config: MdDialogConfig;
    private isDialog_open = false;

    constructor(private dialog: MdDialog) {
        this.config = new MdDialogConfig(); //disableClose = true;

    }

    public closeDialog()
    {
        if (dbgDialog_Print) console.log("In closeDialog 1, dialogRef=",this.dialogRef);

        if (this.dialogRef)
        {
            this.dialog.closeAll();
            //this.dialogRef.close(uaFormDialogComponent);
            if (dbgDialog_Print) console.log("In closeDialog 2, dialogRef=",this.dialogRef);
        }
        this.isDialog_open = false;
    }

    public confirm(title: string, message: string): Observable<boolean> {

        if (this.isDialog_open === true) this.closeDialog();

        if (dbgDialog_Print) console.log("In DialogService,confirm,title",title,",message=",message);

        this.dialogRef = this.dialog.open(uaFormDialogComponent);
        this.isDialog_open = true;

        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title,
                message:message,
                dialogSelection: 'confirm'
            }
        );

        return this.dialogRef.afterClosed();
    }

    public loading(title?: string, message?: string) {

        if (this.isDialog_open == true) this.closeDialog();

        //if (dbgDialog_Print) console.log("In DialogService,loading,title",title,",message=",message);

        //this.dialogRef = MdDialogRef<uaFormDialogComponent>;

        //this.config.disableClose = false;

        this.dialogRef = this.dialog.open(uaFormDialogComponent,this.config);
        this.isDialog_open = true;

        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title || "Wait while Loading Data",
                message:message,
                dialogSelection: 'loading',
            }
        );

        if (dbgDialog_Print) console.log("In loading, dialogRef=",this.dialogRef);

        //return dialogRef.afterClosed();
    }

    public info(title: string, message: string) {

        if (this.isDialog_open == true) this.closeDialog();

        if (dbgDialog_Print) console.log("In DialogService,info,title",title,",message=",message);

        //let dialogRef: MdDialogRef<uaFormDialogComponent>;

        this.dialogRef = this.dialog.open(uaFormDialogComponent);
        this.isDialog_open = true;
        //dialogRef.componentInstance.title = title;
        //dialogRef.componentInstance.message = message;


        this.dialogRef.componentInstance.set_dialogSel(
            {
                title: title ,
                message:message,
                dialogSelection: 'info'
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