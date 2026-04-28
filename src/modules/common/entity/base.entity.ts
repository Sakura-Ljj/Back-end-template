import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntityColumns {
  @Column({ type: 'varchar', length: 64, default: 'system', comment: '创建人' })
  creator!: string;

  @Column({ type: 'varchar', length: 64, default: 'system', comment: '更新人' })
  updater!: string;

  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  create_at!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: '更新时间' })
  update_at!: Date;
}
