import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthSignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign up
  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    console.log({ dto });
    return this.authService.signUp(dto);
  }

  // sign in
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthSignInDto) {
    return this.authService.signIn(dto);
  }
}
