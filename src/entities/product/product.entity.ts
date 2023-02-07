import { BaseEntity } from '@entities/base';
import { Category } from '@entities/category';
import { SubCategory } from '@entities/subcategory';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@entities/auth';
import { CartItem } from '@entities/cart';
import { OrderItem } from '@entities/order';

@Entity()
export class Product extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column()
  stock: number;

  @ManyToOne(() => Category, category => category.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  category: Category;

  @ManyToOne(() => SubCategory, subCategory => subCategory.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL'
  })
  subCategory: SubCategory;

  @ManyToMany(() => User, user => user.favoriteProducts)
  users: User[];

  @OneToMany(() => CartItem, cartItem => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];
}
