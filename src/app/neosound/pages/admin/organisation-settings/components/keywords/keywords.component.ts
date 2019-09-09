import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef
} from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-keywords",
  templateUrl: "./keywords.component.html",
  styleUrls: ["./keywords.component.scss"]
})
export class KeywordsComponent implements OnChanges {
  @Input() nameSpace: string = "";
  @Input() descriptionLabel: string = "";
  @Input() totalLabel: string = "";
  @Input() singularLabel: string = "";

  @ViewChild("cvsUpload") cvsUpload: ElementRef;
  modalRef: BsModalRef;

  public isLoading: boolean = true;
  public setting: any = {};
  public tags: any[] = [];
  public initialLength: number = 0;
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.nameSpace) {
      this.organizationSettingsService
        .getKeyWordSettings(changes.nameSpace.currentValue)
        .subscribe(data => {
          if (data && data.settings) {
            this.tags = data.settings[this.nameSpace].map(v => {
              return { value: v, display: v };
            });
            this.initialLength = data.settings[this.nameSpace].length;
            this.isLoading = false;
          }
        });
    }
  }
  fileImport() {
    this.cvsUpload.nativeElement.click();
  }

  handleFileInput(files: any[]) {
    const file = files[0];
    const self = this;
    if (file.name.endsWith(".csv")) {
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = function() {
        const text = reader.result;
        let parsed = [...self.tags.map(i => i.value), ...self.csvtoArray(text)];
        const deduplicate = new Set(parsed);
        const result = Array.from(deduplicate).map(v => {
          return { value: v, display: v };
        });
        self.isLoading = false;
        self.tags = result.sort((a, b) => a.value.localeCompare(b.value));
      };
      reader.readAsText(file);
    }
  }

  private exportAsCsv() {
    let data = [this.nameSpace];
    data.push(...this.tags.map(i => `"${i.value}"`));
    let content = data.join(",\n");
    this.download(content, "template.csv", "text/csv;encoding:utf-8");
  }

  private download(content, fileName, mimeType) {
    let a = document.createElement("a");
    mimeType = mimeType || "application/octet-stream";

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(
        new Blob([content], {
          type: mimeType
        }),
        fileName
      );
    } else if (URL && "download" in a) {
      a.href = URL.createObjectURL(
        new Blob([content], {
          type: mimeType
        })
      );
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href =
        "data:application/octet-stream," + encodeURIComponent(content);
    }
  }

  private csvtoArray(text) {
    const re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    const re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    const a = [];
    text.replace(re_value, (m0, m1, m2, m3) => {
      if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
      else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
      else if (m3 !== undefined) a.push(m3);
      return "";
    });
    if (/,\s*$/.test(text)) a.push("");

    return a.filter((value, index) => index !== 0 && value.length > 0);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  public deleteAll(): void {
    this.modalRef.hide();
    this.tags = [];
    this.save();
  }

  public launch(): void {
    this.modalRef.hide();
  }

  public decline(): void {
    this.modalRef.hide();
  }
  public save() {
    this.isLoading = true;
    this.organizationSettingsService
      .updateSettings(this.nameSpace, this.tags.map(i => i.value))
      .subscribe(data => {
        this.tags = this.tags.sort((a, b) => a.value.localeCompare(b.value));
        //{{tags.length - initialLength < 0 ? 'removed' : 'added'}}{{abs(tags.length - initialLength)}}
        this.toastrService.success(
          `Just ${
            this.tags.length - this.initialLength < 0 ? "removed" : "added"
          } ${this.singularLabel}s: ${this.abs(
            this.tags.length - this.initialLength
          )}. this updated set of ${
            this.singularLabel
          }s will be applied automatically to all new uploaded calls`,
          "Saved"
        );
        this.isLoading = false;
        this.initialLength = this.tags.length;
      });
  }
  public abs(v: number): number {
    return Math.abs(v);
  }

  public onItemAdd(tag): void {
    let c = [];
    const tagVal = (tag && tag.value) || tag;
    if (tagVal === "") {
      return;
    }
    const val = tagVal.split(",").map(v => v.trim());
    val.map(v =>
      c.push({
        value: v,
        display: v
      })
    );
    let deduplicate = new Set([
      ...this.tags.map(i => i.value),
      ...c.map(i => i.value)
    ]);

    this.tags = Array.from(deduplicate)
      .map(v => {
        return { value: v, display: v };
      })
      .sort((a, b) => a.value.localeCompare(b.value));
  }
}
