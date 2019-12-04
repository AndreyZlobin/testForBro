
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy
} from "@angular/core";
import { LanguageService } from "../../../../../services/language.service";
import { TopicCloudService } from "../../services/topic-cloud.service";
import { DataService } from "../../../../../shared";

@Component({
  selector: "ngx-topics",
  templateUrl: "./topics.component.html"
})
export class TopicComponent implements OnInit, OnDestroy {
  topics: any = 0;
  dataSub1: any;
  hasData: boolean = false;
  primaryColor: string;
  public zoomOptions = {
    scale: 1.3,
    transitionTime: 1.2,
    delay: 0.1
  };
  constructor(
    private dataService: TopicCloudService,
    private userData: DataService,
  ) {
    if (this.userData.config["colors"].secondary) {
      this.primaryColor = this.userData.config["colors"].secondary;
    } else {
      this.primaryColor = "#0098d9";
    }
    this.dataSub1 = this.dataService.data.subscribe(data => {
      if (data && data.topics) {
        this.topics = Object.keys(data.topics).map(key => {
          return {
            text: key,
            weight: data.topics[key]
          };
        });
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
