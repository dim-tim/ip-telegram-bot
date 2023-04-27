import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { InfoEntity } from './info.entity';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => InfoEntity, (info) => info.address, {
    cascade: true,
  })
  info: InfoEntity[];
}
