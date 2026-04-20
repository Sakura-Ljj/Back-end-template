import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'system account' })
export class Account extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column({ type: 'varchar', unique: true, length: 64, comment: 'account' })
  account!: string;

  @Column({ type: 'varchar', length: 64, comment: 'display name' })
  username!: string;

  @Column({ type: 'varchar', length: 128, comment: 'password hash' })
  password_hash!: string;

  @Column({ type: 'varchar', length: 64, comment: 'password salt' })
  password_salt!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'corp id' })
  corp_id!: string | null;

  @Column({ type: 'boolean', default: true, comment: 'is active' })
  is_active!: boolean;
}
