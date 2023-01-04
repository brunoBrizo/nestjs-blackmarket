import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '@repository/auth';
import { Module } from '@nestjs/common';
import { AuthController } from '@controllers/auth';
import { AuthService } from '@services/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@shared/config';
import { jwtModuleOptions } from '@shared/config';
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
