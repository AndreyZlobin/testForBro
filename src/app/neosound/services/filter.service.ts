import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "./files.service";

@Injectable()
export class FilterService {
  topic = ["Technical issues", "Account balance", "Credit card"];
  public fileStore: any = [];
  private filesSubject = new BehaviorSubject<any[]>([]);
  public files = this.filesSubject.asObservable();
  public pagecount: number;
  public totalcount: number;
  public lastFileId: string;
  public isLoading: boolean = false;
  public label: string = "";
  public filter: {
    uploadDate;
    angerfrom;
    angerto;
    keywordsContain: any;
    keywordsNotContain: any;
    tagsContain: any;
    pauseAvgFrom;
    pauseAvgTo;
    pauseDurFrom;
    pauseDurTo;
    callfrom;
    callto;
    page;
    batchid;
    batchidAll: boolean;
    datefromAll: boolean;
    datetoAll: boolean;
    angerfromAll: boolean;
    angertoAll: boolean;
    pausefromAll: boolean;
    pausetoAll: boolean;
    stopOnly: boolean;
    noStop: boolean;
    stopwordLooking: string;
    missingOnly: boolean;
    noMissing: boolean;
    favoriteOnly: boolean;
    noFavorite: boolean;
    filename: string;
    itemsn: number;
    pagen: number;
    sortby: string;
    sortorder: string;
    sentimentTrend: string;
    topics: string;
    tagsOnly: boolean;
    noTags: boolean;
    checklistOnly: boolean;
    noChecklist: boolean;
    commentsOnly: boolean;
    noComments: boolean;
  } = {
    uploadDate: null,
    angerfrom: null,
    angerto: null,
    keywordsContain: null,
    keywordsNotContain: null,
    tagsContain: null,
    pauseAvgFrom: null,
    pauseAvgTo: null,
    pauseDurFrom: null,
    pauseDurTo: null,
    callfrom: null,
    callto: null,
    page: 0,
    batchid: null,
    batchidAll: true,
    datefromAll: true,
    datetoAll: true,
    angerfromAll: true,
    angertoAll: true,
    pausefromAll: true,
    pausetoAll: true,
    stopOnly: null,
    noStop: null,
    stopwordLooking: "Everywhere",
    sentimentTrend: null,
    missingOnly: null,
    noMissing: null,
    favoriteOnly: false,
    noFavorite: false,
    filename: "",
    itemsn: 100,
    pagen: 1,
    sortby: "",
    sortorder: "",
    topics: "",
    tagsOnly: null,
    noTags: null,
    checklistOnly: null,
    noChecklist: null,
    commentsOnly: null,
    noComments: null
  };
  constructor(private filesService: FilesService) {}

