import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { finalize, first } from 'rxjs/operators';
import { Upload } from './../application-form/application-form.model';
import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CertificateService } from './certificate.service';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateComponent implements OnInit {
  private _isUploading: boolean = false;

  set isUploading(val: boolean) {
    this._isUploading = val;
    this.isUploadInProgress.emit(this.isUploading);
  }

  get isUploading() {
    return this._isUploading;
  }

  isGeneratingLink: boolean = false;
  
  @Input()
  workorderId: number;

  @Input()
  passcode: string;

  @Input()
  disableUpload: boolean;

  @Input()
  uploadedFile: Upload[];

  @Output()
  isUploadInProgress: EventEmitter<boolean> = new EventEmitter();

  @Output()
  newFileUploaded: EventEmitter<Upload[]> = new EventEmitter();

  constructor(
    private certficateService: CertificateService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  uploadFile(e: Event) {
    const list: FileList = e.target['files'];
    const file: File = list?.[0];

    if (!file) { return; }

    this.isUploading = true;
    this.certficateService.upload(file).pipe(
      first(),
      finalize(() => {
        this.isUploading = false;
        this.cdr.detectChanges();
      })
    ).subscribe(
      (uploadedResponse: Upload[]) => {
        this.newFileUploaded.emit(uploadedResponse);
      }, 
      (err: HttpErrorResponse) => {
        this.snackBar.open('Failed to upload file, please try again later.')
      }
    )
  }

  download(uploadedFile: Upload) {
    this.isGeneratingLink = true;

    const request = (!!this.passcode && this.workorderId > 0) ? 
                      this.downloadWithPasscode(this.passcode, this.workorderId) : 
                        this.downloadUploadedFile(uploadedFile);
    
    request.pipe(
      first(),
      finalize(() => {
        this.isGeneratingLink = false;
        this.cdr.detectChanges();
      })
    ).subscribe(
      (fileUrl) => {
        window.open(fileUrl.signed_url, '_blank'); // TODO: open in new tab doesn't work in safari
      }, (err: HttpErrorResponse) => {
        this.snackBar.open('Failed to get file, please try again later.', 'x')
      })
  }

  private downloadWithPasscode(passcode: string, workorderId: number) {
    return this.certficateService.downloadWithPasscode(workorderId, passcode)
  }

  private downloadUploadedFile(uploadedFile: Upload) {
    return this.certficateService.download(uploadedFile)
  }
}
