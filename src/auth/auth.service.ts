// Until 2 hr 35 min
// Link: https://www.youtube.com/watch?v=GHTA143_b-s

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthSignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()

// User sign up
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });
      return this.singInToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials Taken');
        }
      }

      throw error;
    }
  }

  // User Sign in
  // find the user by email and password
  async signIn(dto: AuthSignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Incorrect Credentials');
    }

    const passwordMatch = await argon.verify(user.hash, dto.password);
    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect Credentials');
    }

    return this.singInToken(user.id, user.email);
  }

  // JWT token
  async singInToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    if (!userId) throw new UnauthorizedException();
    if (!email) throw new UnauthorizedException();

    const payload = { sub: userId, email: email };

    return {
      access_token: await this.jwt.signAsync(payload),
    };
  }
}
