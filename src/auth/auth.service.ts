import { Injectable } from '@nestjs/common';
import { User, Bookmark } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return user;
  }

  logIn() {}
}
