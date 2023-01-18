import { User } from '@entities/auth';
import { BaseEntity } from '@entities/base';
import { CartItem } from '@interfaces/cart';
import { ColumnNumericTransformer } from '@src/shared/utils';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Cart extends BaseEntity {
  @Column('simple-json')
  items: CartItem[];

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
