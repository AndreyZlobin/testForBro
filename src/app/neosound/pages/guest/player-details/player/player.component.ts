import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  HostListener
} from "@angular/core";
import { LanguageService } from "../../../../services/language.service";
import { WaveSurferService } from "./wave-surfer.service";


@Component({
  selector: "ngx-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"]
})
export class PlayerComponent implements OnDestroy, OnChanges {
  id: string;
  isLoading: boolean = true;
  playing: boolean = false;
  @HostListener("window:keyup", ["$event"])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 32) {
      event.preventDefault();
      event.stopPropagation();
      this.play();
    }
  }
  @Input() fileName: string;
  @Input() batchId: string;
  constructor(public waveSurferService: WaveSurferService) {}

  t(v) {
    return LanguageService.t(v);
  }

  play() {
    this.playing = !this.playing;
    this.waveSurferService.togglePlay();
  }

  ngOnDestroy() {
    if (this.fileName && this.batchId) {
      this.playing = false;
      this.waveSurferService.destroyAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.fileName && this.batchId) {
      this.playing = false;
      this.waveSurferService.init(this.id, this.batchId, this.fileName);
    }
  }

  seekTo(time: any) {
    this.waveSurferService.seekTo(time);
  }
}
