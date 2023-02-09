import { UserRepository } from '@repository/auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/auth';
import { AuthModule } from '@modules/auth';
import { UserController } from '@controllers/user';
import { UserService } from '@services/user';
import { ProductModule } from '@modules/product';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, ProductModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService]
})
export class UserModule {}
