import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'role permission relation' })
@Index(['role_id', 'permission_id'], { unique: true })
export class RolePermission extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: 'role id' })
  role_id!: string;

  @Column({ type: 'varchar', length: 36, comment: 'permission id' })
  permission_id!: string;
}
