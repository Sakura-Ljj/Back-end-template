import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '应用配置表' })
@Index(['corp_id', 'config_key'])
export class AppConfig extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, comment: '配置键' })
  config_key!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: '租户标识' })
  corp_id!: string | null;

  @Column({ type: 'text', comment: '配置值' })
  config_value!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: '配置备注' })
  remark!: string;
}
