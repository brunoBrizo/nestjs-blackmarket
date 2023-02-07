import { Order } from '@entities/order';
import { Product } from '@entities/product';
import { ColumnNumericTransformer } from '@src/shared/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryColumn({ name: 'orderId', type: 'uuid' })
  orderId?: string;

  @PrimaryColumn({ name: 'productId', type: 'uuid' })
  productId?: string;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  price?: number;

  @Column({ type: 'numeric' })
  quantity?: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  subTotalPrice?: number;

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product?: Product;

  @ManyToOne(() => Order, order => order.orderItems, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order?: Order;
}
