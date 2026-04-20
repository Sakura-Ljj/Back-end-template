import i18n from 'i18n';
import path from 'path';
import { DEFAULT_LOCALE } from '@/config/appConfig';

i18n.configure({
  locales: ['zh', 'en'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: DEFAULT_LOCALE,
  autoReload: true,
  header: 'x-language',
  register: global
});

export default i18n;
