import { UserRepository } from '@repository/auth';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities/auth';
import { AuthModule } from '@modules/auth';
import { UserController } from '@controllers/user';
import { UserService } from '@services/user';
import { ProductRepository } from '@repository/product';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, ProductRepository]
})
export class UserModule {}
