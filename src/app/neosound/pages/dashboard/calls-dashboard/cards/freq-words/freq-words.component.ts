import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { ChartDataService } from "../../services/chart-data.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-freq-words",
  templateUrl: "./freq-words.component.html"
})
export class FreqWordsComponent implements OnInit, OnDestroy {
  freqWords: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: ChartDataService,
    private userData: DataService
  ) {
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.popularWords) {
        this.freqWords = data.popularWords
          .map(item => {
            return {
              name: item.text,
              value: item.weight
            };
          })
          .sort((a, b) => b.value - a.value);
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    });
  }
  ngOnInit() {}
  ngOnDestroy() {
    if (this.dataSub1) {
      this.dataSub1.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
}
