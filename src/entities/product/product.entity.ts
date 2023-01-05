import { BaseEntity } from '@entities/base';
import { Category } from '@entities/category';
import { Column, Entity, ManyToOne } from 'typeorm';

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
}
