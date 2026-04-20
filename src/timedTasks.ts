import log from '@/utils/log';

export const startTimedTasks = () => {
  log.child({ module: 'timedTasks' }).info('timedTasks.initialized');
};
