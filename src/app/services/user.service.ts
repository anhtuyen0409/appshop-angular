import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterDTO } from '../dtos/user/register.dto';
import { LoginDTO } from '../dtos/user/login.dto';
import { enviroment } from '../environments/environment';
import { HttpUtilService } from './http.util.service';
import { UserResponse } from '../responses/user/user.response';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiRegister = `${enviroment.apiBaseUrl}/users/register`;
  private apiLogin = `${enviroment.apiBaseUrl}/users/login`;
  private apiUserDetails =`${enviroment.apiBaseUrl}/users/details`;

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

  getUserDetails(token: string) {
    return this.http.post(this.apiUserDetails, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    })
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if(userResponse == null || !userResponse) {
        return;
      }
      // convert userResponse object to JSON string
      const userResponseJSON = JSON.stringify(userResponse);
      // save JSON string to local storage with a key
      localStorage.setItem('userResponse', userResponseJSON);
      console.log('User response saved to local storage')
    } catch (error) {
      console.error('Error Saving user response to local storage', error);
    }
  }

  getUserResponseFromLocalStorage() {
    try {
      // retrieve JSON string from local storage using key
      const userResponseJSON = localStorage.getItem('userResponse');
      if(userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      // convert JSON string back to an object
      const userResponse = JSON.parse(userResponseJSON!);
      console.log('User response retrieved from local storage');
      return userResponse;
    } catch (error) {
      console.error('Error retrieving user response from local storage', error);
      return null;
    }
  }

}
