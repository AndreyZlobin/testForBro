import { Component, OnInit } from "@angular/core";

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
  constructor() {}

  ngOnInit() {}

  setView(view: string): void {
    if (this.hasUnsaved) {
      if (
        confirm(
          `You have unsaved ${this.unsavedLabel}s If you leave, your changes will be lost.`
        )
      ) {
        this.activeItem = view;
      }
    }
  }

  onChange($event) {
    this.hasUnsaved = $event.changed;
    this.unsavedLabel = $event.name;
  }
}
