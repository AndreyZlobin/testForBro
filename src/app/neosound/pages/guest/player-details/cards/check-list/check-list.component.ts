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
import { FilesService } from "../../../../../services/files.service";

@Component({
  selector: "ngx-check-list",
  templateUrl: "./check-list.component.html"
})
export class CheckListFormComponent implements OnInit, OnDestroy {
  data: any[];
  dataSub: any;
  isLoading: boolean;

  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(public filesService: FilesService) {}
  ngOnInit() {}
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
  ngOnChanges(changes: SimpleChanges) {
    if (this.fileName && this.batchId) {
      this.filesService
        .getFileChecklist({
          batchid: this.batchId,
          filename: this.fileName
        })
        .subscribe(data => {
          if (data && data.result) {
            this.data = data.result;
          } else {
            this.data = null;
          }
        });
    }
  }

  isActive(question: any, answer: string) {
    return question.s.includes(answer);
  }

  setAnswer(index: number, answer: string) {
    this.data[index].s = [answer];
    this.data = [...this.data];
  }
  save() {
    this.filesService
      .updateFileChecklist({
        batchid: this.batchId,
        filename: this.fileName,
        checklist: this.data
      })
      .subscribe();
  }
}
