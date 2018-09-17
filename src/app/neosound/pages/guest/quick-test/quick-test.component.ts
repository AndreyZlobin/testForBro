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
  successMessage = "";
  isPlaying = false;
  fileBlob;
  audio: any;

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
    });
  }

  ngOnInit() {
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
    this.audio.pause();
    this.isPlaying = false;
  }

  stop() {
    this.mediaRecorderService.stop();
  }

  discard() {
    this.mediaRecorderService.reset();
    this.currentFileParams = undefined;
  }

  attach() {
    this.upload(this.fileBlob);
    this.hideModal();
  }

  upload(record) {
    const uploadFile = new FormData();
    const name = `${makeId()}.wav`;
    const file = new File([record], name, {
      type: `audio/wav`,
    });
    this.currentFileParams = {
      batchid: 1,
      name,
      file,
    };
    console.log(name);
    uploadFile.append("batchid", "1");
    uploadFile.append("username", "fronttrust");
    uploadFile.append("file", file);
    this.filesService.uploadFile(uploadFile).subscribe(res => {
    });
  }

  gotoResults() {
    this.router.navigateByUrl("/guest/results");
    return false;
  }

  showModal(ref, modalType, newModal = true) {
    this.successMessage = "";
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
    this.files = event.files[0];
    const uploadFile = new FormData();
    uploadFile.append("batchid", "1");
    uploadFile.append("username", "fronttrust");
    uploadFile.append("file", event.files[0]);

    this.filesService.uploadFile(uploadFile).subscribe(res => {
    });
    // for (const item of event.files) {
    //   const file = item as any;
    //   file.fileEntry.file(info => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(info);
    //     reader.onload = () => {
    //       const params = {
    //         batchid: "1",
    //         filename: info.name,
    //         base64string: reader.result
    //       };
    //       this.currentFileParams = params;
    //       console.log(this.currentFileParams);
    //       this.filesService.uploadFile(params).subscribe(res => {
    //         this.successMessage =
    //           "Successfully uploaded to the server: " +
    //           this.currentFileParams.filename;
    //       });
    //     };
    //     reader.onerror = error => {
    //       console.log("Error: ", error);
    //       this.successMessage = "";
    //     };
    //   });
    // }
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }
}
