import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "../../../services/users.service";
import { FilesService } from "../../../services/files.service";
import { MediaRecorderService } from "../../../services/media-recorder.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { timer, Subscription } from "rxjs";
import { UploadEvent, UploadFile } from "ngx-file-drop";

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
  selector: "app-quick-test",
  templateUrl: "./quick-test.component.html",
  styleUrls: ["./quick-test.component.scss"]
})
export class QuickTestComponent implements OnInit {
  batchid = '1';
  form: FormGroup;
  error = "";
  modalRef: BsModalRef;
  modalType: string = "upload";
  ticks = 0;
  private isRecording: boolean = false;
  private mediaRecorder: any;
  private audioChunks: any[] = [];
  private ticker;
  private sub: Subscription;
  public files: UploadFile[] = [];
  currentFileParams;
  successMessage = '';
  isPlaying = false;
  fileBlob;
  audio: any;
  attached = false;
  uploaded = false;

  constructor(
    private userService: UsersService,
    private router: Router,
    private modalService: BsModalService,
    private mediaRecorderService: MediaRecorderService,
    private filesService: FilesService,
  ) {
    this.sub = this.mediaRecorderService.stop$.subscribe(record => {
      // this.upload(record);
      this.fileBlob = record;
      const name = `${this.getFormattedTime()}.wav`;
      const file = new File([record], name, {
        type: `audio/wav`,
      });
      this.currentFileParams = {
        batchid: this.batchid,
        name,
        file,
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
    return y + '-' + m + '-' + d + '_' + h + ':' + mi + ':' + s;
}

  ngOnInit() {
    this.discard();
    this.createForm();
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
    this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
    });
    this.audio.addEventListener('ended', () => {
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
    this.files = [];
    this.attached = false;
    this.uploaded = false;
  }

  attach() {
    this.stopPlaying();
    this.upload(this.fileBlob);
    this.hideModal();
    this.attached = true;
  }

  upload(record) {
    const uploadFile = new FormData();
    const user = this.userService.getUserLocal();
    const username = user && user.username || 'fronttrust';

    console.log(this.currentFileParams);
    uploadFile.append('batchid', this.batchid);
    uploadFile.append('username', username);
    uploadFile.append('file', this.currentFileParams.file);
    this.filesService.uploadFile(uploadFile).subscribe(res => {
      this.uploaded = true;
      this.successMessage =
              'Successfully uploaded to the server: ' +
              this.currentFileParams.name;
    });
  }

  gotoResults() {
    this.stopPlaying();
    const params = {
      'batchid': this.batchid,
      'filename': this.currentFileParams.name,
    };
    this.filesService.setQuickFileParams(params);
    this.filesService.processFile(params).subscribe(v => {
      this.router.navigateByUrl('/guest/results');
    });
    return false;
  }

  showModal(ref, modalType, newModal = true) {
    this.successMessage = '';
    this.modalType = modalType;
    if (newModal) {
      this.hideModal();
      this.modalRef = this.modalService.show(ref, {
        class: "modal-lg modal-xl"
      });
    }
  }

  hideModal() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  submit() {
    // todo: do something with form data
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
    this.files = event.files;
    // const uploadFile = new FormData();
    // uploadFile.append("batchid", "1");
    // uploadFile.append("username", "fronttrust");
    // uploadFile.append("file", event.files[0]);

    // this.filesService.uploadFile(uploadFile).subscribe(res => {
    // });
    for (const item of event.files) {
      const file = item as any;
      file.fileEntry.file(currentFile => {
        const reader = new FileReader();
        reader.readAsDataURL(currentFile);
        reader.onload = () => {
          const params = {
            batchid: this.batchid,
            name: currentFile.name,
            file: currentFile, // reader.result,
          };
          // this.fileBlob = reader.result;
          this.currentFileParams = params;
          // const uploadFile = new FormData();
          // uploadFile.append("batchid", "1");
          // uploadFile.append("username", "fronttrust");
          // uploadFile.append("file", currentFile);
          this.fileBlob = currentFile;
          // this.filesService.uploadFile(uploadFile).subscribe(res => {
          //   this.successMessage =
          //     'Successfully uploaded to the server: ' +
          //     this.currentFileParams.name;
          // });
          // console.log(this.currentFileParams, currentFile);
          // this.filesService.uploadFile(params).subscribe(res => {
          //   this.successMessage =
          //     "Successfully uploaded to the server: " +
          //     this.currentFileParams.filename;
          // });
        };
        reader.onerror = error => {
          console.log('Error: ', error);
          this.successMessage = '';
        };
      });
    }
  }

  public handleFileInput(files: FileList) {
    const params = {
      batchid: this.batchid,
      name: files.item(0).name,
      file: files.item(0),
    };
    this.currentFileParams = params;
    this.fileBlob = files.item(0);
    this.files.push(files.item(0) as any);
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }
}
