import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'frontend route role relation' })
@Index(['route_id', 'role_id'], { unique: true })
export class RouteRole extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 36, comment: 'route id' })
  route_id!: string;

  @Column({ type: 'varchar', length: 36, comment: 'role id' })
  role_id!: string;
}
