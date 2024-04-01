import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginDTO } from '../../dtos/user/login.dto';
import { TokenService } from 'src/app/services/token.service';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/app/models/role';
import { UserResponse } from 'src/app/responses/user/user.response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @ViewChild('loginForm') loginForm!: NgForm;

  phone: string = '';
  password: string = '';

  roles: Role[] = []; // mảng role
  rememberMe: boolean = true;
  selectedRole: Role | undefined; //biến để lưu giá trị được chọn từ dropdown
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService) {}

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
          debugger;
          this.userService.getUserDetails(token).subscribe({
            next: (response: any) => {
              debugger
              this.userResponse = {
                id: response.id,
                fullname: response.fullname,
                address: response.address,
                is_active: response.is_active,
                date_of_birth: new Date(response.date_of_birth),
                facebook_account_id: response.facebook_account_id,
                google_account_id: response.google_account_id,
                role: response.role
              }
              // lưu user vào local storage
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              // login thành công, chuyển sang trang home
              this.router.navigate(['/']);
            },
            complete: () => {
              debugger
            },
            error: (error: any) => {
              debugger
              alert(error.error.message);
            }
          })
        }
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
