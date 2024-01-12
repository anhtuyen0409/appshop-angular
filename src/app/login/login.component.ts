import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoginDTO } from '../dtos/user/login.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string;
  password: string;

  constructor(private router: Router, private userService: UserService) {
    this.phone = '';
    this.password = '';
  }

  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

  login() {

    debugger

    const loginDTO: LoginDTO = {
      "phone_number": this.phone,
      "password": this.password
    }

    this.userService.login(loginDTO).subscribe({
      next: (response: any) => {
          debugger
          // login thành công, chuyển sang màn hình sản phẩm
          //this.router.navigate(['/product']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        // xử lý lỗi nếu có
        alert(`Đăng nhập không thành công. Lỗi: ${error.error}`);
      }
    });

  }

}
