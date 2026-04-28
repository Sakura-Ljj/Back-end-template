import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '账号角色关联表' })
@Index(['account_uid', 'role_id'], { unique: true })
export class AccountRole extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: '账号唯一标识' })
  account_uid!: string;

  @Column({ type: 'varchar', length: 36, comment: '角色主键' })
  role_id!: string;
}
