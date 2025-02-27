import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
// import { request } from 'http';
import { type } from 'os';
import { AppService } from './app.service';
import { AuthService } from './auth/auth-goole/auth.service';

// import { AuthService } from './auth/auth.service';

// @ApiTags('Test')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private authService: AuthService) {}
public jwtToken = {access_token: ''}; 

// @UseGuards(AuthGuard('local'))
@Post('auth/login')
@ApiOperation({ summary: 'User login' })
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        example: 'user@example.com',
        description: 'User email or username'
      },
      password: {
        type: 'string',
        example: 'password123',
        description: 'User password'
      }
    },
    required: ['username', 'password']
  }
})
@ApiResponse({
  status: 200,
  description: 'Login successful',
  schema: {
    type: 'object',
    properties: {
      access_token: {
        type: 'string',
        description: 'JWT access token'
      }
    }
  }
})
async login (@Req() req) {
  console.log('🔥 Login route hit!'); 
    return this.authService.login(req.user);
}



@Get('auth/google')
@UseGuards(AuthGuard('google'))
async googleAuth() {
  return { message: 'Redirecting to Google login...' };
}


@Get('auth/google/callback')
@UseGuards(AuthGuard('google'))
async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    console.log('🔥 Google callback route hit!');

    if (!req.user) {
        console.log('❌ No user from Google');
        return res.status(401).json({ message: 'Unauthorized - No user data' });
    }

    console.log('✅ User from Google:', req.user);

    try {
        const jwt = await this.authService.login(req.user);
        console.log('🔑 Generated JWT:', jwt);

        // **Chuyển hướng về frontend với token trên URL**
        return res.redirect(`http://localhost:3000/login?access_token=${jwt.access_token}`);
    } catch (error) {
        console.error('🔥 Error in Google login:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}






@Get('logout')
async logout(@Req() req, @Res() res) {
  const jwt = await this.authService.login('');
  this.jwtToken = jwt;
  return 'successfully logout'
}
  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }
}