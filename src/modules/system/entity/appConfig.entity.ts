import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'app config' })
@Index(['corp_id', 'config_key'])
export class AppConfig extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, comment: 'config key' })
  config_key!: string;

  @Index()
  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'corp id' })
  corp_id!: string | null;

  @Column({ type: 'text', comment: 'config value' })
  config_value!: string;

  @Column({ type: 'varchar', length: 255, default: '', comment: 'config remark' })
  remark!: string;
}
