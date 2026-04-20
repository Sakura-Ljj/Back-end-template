import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'account role relation' })
@Index(['account_uid', 'role_id'], { unique: true })
export class AccountRole extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: 'account uid' })
  account_uid!: string;

  @Column({ type: 'varchar', length: 36, comment: 'role id' })
  role_id!: string;
}
