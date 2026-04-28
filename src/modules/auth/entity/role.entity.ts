import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '角色表' })
export class Role extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 64, comment: '角色编码' })
  code!: string;

  @Column({ type: 'varchar', length: 64, comment: '角色名称' })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: '角色描述' })
  description!: string;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_active!: boolean;
}
