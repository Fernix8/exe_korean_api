//google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    console.log('📢 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('📢 GOOGLE_SECRET:', process.env.GOOGLE_SECRET); 
    super({
      clientID: process.env.GOOGLE_CLIENT_ID||'',
      clientSecret: process.env.GOOGLE_SECRET ||'',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, emails, displayName } = profile;

    const user = {
      id,
      email: emails[0].value,
      name: displayName,
    };

    done(null, user);
  }
}

