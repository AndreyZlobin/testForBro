import {
  Component,
  Input,
  TemplateRef,
  EventEmitter,
  Output,
  OnInit,
} from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { LanguageService } from "../../../../../services/language.service";

@Component({
  selector: "app-setup-stopwords",
  templateUrl: "./setup-stopwords.component.html",
  styleUrls: ["./setup-stopwords.component.scss"],
})
export class SetupStopwordsComponent implements OnInit {
  public isLoading: boolean = true;
  public hasChanges: boolean = false;

  @Output() changed = new EventEmitter<any>();
  @Input() showMessage = false;
  @Input() postDate: string = "";
  @Output() launch = new EventEmitter<any>();
  modalRef: BsModalRef;
  public rules: any[] = [];
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.organizationSettingsService
      .getStopwordsSettings()
      .subscribe((data) => {
        if (data && data.settings) {
          this.rules = data.settings.keyword;
          this.isLoading = false;
        }
      });
  }

  t(v) {
    return LanguageService.t(v);
  }

  public save() {
    this.isLoading = true;
    this.hasChanges = false;
    this.rules = this.rules.map((rule) => {
      const keywords = rule.keywords.map((v) => v.value || v);
      return {
        result: rule.result,
        keywords: keywords,
        color: rule.color,
        duration: rule.duration,
      };
    });
    this.organizationSettingsService
      .updateSettings("keyword", this.rules)
      .subscribe((data) => {
        this.isLoading = false;
        this.changed.emit({ changed: this.hasChanges });
      });
  }

  public onItemAdd(tag, index): void {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges });
  }

  onItemRemove(tag, index): void {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges });
  }

  removeRule(index) {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges });
    this.rules = this.rules.filter((v, i) => i !== index);
  }
  addRule() {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges });
    this.rules.push({ result: "", keywords: [], duration: "", color: "black" });
  }

  resetToDefaultRule(i) {
    this.rules[i].duration = "";
    this.rules[i].color = "";
    this.hasChanges = true;
  }

  changeControls() {
    this.hasChanges = true;
  }

  public launchRedo(): void {
    this.modalRef.hide();
    this.launch.emit();
  }

  public decline(): void {
    this.modalRef.hide();
  }
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }
}
