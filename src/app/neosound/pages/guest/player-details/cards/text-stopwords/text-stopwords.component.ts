import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { FileResultService } from "../../services/file-result.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "ngx-text-stopwords",
  templateUrl: "./text-stopwords.component.html"
})
export class TextStopwordsComponent implements OnInit, OnDestroy {
  data: any[];
  dataSub: any;
  isLoading: true;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(private fileResultService: FileResultService) {
    this.dataSub = this.fileResultService.fileResult.subscribe(data => {
      this.data = data.keywords;
      this.isLoading = data.isLoading;
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
}
