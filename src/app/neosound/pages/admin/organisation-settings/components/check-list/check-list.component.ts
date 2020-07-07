import { Component, OnInit, EventEmitter, Output, HostListener } from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { LanguageService } from "../../../../../services/language.service";
import { DragulaService } from "ng2-dragula";

@Component({
  selector: "app-check-list",
  templateUrl: "./check-list.component.html",
  styleUrls: ["./check-list.component.scss"]
})
export class CheckListComponent implements OnInit {
  @Output() changed = new EventEmitter<any>();
  public isLoading: boolean = true;
  public checklist: any[] = [];
  private hasChanges: boolean = false;
  public setting: any = {};
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private dragulaService: DragulaService
  ) {

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
    this.hasChanges = false;
    this.organizationSettingsService
      .updateSettings("checklist", this.checklist)
      .subscribe(data => {
        this.isLoading = false;
      });
  }

  addQuestion(): void {
    this.hasChanges = true;
    this.changed.emit({changed: this.hasChanges});
    this.checklist.push({
      q: "Enter text",
      as: ["Yes", "No"]
    });
  }
  removeQuestion(index: number): void {
    this.hasChanges = true;
    this.changed.emit({changed: this.hasChanges});
    this.checklist = this.checklist.filter((v, i) => i !== index );
  }
  onChange(value: string, i: number) {
    this.checklist[i].q = value;
    this.changed.emit({changed: this.hasChanges});
    this.hasChanges = true;
  }
}
