/*
 * @Author: Sakura 1430008132@qq.com
 * @Date: 2026-04-20 09:42:00
 * @LastEditors: Sakura 1430008132@qq.com
 * @LastEditTime: 2026-04-29 14:44:20
 * @FilePath: \Back-end-template\src\modules\auth\entity\role.entity.ts
 * @Description: 
 */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntityColumns } from '@/modules/common/entity/base.entity';

@Entity({ comment: '角色表' })
export class Role extends BaseEntityColumns {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true, length: 64, comment: '角色编码' })
  code!: string;

  @Column({ type: 'varchar', length: 64, comment: '角色名称' })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '角色描述' })
  description!: string | null;

  @Column({ type: 'boolean', default: true, comment: '是否启用' })
  is_active!: boolean;
}
