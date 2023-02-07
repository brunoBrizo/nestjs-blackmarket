import { User, UserAddress } from '@entities/auth';
import { BaseEntity } from '@entities/base';
import { OrderItem } from '@entities/order';
import { PaymentStatus } from '@enums/order';
import { ColumnNumericTransformer } from '@src/shared/utils';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Order extends BaseEntity {
  @OneToMany(() => OrderItem, orderItem => orderItem.order, {
    cascade: true,
    eager: true
  })
  orderItems?: OrderItem[];

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  totalAmount?: number;

  @Column({
    name: 'paymentStatus',
    default: PaymentStatus.Created
  })
  paymentStatus?: PaymentStatus;

  @ManyToOne(() => User, user => user.orderList, { cascade: true, eager: true })
  user?: User;

  @ManyToOne(() => UserAddress, userAddress => userAddress.orderList, {
    cascade: true,
    eager: true
  })
  userAddress?: UserAddress;
}
