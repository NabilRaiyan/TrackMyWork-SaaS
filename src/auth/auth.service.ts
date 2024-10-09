// Until 1 hr 38 min
// Link: https://www.youtube.com/watch?v=GHTA143_b-s


import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, AuthSignInDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()

// User sign up
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      delete user.hash;
      return user;
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

    delete user.hash;
    return user;
  }
}
