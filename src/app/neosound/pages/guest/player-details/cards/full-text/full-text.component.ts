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
  selector: "ngx-full-text",
  templateUrl: "./full-text.component.html"
})
export class FullTextComponent implements OnInit, OnDestroy {
  data: any[];
  isLoading: boolean = true;
  dataSub: any;
  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  constructor(
    private fileResultService: FileResultService,
    private toastrService: ToastrService
  ) {
    this.dataSub = this.fileResultService.fileResult.subscribe(data => {
      this.isLoading = data.isLoading;
      if(data.isLoading) {
        this.data = null;
      } else {
        this.data = data.sttfulltext;
      }
    });
  }
  ngOnInit() {
    this.fileResultService.getResult(
      this.batchId,
      this.fileName
    );
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
