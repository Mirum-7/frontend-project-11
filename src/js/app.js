import i18next from 'i18next';
import { differenceWith, isEqual, uniqueId } from 'lodash';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import resources from './locals/resources';
import parse from './parser';
import View from './view';
import Watcher from './watcher';
import Modal from './components/modal';
import { AxiosError } from 'axios';

const getNewItemsBy = (newArray, oldArray, prop) => {
	return differenceWith(newArray, oldArray, (value, other) => {
		return isEqual(value[prop], other[prop]);
	});
};

const app = () => {
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

	let scheme = string().url().required();

	// i18next
	const i18n = i18next.createInstance();
	i18n.init({
		lng: 'ru',
		debug: false,
		resources,
	});

	// Components
	const modal = new Modal(i18n);

	document.body.prepend(modal.getBack());
	document.body.prepend(modal.getElement());

	// state
	const state = {
		lang: 'ru',
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
	elements.form.submitBtn.value = i18n.t('form.submitBtn');
	elements.form.urlInput.placeholder = i18n.t('form.input');
	elements.form.urlInput.nextElementSibling.textContent = i18n.t('form.input');

	// watcher
	const watcher = new Watcher();
	// init view
	const view = new View(elements, state, i18n);
	// watched state
	const watchedState = onChange(state, view.render.bind(view));


	watcher.start((data) => {
		const { items } = parse(data);
		const newItems = getNewItemsBy(items, state.posts, 'data');
		newItems.forEach((item) => {
			item.id = uniqueId();
		});

		if (newItems.length !== 0) {
			watchedState.posts.push(...newItems);
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
						items.forEach((item) => {
							item.id = uniqueId();
						});
						watchedState.posts.push(...items);
						watchedState.channels.push(channel);

						watchedState.urls.push(url);
						watcher.add(url);

						scheme = string().url().required().notOneOf(watchedState.urls);
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
				watchedState.form.error = err.errors[0];
				watchedState.form.state = 'invalid';
			});
	});
};

export default app;
