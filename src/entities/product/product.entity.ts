import { SubCategory } from '@entities/subcategory';
import { Category } from '@entities/category';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  description: string;

  @Column()
  stock: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude({ toPlainOnly: true })
  updated_at: Date;

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
}
