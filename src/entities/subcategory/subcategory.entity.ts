import { Category } from '@entities/category';
import { Product } from '@entities/product';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@Unique(['category', 'name'])
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.subCategories, {
    eager: true
  })
  category: Category;

  @OneToMany(() => Product, product => product.subCategory, {})
  products: Product[];
}
