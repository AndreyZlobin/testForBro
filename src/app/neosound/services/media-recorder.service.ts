import { Injectable } from '@angular/core';
import { Subject ,  timer ,  Subscription } from 'rxjs';
import { merge, map } from 'rxjs/operators';

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
  private isRecording = false;
  private timerSub: Subscription;
  private audioChunks: any[] = [];
  private blob: Blob;
  private ticker;
  public ticks = 0;
  public initialize$: Subject<T[]> = new Subject();
  public start$: Subject<T[]> = new Subject();
  public stop$: Subject<Blob> = new Subject();
  public events$: any = merge(
    this.initialize$.pipe(map(value => ({ name: 'initialize', value }))),
    this.start$.pipe(map(value => ({ name: 'start', value }))),
    this.stop$.pipe(map(value => ({ name: 'stop', value })))
  );
  public start(): void {
    this.isRecording = true;
    this.ticker = timer(1000, 1000);
    this.timerSub = this.ticker.subscribe(t => this.tickerFunc(t));
    this.mediaRecorder.start();
    this.start$.next();
  }
  public stop(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.timerSub.unsubscribe();
  }
  public initialize(): void {
  }
  tickerFunc(tick) {
    this.ticks = tick;
  }
  constructor() {
    const onSuccess = stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.onstop = e => {
        const audio = new Audio();
        const blob = new Blob(this.audioChunks, { 'type': 'audio/wav' });
        this.audioChunks.length = 0;
        this.stop$.next(blob);
      };
      this.mediaRecorder.ondataavailable = e => this.audioChunks.push(e.data);
      this.initialize$.next();
    };

    navigator.getUserMedia({ audio: true }, onSuccess, e => console.log(e));
  }
}
