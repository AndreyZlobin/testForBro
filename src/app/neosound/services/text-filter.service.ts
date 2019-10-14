import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FilesService } from "./files.service";

@Injectable()
export class TextFilterService {
  public fileStore: any = [];
  private filesSubject = new BehaviorSubject<any[]>([]);
  public files = this.filesSubject.asObservable();
  public pagecount: number;
  public totalcount: number;
  public lastFileId: string;
  public isLoading: boolean = false;
  public label: string = "";
  public filter: {
    datefrom;
    dateto;
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
    stopwordLooking: string;
    tagsOnly: boolean;
    missingOnly: boolean;
    favoriteOnly: boolean;
    filename: string;
    itemsn: number;
    pagen: number;
    sortby: string;
    sortorder: string;
  } = {
    datefrom: null,
    dateto: null,
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
    stopOnly: false,
    stopwordLooking: "Everywhere",
    tagsOnly: false,
    missingOnly: false,
    favoriteOnly: false,
    filename: "",
    itemsn: 100,
    pagen: 1,
    sortby: "",
    sortorder: ""
  };
  constructor(private filesService: FilesService) {}

  public getFilterParams(): any {
    const params = {
      itemsn: `${this.filter.itemsn}`,
      pagen: `${this.filter.pagen}`,
      batchid: (this.filter.batchid && "" + this.filter.batchid) || "",
      filename: this.filter.filename,
      datetimefrom: this.filter.datefrom || "",
      datetimeto: this.filter.dateto || "",
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
      tagsOnly: this.filter.tagsOnly,
      missingOnly: this.filter.missingOnly,
      favoriteOnly: this.filter.favoriteOnly,
      sortorder: this.filter.sortorder,
      sortby: this.filter.sortby
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
    this.filesService.listTextFilesPage(params).subscribe(data => {
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

  public deteleFile(id) {
    const index = this.fileStore.findIndex(item => item.id === id);
    if (index !== -1) {
      this.fileStore = this.fileStore.filter((item, i) => i !== index);
      this.filesSubject.next(this.fileStore);
      this.filesService.deleteTextFile(id).subscribe();
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
      datefrom: null,
      dateto: null,
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
      stopOnly: false,
      stopwordLooking: "Everywhere",
      tagsOnly: false,
      missingOnly: false,
      favoriteOnly: false,
      filename: "",
      itemsn: 100,
      pagen: 1,
      sortby: "",
      sortorder: ""
    };
    this.updateFileList();
  }

  markFavorite(id, filename) {
    const index = this.fileStore.findIndex(
      item => item.id === id
    );
    if (index !== -1) {
      const pin = `${!(this.fileStore[index].pin === "true")}`;
      this.fileStore[index].pin = pin;
      this.filesSubject.next(this.fileStore);
      const params = {
        fileid: {
          id
        },
        fileinfo: {
          filename,
          comment: "",
          pin: pin,
          tags: this.fileStore[index].tags || []
        }
      };
      this.filesService.updateTextFileInfo(params).subscribe();
    }
  }
  setTags(index, tags) {
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
      this.filesService.updateTextFileInfo(params).subscribe();
    }
  }

  getNextLink(fileId: string): string {
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(file => file.id === fileId);

      if (index !== -1 && this.fileStore[index + 1]) {
        return `/text/${this.fileStore[index + 1].id}`;
      }
      return "";
    } else {
      return "";
    }
  }
  getPrevLink(fileId: string): string {
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(file => file.id === fileId);
      if (index !== -1 && this.fileStore[index - 1]) {
        return `/text/${this.fileStore[index - 1].id}`;
      }
      return "";
    } else {
      return "";
    }
  }

  hasNextLink(fileId: string): boolean {
    let res = true;
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(file => file.id === fileId);
      if (index !== -1 && this.fileStore[index + 1]) {
        res = false;
      }
    }
    return res;
  }
  hasPrevLink(fileId: string): boolean {
    let res = true;
    if (this.fileStore && this.fileStore.length) {
      const index = this.fileStore.findIndex(file => file.id === fileId);
      if (index !== -1 && this.fileStore[index - 1]) {
        res = false;
      }
    }
    return res;
  }
}
