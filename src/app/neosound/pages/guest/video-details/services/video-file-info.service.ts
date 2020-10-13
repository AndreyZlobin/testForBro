import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class VideoFileInfoService {
  private batchId: string;
  private fileName: string;
  public isLoading: boolean = false;
  private fileInfoStore: {
    bytes: number;
    url: string;
    frames: any[];
    isLoading: boolean;
    detectionLog: any[];
  } = {
    bytes: 0,
    url: null,
    frames: [],
    isLoading: false,
    detectionLog: [],
  };
  colors: any = {
    face: "#0098d9",
    object: "#339ca8",
  };
  // "#0098d9",
  //   "#c12e34",
  //   "#e6b600",
  //   "#2b821d",
  //   "#005eaa",
  //   "#339ca8",
  //   "#cda819",
  //   "#32a487"
  private fileInfoSubject = new BehaviorSubject<any>({});
  public fileInfo = this.fileInfoSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getInfo(batchId: string, fileName: string) {
    if (fileName && batchId) {
      this.fileName = fileName;
      this.batchId = batchId;
      this.fileInfoSubject.next({ url: null });
      this.filesService
        .getFileResultDetails({
          batchid: batchId,
          filename: fileName,
        })
        .subscribe((data) => {
          if (data && data.result && data.result.video) {
            const buffer = data.result.video.objects.reduce((acc, frame) => {
              const { objects, startTime, endTime } = frame;
              const arr =
                acc[`${startTime}-${endTime}`] &&
                acc[`${startTime}-${endTime}`].objects;

              acc[`${startTime}-${endTime}`] = {
                objects: [...objects, ...arr],
                startTime,
                endTime,
              };
              return acc;
            }, {});
            const val = Object.values(buffer);
            this.fileInfoStore.frames = val;

            const detectionLog = val.reduce((acc: any, val: any) => {
              const { objects, startTime, endTime } = val;
              objects.forEach((element) => {
                if (element && element.name) {
                  if (acc[element.name]) {
                    acc[element.name].endTime = endTime;
                  } else {
                    acc[element.name] = {
                      name: element.name,
                      type: element.type,
                      startTime,
                      endTime,
                      color: this.colors[element.type],
                    };
                  }
                }
              });
              return acc;
            }, {});
            
            this.fileInfoStore.detectionLog = Object.values(detectionLog);
            this.fileInfoSubject.next({
              url: data.url,
              frames: val,
              detectionLog: Object.values(detectionLog),
            });
          }
        });
    }
  }

  public getFrame(time: any) {
    return this.fileInfoStore.frames.find(
      (obj: any) => obj.startTime > time && time < obj.endTime
    );
  }
  public getFrames() {
    return this.fileInfoStore.frames;
  }
}
