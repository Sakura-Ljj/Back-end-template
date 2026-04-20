import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'rbac role' })
export class Role extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 64, comment: 'role code' })
  code!: string;

  @Column({ type: 'varchar', length: 64, comment: 'role name' })
  name!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: 'role description' })
  description!: string;

  @Column({ type: 'boolean', default: true, comment: 'is active' })
  is_active!: boolean;
}
