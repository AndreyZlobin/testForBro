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
  loading: boolean = true;
  @Input() fileName: string;
  @Input() batchId: string;
  player: videojs.Player;
  options: any = {
    autoplay: false,
    controls: true,
    sources: [],
    fill: true,
  };
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
      this.filesService
        .getFile({
          batchid: this.batchId,
          filename: this.fileName,
        })
        .subscribe((data) => {
          this.loading = false;
          this.options.sources = [{ src: data.url, type: "video/mp4" }];
          this.player = videojs(this.target.nativeElement, this.options, () => {
            this.player.on("progress", () => {
              const time = this.player.currentTime();
              this.playerService.setActive(time);
            });
          });
        });
    }
  }

  init() {}
  public goToRegion(time: any) {
    this.player && this.player.currentTime(time);
  }
  play() {
    if (this.player.paused() === true) {
      this.player && this.player.play();
    } else {
      this.player && this.player.pause();
    }
  }
}
