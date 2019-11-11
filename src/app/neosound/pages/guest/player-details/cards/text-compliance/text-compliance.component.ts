import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileTextStatsService } from "../../services/file-text-stats.service";

@Component({
  selector: "ngx-text-compliance",
  templateUrl: "./text-compliance.component.html",
})
export class TextComplianceComponent implements OnChanges, OnDestroy {
  missWord: any[];
  missWordNotFound: any[];
  compliance: string;
  dataSub: any;
  hasData: boolean = false;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    private fileTextStatsService: FileTextStatsService,
  ) {
    this.dataSub = this.fileTextStatsService.fileInfo.subscribe(data => {
      this.missWord = data.missWord;
      this.missWordNotFound = data.missWordNotFound;
      this.compliance = data.compliance;
      this.hasData = true;
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
