import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'frontend route config' })
export class Route extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 128, comment: 'route path' })
  path!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, comment: 'route name' })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'corp id' })
  corp_id!: string | null;

  @Column({ type: 'varchar', length: 64, comment: 'route title' })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'frontend component path' })
  component_path!: string | null;

  @Column({ type: 'boolean', default: false, comment: 'keep alive' })
  is_keep_alive!: boolean;

  @Column({ type: 'boolean', default: false, comment: 'hide in sidebar' })
  is_hide!: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'route icon' })
  icon!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'redirect path' })
  redirect!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, comment: 'parent route id' })
  parent_id!: string | null;

  @Column({ type: 'int', default: 0, comment: 'route weight' })
  weight!: number;

  @Column({ type: 'varchar', length: 128, nullable: true, comment: 'required permission code' })
  permission_code!: string | null;

  @Column({ type: 'varchar', length: 32, default: 'menu', comment: 'route type' })
  route_type!: 'menu' | 'page';

  @Column({ type: 'boolean', default: true, comment: 'is enabled' })
  is_enabled!: boolean;

  @Column({ type: 'varchar', length: 255, default: '', comment: 'remark' })
  remark!: string;
}
