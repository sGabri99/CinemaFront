import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '420px',
      maxWidth: 'calc(100vw - 32px)',
      autoFocus: false,
      panelClass: 'confirm-dialog-panel'
    }).afterClosed().pipe(
      map(result => Boolean(result))
    );
  }

  notifySuccess(message: string, title = 'Acquisto completato'): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Chiudi',
      showCancel: false,
      variant: 'success'
    });
  }

  notifyInfo(message: string, title = 'Avviso'): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Chiudi',
      showCancel: false,
      variant: 'info'
    });
  }

  notifyError(message: string, title = 'Operazione non riuscita'): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText: 'Chiudi',
      showCancel: false
    });
  }
}
