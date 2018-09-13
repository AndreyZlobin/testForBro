import { Injectable } from "@angular/core";
import { Subject, timer, Subscription } from "rxjs";
import { merge, map } from "rxjs/operators";
import * as RecordRTC from "recordrtc";

// Typescript hack.
declare var MediaRecorder: any;

export interface AudioMedia {
  isRecording?: boolean;
  audioChunks?: any[];
  ticker?: number;
}

@Injectable()
export class MediaRecorderService<T extends AudioMedia = AudioMedia> {
  private mediaRecorder: any;
  private mediaStream: any;
  private isRecording = false;
  private timerSub: Subscription;
  private audioChunks: any[] = [];
  private blob: Blob;
  private ticker;
  public ticks = 0;
  public initialize$: Subject<T[]> = new Subject();
  public start$: Subject<T[]> = new Subject();
  public stop$: Subject<string> = new Subject();
  public events$: any = merge(
    this.initialize$.pipe(map(value => ({ name: "initialize", value }))),
    this.start$.pipe(map(value => ({ name: "start", value }))),
    this.stop$.pipe(map(value => ({ name: "stop", value })))
  );
  public start(): void {
    this.isRecording = true;
    this.ticker = timer(1000, 1000);
    this.timerSub = this.ticker.subscribe(t => this.tickerFunc(t));
    this.start$.next();
    const options = {
      recorderType: RecordRTC.StereoAudioRecorder,
      mimeType: "audio/wav"
    };
    this.mediaRecorder = RecordRTC(this.mediaStream, options);
    this.mediaRecorder.startRecording();
  }
  public stop(): void {
    this.mediaRecorder.stopRecording(audioUrl => {
      this.isRecording = false;
      this.timerSub.unsubscribe();
      const data = this.mediaRecorder.getBlob();
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = () => {
        this.stop$.next(reader.result);
      };
    });
  }
  public initialize(): void {}
  tickerFunc(tick) {
    this.ticks = tick;
  }
  constructor() {
    const onSuccess = stream => {
      this.mediaStream = stream;
    };

    navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
  }
}
