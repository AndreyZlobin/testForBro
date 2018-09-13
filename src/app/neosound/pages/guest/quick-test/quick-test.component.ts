import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UsersService } from "../../../services/users.service";
import { FilesService } from "../../../services/files.service";
import { MediaRecorderService } from "../../../services/media-recorder.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { timer, Subscription } from "rxjs";

function makeid() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

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

  constructor(
    private userService: UsersService,
    private router: Router,
    private modalService: BsModalService,
    private mediaRecorderService: MediaRecorderService,
    private filesService: FilesService
  ) {
    this.sub = this.mediaRecorderService.stop$.subscribe(record =>
      this.upload(record)
    );
  }

  ngOnInit() {
    this.createForm();
  }

  record() {
    this.mediaRecorderService.initialize();
    this.mediaRecorderService.start();
  }

  stop() {
    this.mediaRecorderService.stop();
  }
  upload(record) {
    const params = {
      batchid: '1111',
      filename: `${makeid()}.wav`,
      base64string: record
    };
    this.filesService.uploadFile(params).subscribe(res => {
      debugger;
    });
  }

  gotoResults() {
    this.router.navigateByUrl("/guest/results");
  }

  showModal(ref, modalType) {
    this.modalType = modalType;
    this.modalRef = this.modalService.show(ref, { class: "modal-lg modal-xl" });
  }

  hideModal() {
    this.modalRef.hide();
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
}
