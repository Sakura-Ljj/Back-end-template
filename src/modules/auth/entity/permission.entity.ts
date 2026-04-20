import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'rbac permission' })
export class Permission extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 128, comment: 'permission code' })
  code!: string;

  @Column({ type: 'varchar', length: 64, comment: 'permission name' })
  name!: string;

  @Column({ type: 'varchar', length: 64, default: 'api', comment: 'permission type' })
  type!: string;

  @Column({ type: 'varchar', length: 64, default: '', comment: 'permission module' })
  module!: string;

  @Column({ type: 'varchar', length: 64, default: '', comment: 'permission action' })
  action!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: 'permission description' })
  description!: string;

  @Column({ type: 'boolean', default: true, comment: 'is active' })
  is_active!: boolean;
}
