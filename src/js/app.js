import i18next from 'i18next';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import resources from './locals/resources';
import parse from './parser';
import Watcher from './watcher';
import View from './view';
import { differenceWith, isEqual, uniqueId } from 'lodash';

const postsIsEqual = (post, other) => {
	return post.title === other.title &&
		post.description === other.description &&
		post.link === other.link;
};

export default () => {
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
	};

	// dom elements
	const elements = {
		form: document.querySelector('.rss-form'),
		urlInput: document.getElementById('rss-url-input'),
		feedback: document.querySelector('.feedback'),
		submitBtn: document.getElementById('form-submit'),

		main: document.querySelector('.main'),
		feedsList: document.querySelector('.feeds-list'),
		postsList: document.querySelector('.posts-list'),
	};

	// add text
	elements.submitBtn.value = i18n.t('form.submitBtn');
	elements.urlInput.placeholder = i18n.t('form.input');
	elements.urlInput.nextElementSibling.textContent = i18n.t('form.input');

	// watcher
	const watcher = new Watcher();
	// view
	const view = new View(elements, state, i18n);
	// watched state
	const watchedState = onChange(state, view.render.bind(view));

	watcher.start((data) => {
		const { items } = parse(data);
		const uniqItems = differenceWith(items, state.posts, postsIsEqual);
		uniqItems.forEach((item) => {
			item.id = uniqueId();
			item.visited = false;
		});
		watchedState.posts.push(...uniqItems);
	});


	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const url = formData.get('rss-url').trim();

		watchedState.form.state = 'sending';
		scheme
			.validate(url)
			.then(() => {
				watcher.once(url)
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
