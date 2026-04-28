import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '角色权限关联表' })
@Index(['role_id', 'permission_id'], { unique: true })
export class RolePermission extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: '角色主键' })
  role_id!: string;

  @Column({ type: 'varchar', length: 36, comment: '权限主键' })
  permission_id!: string;
}
