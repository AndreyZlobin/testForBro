import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { LanguageService } from "../../../../services/language.service";
import { VideoFileInfoService } from "../services/video-file-info.service";
import { FilesService } from "../../../../services/files.service";
import videojs from "video.js";
import { PlayerService } from "../../../../services/player.service";
import { interval, Observable, Subject, timer } from "rxjs";

@Component({
  selector: "ngx-video-player",
  templateUrl: "./video-player.component.html",
  styleUrls: ["./video-player.component.scss"],
})
export class VideoPlayerComponent implements OnDestroy, OnChanges {
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (
      event.keyCode === 32 &&
      !(event.target as any).classList.contains("ng2-tag-input__text-input") &&
      !(event.target as any).classList.contains("border")
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.play();
    }
  }
  @ViewChild("target") target: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  loading: boolean = true;
  playing: boolean = false;
  @Input() fileName: string;
  @Input() batchId: string;
  player: videojs.Player;
  videoHeight: number;
  videoWidth: number;
  canvasHeight: number;
  canvasWidth: number;
  stopPlay$: Subject<any> = new Subject();
  aspectY: number;
  aspectX: number;
  options: any = {
    autoplay: false,
    controls: true,
    sources: [],
    fill: true,
  };
  colors: any = {
    face: "#0098d9",
    object: "#339ca8",
  };
  context: any;
  constructor(
    private videoFileInfoService: VideoFileInfoService,
    private filesService: FilesService,
    private playerService: PlayerService
  ) {}

  t(v) {
    return LanguageService.t(v);
  }
  ngOnDestroy() {
    if (this.fileName && this.batchId) {
      if (this.player) {
        this.player.dispose();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.fileName && this.batchId) {
      this.loading = true;
      if (this.player) {
        this.player.dispose();
      }
      this.videoFileInfoService.getInfo(this.batchId, this.fileName);
      this.filesService
        .getFile({
          batchid: this.batchId,
          filename: this.fileName,
        })
        .subscribe((data) => {
          if (data) {
            this.loading = false;
            const meta =
              data.metadata && data.metadata.resolution.split("x");
            this.videoWidth = parseInt(meta[0]);
            this.videoHeight = parseInt(meta[1]);
            this.canvasHeight = this.canvas.nativeElement.clientHeight;
            this.canvasWidth = this.canvas.nativeElement.clientWidth;
            this.aspectY =  this.canvasHeight / this.videoHeight;
            this.aspectX =  this.canvasWidth / this.videoWidth;

            console.log(this.canvasWidth, this.canvasHeight);
            this.options.sources = [{ src: data.url, type: "video/mp4" }];
            this.player = videojs(
              this.target.nativeElement,
              this.options,
              () => {
                this.player.on("timeupdate", () => {
                  const time = this.player.currentTime();
                  this.processFrames(time);
                  this.playerService.setActive(time);
                });
                this.player.on("ready", () => {
                  this.context = this.canvas.nativeElement.getContext("2d");
                });
              }
            );
          }
        });
    }
  }

  init() {}
  public goToRegion(time: any) {
    this.player && this.player.currentTime(time);
  }
  processFrames(time: any) {
    const frame = this.videoFileInfoService.getFrame(time);
    this.drawFrame(frame);
  }

  getFormatedTime(time: number): string {
    if (time < 60) {
      if (time < 10) {
        return `00:0${Math.ceil(time)}`;
      } else {
        return `00:${Math.ceil(time)}`;
      }
    } else {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time - minutes * 60);
      let formatedSeconds = "";
      if (seconds < 10) {
        formatedSeconds = `0${seconds}`;
      } else {
        formatedSeconds = `${seconds}`;
      }
      if (minutes < 10) {
        return `0${minutes}:${formatedSeconds}`;
      } else {
        return `${minutes}:${formatedSeconds}`;
      }
    }
  }

  drawFrame(frame: any) {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    frame &&
      frame.objects &&
      frame.objects.forEach((obj) => {
        const coords = obj && obj.location && obj.location.split(":");
        const name = obj && obj.name;
        const type = obj && obj.type;
        if (coords) {
          const x = parseInt(coords[0]) * this.aspectX / 2.8;
          const y = parseInt(coords[1]) * this.aspectY / 2.8;

          this.context.beginPath();
          this.context.lineWidth = 1;
          this.context.strokeStyle = this.colors[type];
          this.context.rect(x, y, 50, 50);

          this.context.stroke();
          if (name) {
            this.context.beginPath();
            this.context.fillStyle = this.colors[type];
            this.context.fillRect(x, y, 50, 10);
            this.context.stroke();
            this.context.beginPath();
            this.context.font = "7px Roboto";
            this.context.fillStyle = "black";
            this.context.textAlign = "center";
            this.context.fillText(name, x + 25, y + 5);
            this.context.stroke();
          }
        }
      });
  }

  playOverlay() {
    // this.processFrames();
  }

  play() {
    if (this.player.paused() === true) {
      this.player && this.player.play();
      this.playing = true;
      this.playOverlay();
    } else {
      this.player && this.player.pause();
      this.playing = false;
    }
  }
}
