import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '前端路由角色关联表' })
@Index(['route_id', 'role_id'], { unique: true })
export class RouteRole extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: '路由主键' })
  route_id!: string;

  @Column({ type: 'varchar', length: 36, comment: '角色主键' })
  role_id!: string;
}
