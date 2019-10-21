import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "../../../services/users.service";
import { FilesService } from "../../../services/files.service";
import { MediaRecorderService } from "../../../services/media-recorder.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { timer, Subscription } from "rxjs";
import { UploadEvent, UploadFile } from "ngx-file-drop";
import { LanguageService } from "../../../services/language.service";
import { UploadService } from "../../../services/upload.service";
import { TextFilterService } from "../../../services/text-filter.service";
import { FilterService } from "../../../services/filter.service";

const makeId = () => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

@Component({
  selector: "ngx-upload-dialog",
  templateUrl: "./upload-dialog.component.html",
  styleUrls: ["./upload-dialog.component.scss"]
})
export class UploadDialogComponent implements OnInit, OnDestroy {
  batchid = "1";
  form: FormGroup;
  error = "";
  modalRef: BsModalRef;
  modalType: string = "record";
  ticks = 0;
  private isRecording: boolean = false;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private ticker;
  private sub: Subscription;
  public files: any[] = [];
  currentFileParams;
  successMessage = "";
  errorMessage = "";
  isPlaying = false;
  fileBlob;
  audio: any;
  attached = false;
  uploaded = false;
  proccessed = false;
  batches: string[] = [];
  textBatches: string[] = [];
  count = 20;
  intervalRef;
  filename;
  selectedBatchId: string;

  fileNames: string[] = [];
  @ViewChild("templateModal") templateModal: ElementRef;
  @ViewChild("confirmModal") confirmModal: ElementRef;
  @Input() set showDialog(visible) {
    if (visible) {
      setTimeout(() => this.showModal(this.templateModal, "record"), 0);
    } else {
      this.hideModal();
      this.discard();
    }
  }
  @Output() modalOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private userService: UsersService,
    private router: Router,
    private modalService: BsModalService,
    private mediaRecorderService: MediaRecorderService,
    private filesService: FilesService,
    private textFilterService: TextFilterService,
    private filterService: FilterService,
    private uploadService: UploadService
  ) {
    this.sub = this.mediaRecorderService.stop$.subscribe(record => {
      this.fileBlob = record;
      const name = (this.filename = `${this.getFormattedTime()}.wav`);
      const file = new File([record], name, {
        type: `audio/wav`
      });
      this.currentFileParams = {
        batchid: this.batchid,
        name,
        file
      };
    });
  }

  getFormattedTime() {
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    const h = today.getHours();
    const mi = today.getMinutes();
    const s = today.getSeconds();
    return y + "-" + m + "-" + d + "_" + h + ":" + mi + ":" + s;
  }

  ngOnInit() {
    this.discard();
    this.createForm();
    this.getBatches();
  }
  getBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.batches = data.batches;
      }
    });
  }
  getTextBatches() {
    this.filesService.listBatches().subscribe(data => {
      if (data && data.batches) {
        this.textBatches = data.batches;
      }
    });
  }
  record() {
    this.mediaRecorderService.initialize();
    this.mediaRecorderService.start();
  }

  play() {
    this.audio = new Audio();
    this.audio.src = URL.createObjectURL(this.fileBlob);
    this.audio.load();
    this.audio.play();
    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
    });
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
    });
    this.isPlaying = true;
  }

  stopPlaying() {
    this.audio && this.audio.pause();
    this.isPlaying = false;
  }

  stop() {
    this.mediaRecorderService.stop();
  }

  discard() {
    this.mediaRecorderService.reset();
    this.currentFileParams = undefined;
    this.selectedBatchId = '';
    this.files = [];
    this.fileNames = [];
    this.attached = false;
    this.uploaded = false;
    this.proccessed = false;
  }

  attach() {
    this.stopPlaying();
    this.filename &&
      (this.currentFileParams.name =
        this.filename.replace(".wav", "") + ".wav");
    this.upload(this.fileBlob);
    this.hideModal();
    this.attached = true;
    if (this.modalType !== "text") {
      this.router.navigateByUrl("/user/files");
    } else {
      this.router.navigateByUrl("/user/text-files");
    }
  }
  attachFiles() {
    this.uploadService.uploadFiles(this.selectedBatchId, this.files);
    this.discard();
    this.hideModal();
  }

  upload(record) {
    const uploadFile = new FormData();
    uploadFile.append("batchid", this.selectedBatchId || this.batchid);
    uploadFile.append("file", this.currentFileParams.file);
    this.filesService.uploadFile(uploadFile).subscribe(
      res => {
        this.uploaded = true;
        this.successMessage = "Successfully uploaded to the server.";
        if (this.modalType !== "text") {
          this.filesService.processFile(this.getFileParams()).subscribe(
            v => {
              this.proccessed = true;
              this.filterService.updateFileList();
            },
            e => (this.errorMessage = e.error.message)
          );
        } else {
          this.textFilterService.updateFileList();
        }
      },
      e => (this.errorMessage = e.error.message)
    );
  }

  getFileParams() {
    return {
      batchid: this.batchid,
      filename: this.currentFileParams.name
    };
  }

  gotoResults() {
    this.stopPlaying();
    const params = this.getFileParams();
    this.filesService.setQuickFileParams(params);
    this.router.navigateByUrl("/guest/results");
    return false;
  }

  showModal(ref, modalType, newModal = true) {
    debugger;
    this.successMessage = "";
    this.modalType = modalType;
    this.selectedBatchId = "";
    this.fileNames = [];
    this.files = [];
    if (newModal) {
      this.hideModal();
      this.modalRef = this.modalService.show(ref, {
        class: "modal-lg modal-xl"
      });
    }
  }

  hideModal() {
    if (this.modalRef) {
      this.modalOpened.emit(false);
      this.modalRef.hide();
    }
  }

  submit() {
    this.error = "";
    const params = {
      username: this.form.value.username,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email
    };
    this.userService
      .createUser(params)
      .subscribe(() => this.router.navigateByUrl("/"));
  }

  private createForm() {
    this.form = new FormGroup({
      emotion: new FormControl({ value: "" }, Validators.required),
      age: new FormControl({ value: "" }),
      gender: new FormControl({ value: "" })
    });
    this.patchForm();
  }

  patchForm() {
    if (this.form) {
      this.form.setValue({
        emotion: "anger",
        age: false,
        gender: false
      });
    }
  }

  public dropped(event: UploadEvent) {
    for (const item of event.files) {
      const file = item as any;
      file.fileEntry.file(currentFile => {
        this.fileNames.push(currentFile.name);
        this.files.push(currentFile);
      });
    }
  }

  public handleFileInput(files: FileList) {
    for (let i = 0; i !== files.length; i++) {
      console.log(files.item(i));
      this.fileNames.push(files.item(i).name);
      this.files.push(files.item(i));
    }
  }

  public fileOver(event) {}

  public fileLeave(event) {}

  getInfo() {
    this.count--;
    const params = this.getFileParams();
    this.filesService.listFileResults(params).subscribe(
      res => {
        if (this.count <= 0) {
          this.proccessed = true;
          clearInterval(this.intervalRef);
        }
      },
      e => (this.errorMessage = e.error.message)
    );
  }
  process(uploadModal) {
    this.modalRef.hide();
    this.discard();
    this.showModal(uploadModal, "upload", true);
  }
  interrupt(uploadModal) {
    this.modalRef.hide();
    this.showModal(uploadModal, "record", true);
  }
  ngOnDestroy() {
    this.stopPlaying();
  }

  t(v) {
    return LanguageService.t(v);
  }
}
