import { BaseEntity } from '@entities/base';
import { Product } from '@entities/product';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Product, product => product.category, {})
  products: Product[];
}
