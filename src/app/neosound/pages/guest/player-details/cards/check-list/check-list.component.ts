import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild, TemplateRef, AfterViewInit, ElementRef, ChangeDetectorRef} from "@angular/core";
import {LanguageService} from "../../../../../services/language.service";
import {FilesService} from "../../../../../services/files.service";
import {FilterService} from "../../../../../services/filter.service";

@Component({
  selector: "ngx-check-list",
  templateUrl: "./check-list.component.html"
})
export class CheckListFormComponent implements OnInit, OnDestroy, AfterViewInit {
  data: any[];
  dataSub: any;
  isLoading: boolean = true;
  view: string = "assessment";
  comment: string;

  @Input("batchId") batchId: string;
  @Input("fileName") fileName: string;
  file: any;
  @ViewChild('commentTemplate') commentTemplate: ElementRef;
  commentValue = '';

  constructor(
    public filesService: FilesService,
    public filterService: FilterService,
    private cd: ChangeDetectorRef,
  ) {} 
  ngOnInit() {}
  ngAfterViewInit() {
    setTimeout(() => {
      this.commentTemplate && this.commentTemplate.nativeElement.addEventListener('blur', () => {
        this.saveComment();
      })
      this.commentTemplate && this.commentTemplate.nativeElement.addEventListener('keyup', () => {
        this.commentValue = this.commentTemplate.nativeElement.innerHTML.replace(/\n/g, '<br />');
      });
    }, 0);
  }
  ngOnDestroy() {
    if (this.dataSub) {
      this.dataSub.unsubscribe();
    }
  }
  t(v) {
    return LanguageService.t(v);
  }
  getDateVal(val) {
    const d = new Date(1, 1, 1);
    d.setMilliseconds(val * 1000);
    return d;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.data = null;
    this.comment = null;
    this.isLoading = true;
    if (this.fileName && this.batchId) {
      this.filesService
        .getFileChecklist({
          batchid: this.batchId,
          filename: this.fileName
        })
        .subscribe(data => {
          this.isLoading = false;
          if (data && data.result) {
            this.data = data.result;
          } else {
            this.data = null;
          }
        });
      this.filterService.files.subscribe(() => {
        this.file = this.filterService.getFile(this.batchId, this.fileName);
        const comment =
          this.file.comment.length > 0 ? this.file.comment[0].text : "";
        this.commentTemplate.nativeElement.innerHTML = comment;
        this.comment = comment;
        this.cd.detectChanges();
      });
      this.file = this.filterService.getFile(this.batchId, this.fileName);
      const comment =
        this.file.comment.length > 0 ? this.file.comment[0].text : "";
      this.commentTemplate.nativeElement.innerHTML = comment;
      this.comment = comment;
      this.cd.detectChanges();
    }
  }
  isActive(question: any, answer: string) {
    return !!question.s && question.s.includes(answer);
  }
  setAnswer(index: number, answer: string) {
    if (!this.data[index].s || !this.data[index].s.includes(answer)) {
      this.data[index].s = [answer];
      this.data = [...this.data];
    } else {
      delete this.data[index].s;
      this.data = [...this.data];
    }
  }
  save() {
    this.filesService
      .updateFileChecklist({
        batchid: this.batchId,
        filename: this.fileName,
        checklist: this.data
      })
      .subscribe();
    const index = this.filterService.getIndex(this.batchId, this.fileName);
    this.filterService.setAssessment(index, this.getAssessment(this.data));
  }
  getAssessment(data: any) {
    if (data) {
      const yes = data.filter(i => 's' in i && (i.s[0] === "Yes" || i.s[0] === "yes" || i.s[0] === "YES"));
      const answered_count = data.filter(i => 's' in i && i.s.length).length;
      return answered_count === 0 ? '-' : Math.round((yes.length / answered_count) * 100);
    }
    return 0;
  }
  saveComment() {
    const index = this.filterService.getIndex(this.batchId, this.fileName);
    this.filterService.setComment(index, this.commentValue);
    this.filesService
      .updateFileComment({
        fileid: {
          batchid: this.batchId,
          fileid: this.fileName
        },
        fileinfo: {
          comment: [
            {
              text: this.commentValue
            }
          ]
        }
      })
      .subscribe();
  }
  switchView(view: string) {
    this.isLoading = true;
    this.view = view;
    setTimeout(() => (this.isLoading = false), 1);
    this.cd.detectChanges();
  }
  reset() {
    this.data = null;
    this.filesService.resetFileChecklist().subscribe(res => {
      if (res && res.result) {
        const index = this.filterService.getIndex(this.batchId, this.fileName);
        this.data = res.result;
        this.filterService.setAssessment(index, this.getAssessment(this.data));
      }
    });
  }
}
