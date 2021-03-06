import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "../../../../services/files.service";

@Injectable()
export class FilePeeksService {
  private batchId: string;
  private fileName: string;
  private filePeaksStore: {
    peaks: any;
  } = {
    peaks: null
  };
  private peeksSubject = new BehaviorSubject<any>({});
  public peeks = this.peeksSubject.asObservable();

  constructor(private filesService: FilesService) {}
  public getAudioWaveForm(batchId: string, fileName: string) {
    this.peeksSubject.next(null);
    if (fileName && batchId) {
      this.peeksSubject.next(null);
      this.filesService
        .getAudioWaveForm({
          filename: fileName,
          batchid: batchId
        })
        .subscribe(meta => {
          if (meta.ContentRange) {
            this.loadChunks(batchId, fileName, meta);
          } else {
            this.peeksSubject.next(this.getPeaks(meta));
          }
        });
    }
  }
  loadChunks(batchId, fileName, meta) {
    this.filesService
      .getAudioWaveForm({
        filename: fileName,
        batchid: batchId,
        ContentRange: meta.ContentRange
      })
      .subscribe(res => {
        meta.data = meta.data + res.data;
        meta.ContentRange = res.ContentRange;
        if (meta.ContentRange) {
          this.loadChunks(batchId, fileName, meta);
        } else {
          this.peeksSubject.next(this.getPeaks(meta));
        }
      });
  }
  getPeaks(meta) {
    const data = JSON.parse(meta.data);
    let peaks = [];
    if (data.data[0] instanceof Array || data.channels === 1) {
      peaks = data.data;
    } else {
      peaks = [[], []];
      const datalen = data.data.length;
      for (let i = 0; i < datalen / 2; i++) {
        if (i % 2) {
          peaks[1].push(data.data[2 * i]);
          peaks[1].push(data.data[2 * i + 1]);
        } else {
          peaks[0].push(data.data[2 * i]);
          peaks[0].push(data.data[2 * i + 1]);
        }
      }
    }
    return peaks;
  }
}
