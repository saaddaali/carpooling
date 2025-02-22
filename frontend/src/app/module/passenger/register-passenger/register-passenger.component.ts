import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/zynerator/security/shared/service/Auth.service';
import { UserDto } from 'src/app/zynerator/security/shared/model/User.model';
import { RoleDto } from 'src/app/zynerator/security/shared/model/Role.model';
import { RoleUserDto } from 'src/app/zynerator/security/shared/model/RoleUser.model';
import { Router } from "@angular/router";
import { RegisterDto } from 'src/app/zynerator/security/shared/model/Register.model';


@Component({
  selector: 'app-register-passenger',
  templateUrl: './register-passenger.component.html',
  styleUrls: ['./register-passenger.component.css']
})
export class RegisterPassengerComponent implements OnInit {

    clicked = false;
    registerDto: RegisterDto = new RegisterDto();
    showPassword: boolean = false;

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
    }
    ngOnInit(): void {
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    login() {
        this.router.navigate(['/passenger/login']);
    }

    submit() {
        this.clicked = true;
        if (this.registerDto.phone && this.registerDto.firstName && this.registerDto.lastName &&
            this.registerDto.email && this.registerDto.username && this.registerDto.password) {

            const role = new RoleDto();
            role.authority = 'ROLE_PASSENGER';
            const roleUser = new RoleUserDto();
            roleUser.role = role;
            this.user.accountNonExpired = true;
            this.user.accountNonLocked = true;
            this.user.credentialsNonExpired = true;
            this.user.enabled = false;
            this.user.passwordChanged = false;
            this.user.firstName = this.registerDto.firstName;
            this.user.lastName = this.registerDto.lastName;
            this.user.phone = this.registerDto.phone;
            this.user.username = this.registerDto.username;
            this.user.password = this.registerDto.password;
            this.user.email = this.registerDto.email;
            this.user.roleUsers = new Array<RoleUserDto>();
            this.user.roleUsers.push(roleUser);
            this.authService.registerPassenger();
            this.authService.sharedUserName = this.registerDto.username;
            this.router.navigate(['/passenger/activation']);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Fill in all fields'
            });
        }
    }

    get user(): UserDto {
        return this.authService.user;
    }

    set user(value: UserDto) {
        this.authService.user = value;
    }
}
