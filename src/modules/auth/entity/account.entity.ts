import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '系统账号表' })
export class Account extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column({ type: 'varchar', unique: true, length: 64, comment: '账号' })
  account!: string;

  @Column({ type: 'varchar', length: 64, comment: '显示名称' })
  username!: string;

  @Column({ type: 'varchar', length: 128, comment: '密码哈希' })
  password_hash!: string;

  @Column({ type: 'varchar', length: 64, comment: '密码盐值' })
  password_salt!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: '租户标识' })
  corp_id!: string | null;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_active!: boolean;
}
