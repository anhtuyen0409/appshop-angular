import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { enviroment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiRegister = `${enviroment.apiBaseUrl}/users/register`;
  private apiLogin = `${enviroment.apiBaseUrl}/users/login`;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }

  constructor(private http: HttpClient, private httpUtilService: HttpUtilService) { }

  register(registerDTO: RegisterDTO):Observable<any> {
    return this.http.post(this.apiRegister, registerDTO, this.apiConfig);
  }

  login(loginDTO: LoginDTO):Observable<any> {
    return this.http.post(this.apiLogin, loginDTO, this.apiConfig);
  }

}
