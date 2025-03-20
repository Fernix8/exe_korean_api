import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./google.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { LocalStrategy } from "./local.strategy";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        PassportModule, JwtModule.register({
            secret: 'test',
            signOptions: { expiresIn: '360s' }
        }),
        UserModule
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
    exports: [AuthService]
})
export class AuthModule {

}