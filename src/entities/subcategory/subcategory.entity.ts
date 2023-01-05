import { BaseEntity } from '@entities/base';
import { Category } from '@entities/category';
import { Product } from '@entities/product';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['category', 'name'])
export class SubCategory extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Category, category => category.subCategories, {
    eager: true
  })
  category: Category;

  @OneToMany(() => Product, product => product.subCategory, {})
  products: Product[];
}
