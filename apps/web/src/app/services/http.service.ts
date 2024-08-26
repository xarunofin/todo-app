import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {
    console.log(environment);
  }

  public get(url: string) {
    return this.http.get(environment.apiURL + url);
  }

  public post(url: string, body: any) {
    return this.http.post(environment.apiURL + url, body);
  }

  public patch(url: string, body: any) {
    return this.http.patch(environment.apiURL + url, body);
  }

  public delete(url: string) {
    return this.http.delete(environment.apiURL + url);
  }
}
