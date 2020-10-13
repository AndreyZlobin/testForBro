
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-upload-instructions",
  templateUrl: "./upload-instructions.component.html"
})
export class UploadInstructionsComponent implements OnInit, OnDestroy {
  host: any = "";
  constructor(
    private userData: DataService,
    private lang: LanguageService,
  ) {
    if (this.userData.config["sFtpHost"]) {
      this.host = this.userData.config["sFtpHost"];
    }
  }
  ngOnInit() {}
  ngOnDestroy() {
  }
  t(v) {
    return LanguageService.t(v);
  }
  isEnglish() {
    return this.lang.checkLanguage("en");
  }

  isSpanish() {
    return this.lang.checkLanguage("sp");
  }
  isRussian() {
    return this.lang.checkLanguage("ru");
  }
  isPorto() {
    return this.lang.checkLanguage("pt");
  }
}
