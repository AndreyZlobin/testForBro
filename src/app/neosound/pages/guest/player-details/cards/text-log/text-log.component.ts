import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LanguageService } from "../../../../../services/language.service";
import { FileEmotionsService } from "../../services/file-emotions.service";


@Component({
  selector: 'ngx-text-log',
  templateUrl: "./text-log.component.html",
  providers: [ FileEmotionsService ],
})
export class TextLogComponent implements OnChanges, OnDestroy {
  data: any[];
  dataSub: any;

  @Input('batchId') batchId: string;
  @Input('fileName') fileName: string;
  @Output() goToRegion = new EventEmitter<any>();
  constructor(public fileEmotionsService: FileEmotionsService) {
    this.dataSub = this.fileEmotionsService.fileInfo.subscribe((data) => {
      this.data = data.sentiments;
    });
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.fileEmotionsService.getFileEmotions(this.batchId, this.fileName);
  }
  ngOnDestroy() {
    if(this.dataSub) {
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