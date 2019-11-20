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
}
