import axios from 'axios';
import i18next from 'i18next';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import resources from './locals/resources';
import parse from './parser';
import render from './render';


const getRSS = (url) => {
	return axios
		.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
		.then((response) => response.data)
		.then((data) => data.contents);
};

export default () => {
	setLocale({
		mixed: {
			notOneOf: 'form.messages.errors.urlActuallyExist',
		},
		string: {
			url: 'form.messages.errors.invalidUrl',
		},
	});

	let scheme = string().url().required();

	const i18n = i18next.createInstance();
	i18n.init({
		lng: 'ru',
		debug: true,
		resources,
	});

	const state = {
		rssForm: {
			state: null,
			error: '',
		},
		rssUrls: [],
		rssChannels: [],
	};

	const elements = {
		form: document.querySelector('.rss-form'),
		urlInput: document.getElementById('rss-url-input'),
		feedback: document.querySelector('.feedback'),
		submitBtn: document.getElementById('form-submit'),
		main: document.querySelector('.main'),
		feedsList: document.querySelector('.feeds-list'),
		postsList: document.querySelector('.posts-list'),
	};

	elements.submitBtn.value = i18n.t('form.submitBtn');
	elements.urlInput.placeholder = i18n.t('form.input');
	elements.urlInput.nextElementSibling.textContent = i18n.t('form.input');

	const watchedState = onChange(state, render(state, elements, i18n));

	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const url = formData.get('rss-url').trim();

		watchedState.rssForm.state = 'sending';
		scheme
			.validate(url)
			.then(() => {
				getRSS(url)
					.then(parse)
					.then((channel) => {
						watchedState.rssChannels.push(channel);
						watchedState.rssUrls.push(url);
						// Добавлял объявление валидатора в начало, но state.rssUrls передается не по ссылке, а копируется его значение
						// Поэтому добавил его сюда, чтобы он копировал новое значение при добавление ссылок
						scheme = string().url().required().notOneOf(watchedState.rssUrls);
						watchedState.rssForm.state = 'successfully';
					})
					.catch((err) => {
						watchedState.rssForm.error = 'form.messages.errors.notFoundRssContent';
						watchedState.rssForm.state = 'invalid';
					});
			})
			.catch((err) => {
				watchedState.rssForm.error = err.errors[0];
				watchedState.rssForm.state = 'invalid';
			});
	});
};
