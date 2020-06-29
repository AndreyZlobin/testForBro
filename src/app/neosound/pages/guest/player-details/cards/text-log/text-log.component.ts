import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  Output,
  OnInit,
  EventEmitter
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileResultService } from "../../services/file-result.service";

@Component({
  selector: "ngx-text-log",
  templateUrl: "./text-log.component.html"
})
export class TextLogComponent implements OnInit, OnDestroy {
  data: any[];
  dataSub: any;
  isLoading: boolean;
  greySpeaker: string = "S1";

  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  @Output() goToRegion = new EventEmitter<any>();
  @Input("height") height: string = '57vh';
  constructor(public fileResultService: FileResultService) {
    this.dataSub = this.fileResultService.fileResult.subscribe(data => {
      this.isLoading = data.isLoading;
      if(!data.isLoading) {
        this.data = data.emotions;
        this.greySpeaker = data.greySpeaker;
      } else {
        this.data = [];
      }
    });
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }
  emitEvent(time: any) {
    this.goToRegion.emit(time);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.fileName && this.batchId) {
      this.fileResultService.getResult(this.batchId, this.fileName);
    }
  }
  getFormatedTime(val: string): string {
    const time = parseFloat(val);
    if (time < 60) {
      if (time < 9) {
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
}
