import { Component, OnInit } from "@angular/core";
import { OrganizationSettingsService } from "../../../services/organization-settings.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-organization-settings",
  templateUrl: "./organization-settings.component.html",
  styleUrls: ["./organization-settings.component.scss"]
})
export class OrganizationSettingsComponent implements OnInit {
  public items: any[] = [
    {
      name: "Setup Keywords",
      key: "keywords"
    },
    {
      key: "sensitive-data",
      name: "Setup Sensitive Data"
    }
  ];
  public activeItem: string = "keywords";
  public unsavedLabel: string = "";
  public hasUnsaved: boolean = false;
  public showMessage: boolean = false;
  public postDate: any;
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.checkStatus();
  }

  setView(view: string): void {
    this.checkStatus();
    if (this.hasUnsaved) {
      if (
        confirm(
          `You have unsaved ${this.unsavedLabel}s If you leave, your changes will be lost.`
        )
      ) {
        this.activeItem = view;
      }
    } else {
      this.activeItem = view;
    }
  }
  checkStatus() {
    this.organizationSettingsService.getRedoKeywordsStatus().subscribe(res => {
      if (res && res.data && res.data.postDate) {
        this.showMessage = true;
        this.postDate = res.data.postDate;
      } else {
        this.showMessage = false;
        this.postDate = "";
      }
    });
  }
  changeTab() {
    this.checkStatus();
  }
  public launch(): void {
    this.organizationSettingsService.launchRedo().subscribe((res: any) => {
      if (res && res.error) {
        this.toastrService.error(res.error.message, res.error.code);
        this.checkStatus();
      } else {
        this.showMessage = true;
        this.postDate = Date.now().toString();
        this.checkStatus();
      }
    });
  }

  onChange($event) {
    this.hasUnsaved = $event.changed;
    this.unsavedLabel = $event.name;
  }
}
