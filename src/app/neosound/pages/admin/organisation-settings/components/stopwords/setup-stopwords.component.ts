import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef,
  HostListener,
  EventEmitter,
  Output,
  OnInit,
} from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import { LanguageService } from "../../../../../services/language.service";

@Component({
  selector: "app-setup-stopwords",
  templateUrl: "./setup-stopwords.component.html",
  styleUrls: ["./setup-stopwords.component.scss"],
})
export class SetupStopwordsComponent implements OnInit {
  public isLoading: boolean = true;
  @Output() changed = new EventEmitter<boolean>();
  @Input() showMessage = false;
  @Input() postDate: string = '';
  @Output() launch = new EventEmitter<any>();

  public hasChanges: boolean = false;
  modalRef: BsModalRef;
  public rules: any[] = [];
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private modalService: BsModalService,
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
    this.rules =this.rules.map((rule) => {
      const keywords = rule.keywords.map(v => v.value || v)
      return {
        result: rule.result,
        keywords: keywords
      }
    })
    this.organizationSettingsService
      .updateSettings("keyword", this.rules)
      .subscribe((data) => {
        this.isLoading = false;
      });
  }

  public onItemAdd(tag, index): void {
    let c = [];
    const tagVal = (tag && tag.value) || tag;
    if (tagVal === "") {
      return;
    }
    this.rules[index].keywords = this.rules[index].keywords.filter(
      (a) => a.value !== tagVal
    );
    const val = tagVal.split(",").map((v) => v.trim());
    val.map((v) =>
      c.push({
        value: v,
        display: v,
      })
    );
    let deduplicate = new Set([
      ...this.rules[index].keywords.map((i) => i.value),
      ...c.map((i) => i.value),
    ]);
  }

  onItemRemove(tag, index): void {
    this.rules[index].keywords = this.rules[index].keywords.filter(
      (t) => t.value !== tag.value
    );
  }

  removeRule(index) {
    this.rules = this.rules.filter((v, i) => i !== index);
  }
  addRule() {
    this.rules.push({ result: "", keywords: [] });
  }
  public launchRedo(): void {
    this.modalRef.hide();
    this.launch.emit();
  }

  public decline(): void {
    this.modalRef.hide();
  }
  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
}
