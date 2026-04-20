import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'tenant corp info' })
export class Corp extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, comment: 'corp id' })
  corp_id!: string;

  @Column({ type: 'varchar', length: 64, comment: 'corp name' })
  corp_name!: string;

  @Column({ type: 'boolean', default: true, comment: 'is enabled' })
  is_enabled!: boolean;

  @Column({ type: 'varchar', length: 255, default: '', comment: 'remark' })
  remark!: string;
}
