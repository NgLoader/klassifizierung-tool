import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  downloadJson(filename: string, content: string) {
    const element = document.createElement('a');

    element.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename.replaceAll(' ', '-'));

    element.dispatchEvent(new MouseEvent('click'));
    element.remove();
  }
}
