import { AppDataSource } from '@/config/database';
import { Account } from '@/modules/auth/entity/account.entity';

export const accountRepository = AppDataSource.getRepository(Account);