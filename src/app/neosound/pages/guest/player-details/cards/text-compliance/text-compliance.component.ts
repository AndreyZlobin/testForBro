import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileResultService } from "../../services/file-result.service";

@Component({
  selector: "ngx-text-compliance",
  templateUrl: "./text-compliance.component.html"
})
export class TextComplianceComponent implements OnInit, OnDestroy {
  missWord: any[];
  missWordNotFound: any[];
  compliance: string;
  dataSub: any;
  hasData: boolean = false;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private fileResultService: FileResultService) {
    this.dataSub = this.fileResultService.fileResult.subscribe(data => {
      this.missWord = data.misswords;
      this.missWordNotFound = data.misswordsNotFound;
      this.compliance = data.compliance;
      this.hasData = true;
    });
  }
  ngOnInit() {
    this.fileResultService.getResult(this.batchId, this.fileName);
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
