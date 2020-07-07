import {
  Component,
  OnChanges,
  Input,
  ViewChild,
  ElementRef,
  TemplateRef,
  HostListener,
  EventEmitter,
  Output
} from "@angular/core";
import { OrganizationSettingsService } from "../../../../../services/organization-settings.service";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { LanguageService } from "../../../../../services/language.service";

@Component({
  selector: "app-keywords",
  templateUrl: "./keywords.component.html",
  styleUrls: ["./keywords.component.scss"]
})
export class KeywordsComponent implements OnChanges {
  @Input() nameSpace: string = '';
  @Input() descriptionLabel: string = '';
  @Input() totalLabel: string = '';
  @Input() showMessage = false;
  @Input() postDate: string = '';
  @Input() pluralLabel: string = '';

  @Output() changed = new EventEmitter<any>();
  @Output() launch = new EventEmitter<any>();

  @ViewChild('cvsUpload') cvsUpload: ElementRef;
  modalRef: BsModalRef;

  public isLoading: boolean = true;
  public setting: any = {};
  public tags: any[] = [];
  public initialLength: number = 0;
  public hasChanges: boolean = false;
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
    if (file && file.name && file.name.endsWith('.csv')) {
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = function() {
        const text = reader.result;
        let parsed = [...self.tags.map(i => i.value), ...self.csvtoArray(text)];
        parsed = parsed.filter(i => i && i.length > 0);
        const deduplicate = new Set(parsed);
        const result = Array.from(deduplicate).map(v => {
          return { value: v, display: v };
        });
        self.isLoading = false;
        self.hasChanges = true;
        self.changed.emit({changed: self.hasChanges});
        self.tags = result.sort((a, b) => a.value.localeCompare(b.value));
        self.cvsUpload.nativeElement.value = '';
      };
      reader.readAsText(file);
    }
  }

  private exportAsCsv() {
    let data = [this.nameSpace];
    data.push(...this.tags.map(i => `"${i.value}"`));
    let content = data.join(",\n");
    this.download(content, 'template.csv', 'text/csv;encoding:utf-8');
  }

  private download(content, fileName, mimeType) {
    let a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(
        new Blob([content], {
          type: mimeType
        }),
        fileName
      );
    } else if (URL && 'download' in a) {
      a.href = URL.createObjectURL(
        new Blob([content], {
          type: mimeType
        })
      );
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href =
        'data:application/octet-stream,' + encodeURIComponent(content);
    }
  }

  private csvtoArray(text) {
    const a = text.split(/\r?\n|\r/);
    return a
      .map(v => v.replace(/[\",\,,;]/gm, ''))
      .filter((value, index) => index !== 0 || value.length > 0);
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  public deleteAll(): void {
    this.modalRef.hide();
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
      .updateSettings(this.nameSpace, this.tags.map(i => i.value))
      .subscribe(data => {
        this.tags = this.tags.sort((a, b) => a.value.localeCompare(b.value));
        //{{tags.length - initialLength < 0 ? 'removed' : 'added'}}{{abs(tags.length - initialLength)}}
        this.toastrService.success(
          `${this.t('Just ')}
          ${this.tags.length - this.initialLength < 0 ? this.t('removed') : this.t('added')
          } ${this.t(this.pluralLabel)}: ${this.abs(
            this.tags.length - this.initialLength
          )}.
          <br>${this.t('This updated set of ')}${
            this.pluralLabel
          }${this.t(' will be applied automatically to all new uploaded calls')}`,
          this.t('Saved'),
          { timeOut: 10000, enableHtml: true }
        );
        this.isLoading = false;
        this.hasChanges = false;
        this.changed.emit({changed: this.hasChanges});
        this.initialLength = this.tags.length;
      });
  }
  public abs(v: number): number {
    return Math.abs(v);
  }

  public onItemAdd(tag): void {
    this.hasChanges = true;
    this.changed.emit({changed: this.hasChanges});
    let c = [];
    const tagVal = (tag && tag.value) || tag;
    if (tagVal === '') {
      return;
    }
    this.tags = this.tags.filter(a => a.value !== tagVal);
    const val = tagVal.split(',').map(v => v.trim());
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

    let buff = Array.from(deduplicate)
      .map(v => {
        return { value: v, display: v };
      })
      .sort((a, b) => a.value.localeCompare(b.value));
    this.tags = buff;
  }

  onItemRemove(tag): void {
    this.tags = this.tags.filter(t => t.value !== tag.value);
    this.hasChanges = true;
  }

  t(v) {
    return LanguageService.t(v);
  }
}
