import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { UploadEvent, UploadFile } from "ngx-file-drop";

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public file: any;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(file: any) {
    this.file = file;
  }

  public upload = () => { };
  public cancel = () => { };
  public remove = () => { };

  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () => this.status === FileQueueStatus.Pending || this.status === FileQueueStatus.Error;

}

@Injectable()
export class UploadService {
  public queue: BehaviorSubject<FileQueueObject[]>;
  private files: FileQueueObject[] = [];

  constructor(private http: HttpClient) {
    this.queue = <BehaviorSubject<FileQueueObject[]>>new BehaviorSubject(this.files);
  }
  public uploadFiles(files: UploadFile[]) {
    debugger
  }

  public clearQueue() {
    this.files = [];
    this.queue.next(this.files);
  }

  private uploadProgress(queueObj: FileQueueObject, event: any) {
    const progress = Math.round(100 * event.loaded / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this.queue.next(this.files);
  }

  private uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    this.queue.next(this.files);
  }
  public onCompleteItem(queueObj: FileQueueObject, response: any): any {
    return { queueObj, response };
  }

  private uploadComplete(queueObj: FileQueueObject, response: HttpResponse<any>) {
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;
    this.queue.next(this.files);
    this.onCompleteItem(queueObj, response.body);
  }
  private addToQueue(file: any) {
    const queueObj = new FileQueueObject(file);

    // set the individual object events
    queueObj.upload = () => this.upload(queueObj);

    // push to the queue
    this.files.push(queueObj);
    this.queue.next(this.files);
  }
  private upload(queueObj: FileQueueObject) {
    const form = new FormData();
    form.append('file', queueObj.file, queueObj.file.name);

    const req = new HttpRequest('POST', `${environment.api}/uploadFile`, form, {
      reportProgress: true,
    });

    queueObj.request = this.http.request(req).subscribe(
      (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress(queueObj, event);
        } else if (event instanceof HttpResponse) {
          this.uploadComplete(queueObj, event);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.uploadFailed(queueObj, err);
        } else {
          this.uploadFailed(queueObj, err);
        }
      }
    );

    return queueObj;
  }

}
