import { User } from '@entities/auth';
import { Order } from '@entities/order';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  address?: string;

  @Column()
  zipCode?: string;

  @Column()
  city?: string;

  @Column()
  country?: string;

  @ManyToOne(() => User, user => user.addressList)
  user?: User;

  @OneToMany(() => Order, order => order.userAddress)
  orderList?: Order[];
}
