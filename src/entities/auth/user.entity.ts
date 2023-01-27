import { UserType } from '@enums/auth';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinTable,
  ManyToMany,
  OneToOne
} from 'typeorm';
import { Product } from '@entities/product';
import { Cart } from '@entities/cart';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  name: string;

  @Column()
  type: UserType;

  @ManyToMany(() => Product, product => product.users, {
    cascade: true
  })
  @JoinTable({
    name: 'userProducts',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'product',
      referencedColumnName: 'id'
    }
  })
  favoriteProducts: Product[];

  @OneToOne(() => Cart, cart => cart.user)
  cart: Cart;
}
