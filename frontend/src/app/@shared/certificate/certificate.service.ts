import { Observable } from 'rxjs';
import { Upload } from './../application-form/application-form.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface SignedUrl {
  signed_url: string
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(
    private httpClient: HttpClient
  ) { }

  upload(file: File) {
    const URL = '/upload';
    const formData: FormData = new FormData();
    formData.append('files', file);

    return this.httpClient.post(URL, formData);
  }

  download(uploadedFile: Upload): Observable<SignedUrl> {
    const URL = `/workorders/certificate/download/${uploadedFile?.hash}/${uploadedFile?.ext}`;

    return this.httpClient.get<{signed_url: string}>(URL);
  }

  downloadWithPasscode(workOrderId: number, passcode: string): Observable<SignedUrl> {
    const URL = `/workorders/certificate/downloadWithPasscode/${workOrderId}`;

    return this.httpClient.post<{signed_url: string}>(URL, {passcode})
  }

  delete(fileId: string) {
    const URL = `/upload/files/${fileId}`;

    return this.httpClient.delete(URL);
  }
}
