/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-27 15:10:27
 * @FilePath: \Back-end-template\src\modules\corp\entity\corp.entity.ts
 * @Description: 租户表
 */
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '租户表' })
export class Corp extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 64, comment: '租户标识' })
  corp_id!: string;

  @Column({ type: 'varchar', length: 64, comment: '租户名称' })
  corp_name!: string;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_enabled!: boolean;

  @Column({ type: 'varchar', length: 255, default: '', comment: '备注' })
  remark!: string;
}