  public getFilterParams(): any {
    const params = {
      itemsn: `${this.filter.itemsn}`,
      pagen: `${this.filter.pagen}`,
      batchid: (this.filter.batchid && "" + this.filter.batchid) || "",
      filename: this.filter.filename,
      datetimefrom: (this.filter.uploadDate && this.filter.uploadDate[0]) || "",
      datetimeto: (this.filter.uploadDate && this.filter.uploadDate[1]) || "",
      angervolfrom:
        this.filter.angerfrom == null ? "" : this.filter.angerfrom + "",
      angervolto:
        this.filter.angerto == null
          ? ""
          : this.filter.angerfrom && this.filter.angerfrom > this.filter.angerto
          ? "10000"
          : this.filter.angerto + "",
      pauseAvgFrom:
        this.filter.pauseAvgFrom == null ? "" : this.filter.pauseAvgFrom + "",
      pauseAvgTo:
        this.filter.pauseAvgTo == null
          ? ""
          : this.filter.pauseAvgFrom &&
            this.filter.pauseAvgFrom > this.filter.pauseAvgTo
          ? "10000"
          : this.filter.pauseAvgTo + "",
      pauseDurFrom:
        this.filter.pauseDurFrom == null ? "" : this.filter.pauseDurFrom + "",
      pauseDurTo:
        this.filter.pauseDurTo == null
          ? ""
          : this.filter.pauseDurFrom &&
            this.filter.pauseDurFrom > this.filter.pauseDurTo
          ? "10000"
          : this.filter.pauseDurTo + "",
      minutesfrom:
        this.filter.callfrom == null ? "" : this.filter.callfrom + "",
      minutesto:
        this.filter.callto == null
          ? ""
          : this.filter.callfrom && this.filter.callfrom > this.filter.callto
          ? "10000"
          : this.filter.callto + "",
      stopOnly: this.filter.stopOnly,
      noStop: this.filter.noStop,

      missingOnly: this.filter.missingOnly,
      noMissing: this.filter.noMissing,

      favoriteOnly: this.filter.favoriteOnly,
      noFavorite: this.filter.noFavorite,
      sortorder: this.filter.sortorder,
      sortby: this.filter.sortby,
      tagsOnly: this.filter.tagsOnly ? this.filter.tagsOnly : null,
      noTags: this.filter.noTags ? this.filter.noTags : null,
      checklistOnly: this.filter.checklistOnly
        ? this.filter.checklistOnly
        : null,
      noChecklist: this.filter.noChecklist ? this.filter.noChecklist : null,
      commentsOnly: this.filter.commentsOnly ? this.filter.commentsOnly : null,
      noComments: this.filter.noComments ? this.filter.noComments : null
    };
    if (this.filter.keywordsContain && this.filter.keywordsContain.length) {
      params["keywordsContain"] = this.filter.keywordsContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
      params["stopBy"] = this.filter.stopwordLooking;
    }
    if (this.filter.sentimentTrend) {
      params["sentimentTrend"] = this.filter.sentimentTrend;
    }
    if (this.filter.topics) {
      params["topicsContain"] = this.filter.topics;
    }
    if (
      this.filter.keywordsNotContain &&
      this.filter.keywordsNotContain.length
    ) {
      params["keywordsNotContain"] = this.filter.keywordsNotContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
    }
    if (this.filter.tagsContain && this.filter.tagsContain.length) {
      params["tagsContain"] = this.filter.tagsContain
        .map(v =>
          v.value
            .split(",")
            .map(v => v.trim())
            .join(",")
        )
        .join(",");
    }
    Object.keys(params).forEach(
      key =>
        (params[key] === "" ||
          params[key] === undefined ||
          params[key] === null ||
          params[key] === false) &&
        delete params[key]
    );
    return params;
  }

  updateFileList(): void {
    this.isLoading = true;
    const params = this.getFilterParams();
    this.filesService.listFilesPage(params).subscribe(data => {
      if (data && data.files) {
        this.totalcount = data.totalcount;
        this.pagecount = data.pagecount;
        this.fileStore = data.files;
        this.label =
          (this.filter.pagen + 1) * 100 < this.fileStore.length
            ? (this.filter.pagen + 1) * 100
            : this.fileStore.length;
        this.filesSubject.next(this.fileStore);
      } else {
        this.totalcount = 0;
        this.pagecount = 0;
        this.fileStore = [];
        this.label = "";
        this.filesSubject.next(this.fileStore);
      }
      this.isLoading = false;
    });
  }

  getFilter() {
    return this.filter;
  }

  getPages() {
    if (this.files && Math.ceil(this.fileStore.length / this.pagecount) > 1) {
      return Array.from(
        { length: Math.ceil(this.fileStore.length / this.pagecount) },
        (v, k) => k + 1
      );
    }
    return [];
  }

