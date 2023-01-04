import { Product } from '@entities/product';
import { SubCategory } from '@entities/subcategory';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updated_at: Date;

  @OneToMany(() => Product, product => product.category, {})
  products: Product[];

  @OneToMany(() => SubCategory, subCategory => subCategory.category)
  subCategories: SubCategory[];
}
