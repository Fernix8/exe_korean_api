import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UserService) {

    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.authenticateUser(email, password);
        if (user && user.password === password) {
            return user;
        }
        return null;
    }

    async login(user: any): Promise<any> {
        if (user) {
            console.log("user", user);
            return {
                access_token: this.jwtService.sign(
                    {
                        userId: user._id, sub: 1
                    },
                    { secret: process.env.JWT_SECRET }
                )
            }
        } else {
            return {
                access_token: ''
            }
        }
    }

    logout() {

    }
}