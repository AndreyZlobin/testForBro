import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { LanguageService } from "../../../../../services/language.service";
import { DragulaService } from "ng2-dragula";

@Component({
  selector: "app-check-list",
  templateUrl: "./check-list.component.html",
  styleUrls: ["./check-list.component.scss"]
})
export class CheckListComponent implements OnInit {
  public isLoading: boolean = true;
  public checklist: any[] = [];
  @Output() changed = new EventEmitter<boolean>();
  public setting: any = {};
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private dragulaService: DragulaService
  ) {
    // dragulaService.createGroup("HANDLES", {
    //   moves: (el, container, handle) => {
    //     return handle.className === "handle";
    //   }
    // });
  }

  ngOnInit() {
    this.organizationSettingsService.getChecklistSettings().subscribe(data => {
      if (data && data.settings && data.settings.checklist) {
        this.isLoading = false;
        this.checklist = data.settings.checklist;
      }
    });
  }

  t(v) {
    return LanguageService.t(v);
  }

  public save() {
    this.isLoading = true;
    debugger;
    this.organizationSettingsService
      .updateSettings("checklist", this.checklist)
      .subscribe(data => {
        this.isLoading = false;
      });
  }

  addQuestion(): void {
    this.checklist.push({
      q: "Enter text",
      as: ["Yes", "No"]
    });
  }
  removeQuestion(index: number): void {
    this.checklist = this.checklist.filter((v, i) => i !== index );
  }
  onChange(value: string, i: number) {
    this.checklist[i].q = value;
  }
}