  public deteleFile(batchid, filename) {
    const index = this.fileStore.findIndex(
      item => item.batchid === batchid && item.filename === filename
    );
    if (index !== -1) {
      this.fileStore = this.fileStore.filter(function(value, i, arr) {
        return index !== i;
      });
      this.filesSubject.next(this.fileStore);
      this.filesService
        .deleteFile({
          batchid,
          filename
        })
        .subscribe();
    }
  }
  public processFile(batchid, filename) {
    const index = this.fileStore.findIndex(
      item => item.batchid === batchid && item.filename === filename
    );
    if (index !== -1) {
      this.fileStore[index].proccessing = true;
      this.filesSubject.next(this.fileStore);
      this.filesService
        .processFile({
          batchid: batchid,
          filename: filename
        })
        .subscribe();
    }
  }
  public resetFilter() {
    this.filter = {
      uploadDate: null,
      angerfrom: null,
      angerto: null,
      keywordsContain: [],
      keywordsNotContain: [],
      tagsContain: [],
      pauseAvgFrom: null,
      pauseAvgTo: null,
      pauseDurFrom: null,
      pauseDurTo: null,
      callfrom: null,
      callto: null,
      page: 0,
      batchid: null,
      batchidAll: true,
      datefromAll: true,
      datetoAll: true,
      angerfromAll: true,
      angertoAll: true,
      pausefromAll: true,
      pausetoAll: true,
      stopOnly: null,
      noStop: null,
      stopwordLooking: "Everywhere",
      sentimentTrend: null,
      missingOnly: null,
      noMissing: null,
      favoriteOnly: false,
      noFavorite: false,
      filename: "",
      itemsn: 100,
      pagen: 1,
      sortby: "",
      sortorder: "",
      topics: "",
      noTags: null,
      tagsOnly: null,
      checklistOnly: null,
      noChecklist: null,
      commentsOnly: null,
      noComments: null
    };
    this.updateFileList();
  }

  public markFavorite(batchid, filename) {
    const index = this.fileStore.findIndex(
      item => item.batchid === batchid && item.filename === filename
    );
    if (index !== -1) {
      const pin = `${!(this.fileStore[index].pin === "true")}`;
      this.fileStore[index].pin = pin;
      this.filesSubject.next(this.fileStore);
      const params = {
        fileid: {
          batchid,
          fileid: filename
        },

        fileinfo: {
          filename,
          comment: "",
          pin: pin,
          tags: this.fileStore[index].tags || []
        }
      };
      this.filesService.updateFileInfo(params).subscribe();
    }
  }
  public getFile(batchid, filename) {
    const index = this.fileStore.findIndex(
      item => item.batchid === batchid && item.filename === filename
    );
    if (index !== -1) {
      return this.fileStore[index];
    } else {
      return null;
    }
  }
  public getIndex(batchid, filename) {
    const index = this.fileStore.findIndex(
      item => item.batchid === batchid && item.filename === filename
    );
    return index;
  }
  public setTags(index, tags) {
    if (index !== -1) {
      this.fileStore[index].tags = tags;
      this.filesSubject.next(this.fileStore);
      const params = {
        fileid: {
          batchid: this.fileStore[index].batchid,
          fileid: this.fileStore[index].filename
        },
        fileinfo: {
          filename: this.fileStore[index].filename,
          comment: "",
          pin: this.fileStore[index].pin,
          tags: tags
        }
      };
      this.filesService.updateFileInfo(params).subscribe();
    }
  }

  public setComment(index, comments) {
    if (index !== -1) {
      this.fileStore[index].comment = [{ text: comments }];
      this.filesSubject.next(this.fileStore);
    }
  }
  public setAssessment(index, value) {
    if (index !== -1) {
      this.fileStore[index].checklist = true;
      this.fileStore[index].checklistScore = value;
      this.filesSubject.next(this.fileStore);
    }
  }

  public getNextLink(fileName: string, batchId: string): string {
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );

      if (index !== -1 && this.fileStore[index + 1]) {
        return `/file/${this.fileStore[index + 1].batchid}/${
          this.fileStore[index + 1].filename
        }`;
      }
      return "";
    } else {
      return "";
    }
  }
  public getPrevLink(fileName: string, batchId: string): string {
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.fileStore[index - 1]) {
        return `/file/${this.fileStore[index - 1].batchid}/${
          this.fileStore[index - 1].filename
        }`;
      }
      return "";
    } else {
      return "";
    }
  }

  public hasNextLink(fileName: string, batchId: string): boolean {
    let res = true;
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.fileStore[index + 1]) {
        res = false;
      }
    }
    return res;
  }
  public hasPrevLink(fileName: string, batchId: string): boolean {
    let res = true;
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(
        file => file.filename === fileName && file.batchid === batchId
      );
      if (index !== -1 && this.fileStore[index - 1]) {
        res = false;
      }
    }
    return res;
  }

  getRandom() {
    return Math.floor(Math.random() * 3);
  }
}
