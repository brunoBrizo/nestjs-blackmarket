import { User } from '@entities/auth';
import { CartItem } from '@entities/cart';
import { BaseEntity } from '@entities/base';
import { ColumnNumericTransformer } from '@src/shared/utils';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Cart extends BaseEntity {
  @OneToMany(() => CartItem, cartItem => cartItem.cart, {
    cascade: true,
    eager: true
  })
  cartItems: CartItem[];

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  totalAmount: number;

  @OneToOne(() => User, user => user.cart, {
    cascade: true,
    eager: true
  })
  @JoinColumn()
  user: User;
}
