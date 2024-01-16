import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { enviroment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiGetRoles = `${enviroment.apiBaseUrl}/roles`;
  constructor(private http: HttpClient) { }
  getRoles():Observable<any> {
    return this.http.get<any[]>(this.apiGetRoles);
  }
}
