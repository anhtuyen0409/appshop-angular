import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { TokenService } from 'src/app/services/token.service';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string;
  password: string;

  roles: Role[] = []; // mảng role
  rememberMe: boolean = true;
  selectedRole: Role | undefined; //biến để lưu giá trị được chọn từ dropdown

  constructor(private router: Router, private userService: UserService, private tokenService: TokenService, private roleService: RoleService) {
    this.phone = '';
    this.password = '';
  }

  ngOnInit() {
    // gọi api lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        debugger
        console.error('Error getting role: ', error);
      }

    });
  }

  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }

  login() {

    debugger

    const loginDTO: LoginDTO = {
      phone_number: this.phone,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    }

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
          debugger
          const {token} = response;
          if(this.rememberMe) {
            this.tokenService.setToken(token);
          }

          // login thành công, chuyển sang màn hình sản phẩm
          //this.router.navigate(['/product']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        // xử lý lỗi nếu có
        debugger;
        alert(error?.error?.message);
      }
    });

  }

}
