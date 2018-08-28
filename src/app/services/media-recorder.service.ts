import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { merge, map } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';

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
  private ticker;
  public ticks = 0;
  public initialize$: Subject<T[]> = new Subject();
  public start$: Subject<T[]> = new Subject();
  public stop$: Subject<T[]> = new Subject();
  public upload$: Subject<T[]> = new Subject();
  public events$: any = merge(
    this.initialize$.pipe(map(value => ({ name: 'initialize', value }))),
    this.start$.pipe(map(value => ({ name: 'start', value }))),
    this.stop$.pipe(map(value => ({ name: 'stop', value }))),
    this.upload$.pipe(map(value => ({ name: 'upload', value })))
  );
  public start(): void {
    console.log('record');
    const self = this;
    this.isRecording = true;
    this.ticker = timer(1000, 1000);
    this.timerSub = this.ticker.subscribe(t => this.tickerFunc(t));
    this.mediaRecorder.start();
    this.mediaRecorder.addEventListener('dataavailable', event => {
      self.audioChunks.push(event.data);
    });
    this.mediaRecorder.addEventListener('stop', () => {
      const audioBlob = new Blob(self.audioChunks);
      this.upload(audioBlob);
    });
    this.start$.next();
  }
  public stop(): void {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.timerSub.unsubscribe();
    this.stop$.next();
  }
  public initialize(): MediaRecorderService {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.initialize$.next();
      })
      .catch(err => {
        this.initialize$.error('No mic for you!');
      });
    return this;
  }
  public upload(blob: Blob): void {
    this.upload$.next();
  }
  tickerFunc(tick) {
    console.log('tick');
    this.ticks = tick;
  }
  constructor() {}
}
