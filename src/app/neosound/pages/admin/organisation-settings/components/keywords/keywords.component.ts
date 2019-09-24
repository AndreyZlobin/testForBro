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

} from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import Tagify from '@yaireo/tagify';

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
  @Input() showMessage = false;
  @Input() postDate: string = "";

  @Output() changed = new EventEmitter<{ changed: boolean; name: string }>();
  @Output() launch = new EventEmitter<any>();

  @ViewChild("cvsUpload") cvsUpload: ElementRef;
  modalRef: BsModalRef;

  @ViewChild("tagsInput") tagsInput: ElementRef;

  @HostListener("window:beforeunload", ["$event"])
  unloadNotification($event: any) {
    if (this.hasChanges) {
      $event.returnValue = true;
    }
  }

  public isLoading: boolean = true;
  public setting: any = {};
  public tags: any[] = [];
  public initialLength: number = 0;
  public hasChanges: boolean = false;
  public tagify: any;
  constructor(
    private organizationSettingsService: OrganizationSettingsService,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {

  }

  ngOnChanges(changes: any) {
    if (changes.nameSpace) {
      this.organizationSettingsService
        .getKeyWordSettings(changes.nameSpace.currentValue)
        .subscribe(data => {
          this.isLoading = false;
          if (data && data.settings) {
            this.tags = data.settings[this.nameSpace].map(v => {
              return v;
            });
            this.initialLength = data.settings[this.nameSpace].length;
            setTimeout(() => {
              this.tagify = new Tagify(this.tagsInput.nativeElement, {});
              this.tagify.addTags(this.tags);
              this.tagify.on("add", this.onItemAdd.bind(this));
              this.tagify.on("remove", this.onItemRemove.bind(this));
            },0);
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
    if (file && file.name && file.name.endsWith(".csv")) {
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = function() {
        const text = reader.result;
        let parsed = [...self.tags.map(i => i.value), ...self.csvtoArray(text)];
        parsed = parsed.filter(i => i && i.length > 0);
        const deduplicate = new Set(parsed);
        const result = Array.from(deduplicate);
        self.isLoading = false;
        self.hasChanges = true;
        self.changed.emit({
          changed: self.hasChanges,
          name: self.singularLabel
        });
        self.tags = result.sort((a, b) => a.localeCompare(b));
        self.tagify.removeAllTags();
        self.tagify.addTags(self.tags);
        self.cvsUpload.nativeElement.value = "";
      };
      reader.readAsText(file);
    }
  }

  public exportAsCsv() {
    let data = [this.nameSpace];
    data.push(...this.tags.map(i => `"${i}"`));
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
    const a = text.split(/\r?\n|\r/);
    return a
      .map(v => v.replace(/[\",\,,;]/gm, ""))
      .filter((value, index) => index > 0 && value.length > 0);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: "modal-md" });
  }

  public deleteAll(): void {
    this.modalRef.hide();
    this.tagify.removeAllTags();
    this.tags = [];
    this.save();
  }

  public launchRedo(): void {
    this.modalRef.hide();
    this.launch.emit();
  }

  public decline(): void {
    this.modalRef.hide();
  }
  public save() {
    this.isLoading = true;
    this.organizationSettingsService
      .updateSettings(this.nameSpace, this.tags)
      .subscribe(data => {
        this.tags = this.tags.sort((a, b) => a.localeCompare(b));
        this.toastrService.success(
          `Just ${
            this.tags.length - this.initialLength < 0 ? "removed" : "added"
          } ${this.singularLabel}s: ${this.abs(
            this.tags.length - this.initialLength
          )}.
          <br>This updated set of ${
            this.singularLabel
          }s will be applied automatically to all new uploaded calls`,
          "Saved",
          { timeOut: 10000, enableHtml: true }
        );
        this.isLoading = false;
        this.hasChanges = false;
        this.changed.emit({
          changed: this.hasChanges,
          name: this.singularLabel
        });
        this.initialLength = this.tags.length;
      });
  }
  public abs(v: number): number {
    return Math.abs(v);
  }

  public onItemAdd(tag): void {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges, name: this.singularLabel });
    this.tags = this.tagify.value.map(i => i.value);
  }
  public onItemRemove(tag): void {
    this.hasChanges = true;
    this.changed.emit({ changed: this.hasChanges, name: this.singularLabel });
    this.tags = this.tagify.value.map(i => i.value);
  }
}
