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
import { UploadService } from "../../../services/upload.service";
import { AnalyticsService } from "../../../services/analytics.service";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { timer, Subscription } from "rxjs";
import { UploadEvent, UploadFile } from "ngx-file-drop";
import { LanguageService } from "../../../services/language.service";


@Component({
  selector: "ngx-upload-progress",
  templateUrl: "./upload-progress.component.html",
  styleUrls: ["./upload-progress.component.scss"]
})
export class UploadProgressComponent {
  minimized: boolean = true;
  constructor(
    private userService: UsersService,
    private router: Router,
    private modalService: BsModalService,
    private filesService: FilesService,
    private analyticsService: AnalyticsService,
    private uploadService: UploadService
  ) {}

  t(v) {
    return LanguageService.t(v);
  }
}
