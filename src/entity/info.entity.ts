import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { AddressEntity } from './address.entity';

@Entity({ name: 'info' })
export class InfoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => AddressEntity, (address) => address.info, {
    onDelete: 'CASCADE',
  })
  address: AddressEntity;

  @Column()
  username: string;
  @Column()
  country_code: string;
  @Column()
  city: string;
  @Column()
  success: boolean;
  @Column()
  message: string;
  @Column({ type: 'real' })
  fraud_score: number;
  @Column()
  region: string;
  @Column()
  ISP: string;
  @Column({ type: 'real' })
  ASN: number;
  @Column()
  organization: string;
  @Column()
  is_crawler: boolean;
  @Column()
  timezone: string;
  @Column()
  mobile: boolean;
  @Column()
  host: string;
  @Column()
  proxy: boolean;
  @Column()
  vpn: boolean;
  @Column()
  tor: boolean;
  @Column()
  active_vpn: boolean;
  @Column()
  active_tor: boolean;
  @Column()
  recent_abuse: boolean;
  @Column()
  bot_status: boolean;
  @Column()
  connection_type: string;
  @Column()
  abuse_velocity: string;
  @Column()
  zip_code: string;
  @Column()
  request_id: string;
  @Column({ type: 'real', nullable: true })
  latitude: number;
  @Column({ type: 'real', nullable: true })
  longitude: number;

  // @Column({ type: 'date', name: 'registration_date' })
  // date: string;
  // @Column({ type: 'timestamptz', name: 'registration_date' })
  // date: Date;
}
