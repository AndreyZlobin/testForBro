import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { BehaviorSubject, Subscription } from "rxjs";
import { FilesService } from "./files.service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
  HttpEventType
} from "@angular/common/http";

export enum FileQueueStatus {
  Pending,
  Success,
  Error,
  Progress
}

export class FileQueueObject {
  public batchId: string;
  public file: any;
  public name: string;
  public status: FileQueueStatus = FileQueueStatus.Pending;
  public progress: number = 0;
  public request: Subscription = null;
  public response: HttpResponse<any> | HttpErrorResponse = null;

  constructor(batchId: string, file: any) {
    this.batchId = batchId;
    this.file = file;
    this.name = file.name;
  }

  public upload = () => {};
  public cancel = () => {};
  public remove = () => {};

  public isPending = () => this.status === FileQueueStatus.Pending;
  public isSuccess = () => this.status === FileQueueStatus.Success;
  public isError = () => this.status === FileQueueStatus.Error;
  public inProgress = () => this.status === FileQueueStatus.Progress;
  public isUploadable = () =>
    this.status === FileQueueStatus.Pending ||
    this.status === FileQueueStatus.Error;
}

@Injectable()
export class UploadService {
  public hasUpload: boolean = false;
  public queue: BehaviorSubject<FileQueueObject[]>;
  public files: FileQueueObject[] = [];
  private currentIndex: number = 0;

  constructor(private http: HttpClient, private filesService: FilesService) {
    this.queue = <BehaviorSubject<FileQueueObject[]>>(
      new BehaviorSubject(this.files)
    );
  }
  public uploadFiles(batchId: string, files: any[]) {
    this.hasUpload = true;
    files.forEach(file => {
      this.addToQueue(batchId, file);
    });
    this.files[this.currentIndex].upload();
    this.queue.next(this.files);
  }

  public clearQueue() {
    this.files = [];
    this.queue.next(this.files);
  }

  private uploadProgress(queueObj: FileQueueObject, event: any) {
    const progress = Math.round((100 * event.loaded) / event.total);
    queueObj.progress = progress;
    queueObj.status = FileQueueStatus.Progress;
    this.queue.next(this.files);
  }

  private uploadFailed(queueObj: FileQueueObject, response: HttpErrorResponse) {
    queueObj.progress = 0;
    queueObj.status = FileQueueStatus.Error;
    queueObj.response = response;
    this.currentIndex = this.currentIndex + 1;
    this.files[this.currentIndex].upload();
    this.queue.next(this.files);
  }
  public onCompleteItem(queueObj: FileQueueObject, response: any): any {
    const prev = this.files[this.currentIndex];
    this.currentIndex = this.currentIndex + 1;
    const next = this.files[this.currentIndex];
    if (this.files[this.currentIndex]) {
      this.files[this.currentIndex].upload();
    } else {
      this.hasUpload = false;
      this.currentIndex = 0;
      this.clearQueue();
    }
    return { queueObj, response };
  }

  private uploadComplete(
    queueObj: FileQueueObject,
    response: HttpResponse<any>
  ) {
    queueObj.progress = 100;
    queueObj.status = FileQueueStatus.Success;
    queueObj.response = response;
    this.queue.next(this.files);
    this.onCompleteItem(queueObj, response.body);
  }
  private addToQueue(batchId: string, file: any) {
    const queueObj = new FileQueueObject(batchId, file);

    // set the individual object events
    queueObj.upload = () => this.upload(queueObj);

    // push to the queue
    this.files.push(queueObj);
    this.queue.next(this.files);
  }
  private upload(queueObj: FileQueueObject) {
    const form = new FormData();
    form.append("batchid", queueObj.batchId);
    form.append("file", queueObj.file);

    const req = new HttpRequest("POST", `${environment.localapi}/audiofile/upload`, form, {
      reportProgress: true
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
  }
}
