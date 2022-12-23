import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@src/repository/auth';
import { Module } from '@nestjs/common';
import { AuthController } from '@src/controllers/auth';
import { AuthService } from '@src/services/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@src/shared/config';
import { jwtModuleOptions } from '@src/shared/config';
import { User } from '@entities/auth';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtModuleOptions),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
