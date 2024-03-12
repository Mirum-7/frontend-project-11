import axios, { AxiosError } from 'axios';
import { differenceWith, isEqual, uniqueId } from 'lodash';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import Modal from './components/modal';
import parse from './parser';
import View from './view';
import Watcher from './watcher';

const getNewItemsBy = (
  newArray,
  oldArray,
  prop,
) => differenceWith(newArray, oldArray, (value, other) => isEqual(value[prop], other[prop]));

const createScheme = (notOneOffArr = []) => string().url().required().notOneOf(notOneOffArr);

const app = (i18n) => {
  // yup
  setLocale({
    mixed: {
      notOneOf: 'form.messages.errors.urlActuallyExist',
      required: 'form.messages.errors.emptyValue',
    },
    string: {
      url: 'form.messages.errors.invalidUrl',
    },
  });

  let scheme = createScheme();

  // Components
  const modal = new Modal(i18n);

  document.body.prepend(modal.getBack());
  document.body.prepend(modal.getElement());

  // state
  const state = {
    lang: '',
    form: {
      state: null,
      error: '',
    },
    urls: [],
    channels: [],
    posts: [],
  };

  // elements
  const elements = {
    form: {
      self: document.querySelector('.rss-form'),
      urlInput: document.getElementById('rss-url-input'),
      feedback: document.querySelector('.feedback'),
      submitBtn: document.getElementById('form-submit'),
    },

    containers: {
      main: document.querySelector('.main'),
      feedsList: document.querySelector('.feeds-list'),
      postsList: document.querySelector('.posts-list'),
    },

    modal,
  };

  // add text

  // watcher
  const watcher = new Watcher(axios);
  // init view
  const view = new View(elements, state, i18n);
  // watched state
  const watchedState = onChange(state, view.render.bind(view));

  watchedState.lang = 'ru';

  watcher.start((data) => {
    const { items } = parse(data);
    const newItems = getNewItemsBy(items, state.posts, 'data');
    const itemsWithId = newItems.map((item) => ({ ...item, id: uniqueId(), visited: false }));

    if (newItems.length !== 0) {
      watchedState.posts.push(...itemsWithId);
    }
  });

  elements.form.self.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const url = formData.get('rss-url');

    watchedState.form.state = 'sending';
    scheme
      .validate(url)
      .then(() => {
        watcher.get(url)
          .then(parse)
          .then(({ channel, items }) => {
            const itemsWithId = items.map((item) => ({ ...item, id: uniqueId(), visited: false }));

            watchedState.posts.push(...itemsWithId);
            watchedState.channels.push(channel);

            watcher.add(url);

            scheme = createScheme(watchedState.urls);
            watchedState.form.state = 'successfully';
          })
          .catch((err) => {
            if (err instanceof AxiosError) {
              watchedState.form.error = 'form.messages.errors.network';
            } else {
              watchedState.form.error = 'form.messages.errors.notFoundRssContent';
            }
            watchedState.form.state = 'invalid';
          });
      })
      .catch((err) => {
        // Линетр ругается если написать err.errors[0]
        [watchedState.form.error] = err.errors;
        watchedState.form.state = 'invalid';
      });
  });
};

export default app;
