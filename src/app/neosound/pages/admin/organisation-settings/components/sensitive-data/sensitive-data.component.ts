import { Component, OnInit } from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { LanguageService } from "../../../../../services/language.service";

@Component({
  selector: "app-sensitive-data",
  templateUrl: "./sensitive-data.component.html",
  styleUrls: ["./sensitive-data.component.scss"]
})
export class SensitiveDataComponent implements OnInit {
  public isLoading: boolean = true;
  public setting: any = {
    reductDictName: false,
    reductName: false,
    reductNumber: false,
  };
  constructor(
    private organizationSettingsService: OrganizationSettingsService
  ) {}

  ngOnInit() {
    this.organizationSettingsService
      .getSensitiveDataSettings()
      .subscribe(data => {
        if (data && data.settings) {
          this.setting = data.settings.sensitive;
          this.isLoading = false;
        }
      });
  }

  t(v) {
    return LanguageService.t(v);
  }

  public save() {
    this.isLoading = true;
    this.organizationSettingsService.updateSettings('sensitive', this.setting).subscribe((data) => {
      this.isLoading = false;
    });
  }
}
