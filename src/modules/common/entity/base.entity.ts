import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntityColumns {
  @Column({ type: 'varchar', length: 64, default: 'system', comment: 'creator' })
  creator!: string;

  @Column({ type: 'varchar', length: 64, default: 'system', comment: 'updater' })
  updater!: string;

  @CreateDateColumn({ type: 'datetime', comment: 'created time' })
  create_at!: Date;

  @UpdateDateColumn({ type: 'datetime', comment: 'updated time' })
  update_at!: Date;
}
