import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-organization-settings",
  templateUrl: "./organization-settings.component.html",
  styleUrls: ["./organization-settings.component.scss"]
})
export class OrganizationSettingsComponent implements OnInit {
  items: any[] = [
    {
      name: "Setup Keywords",
      key: "keywords"
    },
    {
      key: "sensitive-data",
      name: "Setup Sensitive Data"
    }
  ];
  activeItem: string = "keywords";
  constructor() {}

  ngOnInit() {}

  setView(view: string): void {
    this.activeItem = view;
  }
}
