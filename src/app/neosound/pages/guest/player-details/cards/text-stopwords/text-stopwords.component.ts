import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileTextStatsService } from "../../services/file-text-stats.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-text-stopwords",
  templateUrl: "./text-stopwords.component.html",
  providers: [FileTextStatsService]
})
export class TextStopwordsComponent implements OnChanges, OnDestroy {
  data: any[];
  dataSub: any;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    private fileTextStatsService: FileTextStatsService,
  ) {
    this.dataSub = this.fileTextStatsService.fileInfo.subscribe(data => {
      this.data = data.stopWords;
    });
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    this.fileTextStatsService.getFileEmotions(this.batchId, this.fileName);
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
}
