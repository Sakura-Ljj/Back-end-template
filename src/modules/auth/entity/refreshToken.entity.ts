import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: 'refresh token session' })
export class RefreshToken extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, comment: 'refresh token id' })
  token_id!: string;

  @Index()
  @Column({ type: 'varchar', length: 36, comment: 'account uid' })
  account_uid!: string;

  @Column({ type: 'varchar', length: 128, comment: 'refresh token hash' })
  token_hash!: string;

  @Column({ type: 'datetime', comment: 'expires at' })
  expires_at!: Date;

  @Column({ type: 'datetime', nullable: true, comment: 'revoked at' })
  revoked_at!: Date | null;

  @Column({ type: 'datetime', nullable: true, comment: 'last used at' })
  last_used_at!: Date | null;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'replacement token id' })
  replaced_by_token_id!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'user agent' })
  user_agent!: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true, comment: 'client ip' })
  client_ip!: string | null;
}
