import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '前端路由配置表' })
export class Route extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 128, comment: '路由路径' })
  path!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, comment: '路由名称' })
  name!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: '租户标识' })
  corp_id!: string | null;

  @Column({ type: 'varchar', length: 64, comment: '路由标题' })
  title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '前端组件路径' })
  component_path!: string | null;

  @Column({ type: 'boolean', default: false, comment: '是否缓存' })
  is_keep_alive!: boolean;

  @Column({ type: 'boolean', default: false, comment: '是否在侧边栏隐藏' })
  is_hide!: boolean;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '路由图标' })
  icon!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '重定向路径' })
  redirect!: string | null;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true, comment: '父级路由主键' })
  parent_id!: string | null;

  @Column({ type: 'int', default: 0, comment: '路由权重' })
  weight!: number;

  @Column({ type: 'varchar', length: 128, nullable: true, comment: '所需权限编码' })
  permission_code!: string | null;

  @Column({ type: 'varchar', length: 32, default: 'menu', comment: '路由类型' })
  route_type!: 'menu' | 'page';

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_enabled!: boolean;

  @Column({ type: 'varchar', length: 255, default: '', comment: '备注' })
  remark!: string;
}
