import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '权限表' })
export class Permission extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 128, comment: '权限编码' })
  code!: string;

  @Column({ type: 'varchar', length: 64, comment: '权限名称' })
  name!: string;

  @Column({ type: 'varchar', length: 64, default: 'api', comment: '权限类型' })
  type!: string;

  @Column({ type: 'varchar', length: 64, default: '', comment: '所属模块' })
  module!: string;

  @Column({ type: 'varchar', length: 64, default: '', comment: '权限动作' })
  action!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: '权限描述' })
  description!: string;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_active!: boolean;
}
