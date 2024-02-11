import i18next from 'i18next';
import { differenceWith, isEqual, uniqueId } from 'lodash';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import resources from './locals/resources';
import parse from './parser';
import View from './view';
import Watcher from './watcher';

export const getNewItemsBy = (newArray, oldArray, prop) => {
	return differenceWith(newArray, oldArray, (value, other) => {
		return isEqual(value[prop], other[prop]);
	});
};

const app = () => {
	// yup
	setLocale({
		mixed: {
			notOneOf: 'form.messages.errors.urlActuallyExist',
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


	// state
	const state = {
		form: {
			state: null,
			error: '',
		},
		urls: [],
		channels: [],
		posts: [],
		modal: {
			data: {
				title: '',
				description: '',
				link: '',
			},
			open: false,
		},
	};

	// dom elements
	const elements = { // TODO: do from {}, containers {}, modal {},
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

		modal: {
			self: document.querySelector('#modal'),
			closeBtns: document.querySelectorAll('[data-bs-dismiss]'),
			link: document.querySelector('[data-bs-link]'),
			back: document.querySelector('.modal-backdrop'),

			data: {
				title: document.querySelector('.modal-title'),
				description: document.querySelector('.modal-body'),
			},
		},
	};

	// add text
	elements.form.submitBtn.value = i18n.t('form.submitBtn');
	elements.form.urlInput.placeholder = i18n.t('form.input');
	elements.form.urlInput.nextElementSibling.textContent = i18n.t('form.input');

	// watcher
	const watcher = new Watcher();
	// view
	const view = new View();
	// watched state
	const watchedState = onChange(state, view.render.bind(view));
	// init view
	view.init(elements, watchedState, i18n);

	watcher.start((data) => {
		const { items } = parse(data);
		const newItems = getNewItemsBy(items, state.posts, 'data');
		newItems.forEach((item) => {
			item.id = uniqueId();
			item.visited = false;
		});

		if (newItems.length !== 0) {
			watchedState.posts.push(...newItems);
		}
	});

	elements.modal.closeBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			watchedState.modal.open = false;
		});
	});


	elements.form.self.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const url = formData.get('rss-url').trim(); // TODO: remove trim()

		watchedState.form.state = 'sending';
		scheme
			.validate(url)
			.then(() => {
				watcher.get(url)
					.then(parse)
					.then(({ channel, items }) => {
						items.forEach((item) => {
							item.id = uniqueId();
							item.visited = false;
						});
						watchedState.posts.push(...items);
						watchedState.channels.push(channel);

						watchedState.urls.push(url);
						watcher.add(url);

						scheme = string().url().required().notOneOf(watchedState.urls);
						watchedState.form.state = 'successfully';
					})
					.catch((err) => {
						console.error(err);
						watchedState.form.error = 'form.messages.errors.notFoundRssContent';
						watchedState.form.state = 'invalid';
					});
			})
			.catch((err) => {
				console.error(err);
				watchedState.form.error = err.errors[0];
				watchedState.form.state = 'invalid';
			});
	});
};

export default app;
