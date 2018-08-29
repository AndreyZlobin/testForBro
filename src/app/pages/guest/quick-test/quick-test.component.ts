import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { MediaRecorderService } from '../../../services/media-recorder.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { timer } from 'rxjs/observable/timer';
import { Subscription } from 'rxjs/Subscription';

// Typesccript hack.
declare var MediaRecorder: any;

@Component({
  selector: 'app-quick-test',
  templateUrl: './quick-test.component.html',
  styleUrls: ['./quick-test.component.scss']
})
export class QuickTestComponent implements OnInit {
  form: FormGroup;
  error = '';
  modalRef: BsModalRef;
  modalType: string = 'upload';
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
    private mediaRecorderService: MediaRecorderService
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  record() {
    this.mediaRecorderService.initialize().start();
  }

  stop() {
    this.mediaRecorderService.stop();
  }
  upload(ref) {}

  gotoResults() {
    this.router.navigateByUrl('/guest/results');
  }

  showModal(ref, modalType) {
    this.modalType = modalType;
    this.modalRef = this.modalService.show(ref, { class: 'modal-lg modal-xl' });
  }

  hideModal() {
    this.modalRef.hide();
  }

  submit() {
    // todo: do something with form data
    this.error = '';
    const params = {
      username: this.form.value.username,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email
    };
    this.userService.createUser(params).subscribe(() => this.router.navigateByUrl('/'));
  }

  private createForm() {
    this.form = new FormGroup({
      emotion: new FormControl({ value: '' }, Validators.required),
      age: new FormControl({ value: '' }),
      gender: new FormControl({ value: '' })
    });
    this.patchForm();
  }

  patchForm() {
    if (this.form) {
      this.form.setValue({
        emotion: 'anger',
        age: false,
        gender: false
      });
    }
  }
}
