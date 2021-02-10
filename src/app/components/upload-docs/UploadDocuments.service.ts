import { Injectable } from '@angular/core';


export interface Callback {
    (...args: any[]): any;
}

export interface ProgressCallback {
    (idx: number, uploaded: number): void;
}

export interface DoneCallback {
    (idx: number, response: any): void;
}

@Injectable()
export class UploadDocumentsService {

    constructor() { }

    private checkUploadResponse (response: any) {
        if (response.status === 200) {
            return response.text;
        } else {
            let errorMsg = response.text;
            try {
                // check for a json response error message.
                let errObj = JSON.parse (errorMsg);
                if (errObj.message) {
                    errorMsg = errObj.message;
                }
            } catch (err) {
                console.error("ERROR: ", err);
            }
            throw new Error(errorMsg);
        }
    }


    // https://github.com/github/fetch/issues/89
    private fetchWithProgress (url: string, opts: any = {}, onProgress: Callback): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(opts.method || "get", url);
            for (let k in opts.headers || {}) {
                xhr.setRequestHeader(k, opts.headers[k]);
            }
            xhr.onload = (e: any) => resolve({ status: xhr.status, text: e.target.responseText });
            xhr.onerror = reject;
            if (xhr.upload && onProgress) {
                xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
            }
            xhr.send(opts.body);
        });
    }

    private uploadFileMultiPartWithProgress (url: string, file: File, progress: Callback): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);
        return this.fetchWithProgress(url, {
            method: "POST",
            body: formData,
            credentials: "include",
        }, (progressEvent: any) => progress(progressEvent.loaded, progressEvent.total))
            .then(this.checkUploadResponse).then((a) => JSON.parse(a));
    }


    /**
     * Upload a file (POST) and report the upload progress by calling the "progress" callback
     * 
     * 
     * @param {*} url url where to do the upload.
     * @param {*} mimeType content type of the file.
     * @param {*} file file to upload.
     * @param {*} progress callback called to report progress of upload
     */
    private uploadFileWithProgress(url: string, mimeType: string, file: File, progress: Callback): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.fetchWithProgress (url, {
                    method: "POST",
                    body: e.target.result,
                    headers: {
                        'Content-Type': mimeType,
                    },
                    credentials: "include",
                }, (progressEvent: any) => progress(progressEvent.loaded, progressEvent.total))
                    .then(this.checkUploadResponse)
                    .then((resp: any) => resolve(resp)).catch((err: any) => reject(err));
            };
            reader.readAsArrayBuffer(file);
        });
    }


    /**
     * This function allows to upload a collection of files and receive upload progression for each one.
     * 
     * @param {*} url url where to upload the files.
     * @param {*} files List of files to upload.
     * @param {*} progress callback called to notify upload progressing. params: index of the file in the input list + progression in %
     * @param {*} done callback called when the file has been completely uploaded. callback param: index of the file in the input list.
     * 
     * @returns an error of flags corresponding to the input files array (true: file uploaded successfully, false: file in error)
     */
    uploadDocuments (url: string, files: File[], progress: ProgressCallback, done: DoneCallback, onError: Callback): Promise<any> {
        return Promise.all(Array.prototype.map.call(files, (file, i) => {
            if (file === null) {
                return { file: null, successful: true };
            } else {
                return this.uploadFileWithProgress(url, file.type, file, (uploaded: number) => progress(i, uploaded))
                    .then((res: any) => {
                        done(i, res);
                        return { file, successful: true };
                    })
                    .catch((e: any) => {
                        onError(i);
                        return { file, successful: false };
                    });
            }
        }));
    }


}