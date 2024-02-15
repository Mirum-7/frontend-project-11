import 'bootstrap';
import i18next from 'i18next';
import app from './js/app';
import resources from './js/locals/resources';
import './scss/styles.scss';

// i18next
const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  debug: false,
  resources,
}).then(() => {
  app(i18n);
});
