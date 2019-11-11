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
  selector: "ngx-full-text",
  templateUrl: "./full-text.component.html",
})
export class FullTextComponent implements OnChanges, OnDestroy {
  data: any[];
  dataSub: any;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    private fileTextStatsService: FileTextStatsService,
    private toastrService: ToastrService
  ) {
    this.dataSub = this.fileTextStatsService.fileInfo.subscribe(data => {
      this.data = data.text;
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
  copyToClipboard(text: string): void {
    const selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = text.replace(/(<([^>]+)>)/gi, "");
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    this.toastrService.info("Copied!");
  }
}
