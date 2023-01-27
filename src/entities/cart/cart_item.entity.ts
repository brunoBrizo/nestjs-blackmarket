import { Cart } from '@entities/cart';
import { Product } from '@entities/product';
import { ColumnNumericTransformer } from '@src/shared/utils';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class CartItem {
  @PrimaryColumn({ name: 'cartId', type: 'uuid' })
  cartId: string;

  @PrimaryColumn({ name: 'productId', type: 'uuid' })
  productId: string;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  price: number;

  @Column('numeric', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
    default: 0
  })
  subTotalPrice: number;

  @Column({ type: 'numeric' })
  quantity: number;

  @ManyToOne(() => Product, product => product.cartItems)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product?: Product;

  @ManyToOne(() => Cart, cart => cart.cartItems, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete'
  })
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart?: Cart;
}
