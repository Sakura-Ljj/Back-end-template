import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '刷新令牌会话表' })
export class RefreshToken extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, comment: '刷新令牌标识' })
  token_id!: string;

  @Index()
  @Column({ type: 'varchar', length: 36, comment: '账号唯一标识' })
  account_uid!: string;

  @Column({ type: 'varchar', length: 128, comment: '刷新令牌哈希' })
  token_hash!: string;

  @Column({ type: 'datetime', comment: '过期时间' })
  expires_at!: Date;

  @Column({ type: 'datetime', nullable: true, comment: '吊销时间' })
  revoked_at!: Date | null;

  @Column({ type: 'datetime', nullable: true, comment: '最后使用时间' })
  last_used_at!: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '替换后的令牌标识' })
  replaced_by_token_id!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '用户代理' })
  user_agent!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: '客户端 IP' })
  client_ip!: string | null;
}
