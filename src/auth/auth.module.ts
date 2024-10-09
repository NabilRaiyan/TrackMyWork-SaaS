import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })], // loading dotenv file var in our project
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
