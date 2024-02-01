import onChange from 'on-change';
import render from './render';
import { setLocale, string } from 'yup';
import i18next from 'i18next';
import resources from './locals/resources';
import parse from './parser';
import axios from 'axios';

const getRSS = (url) => {
	return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
		.then((response) => response.data)
		.then((data) => {
			return data.contents;
		});
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
		rssUrls: [

		],
	};

	const elements = {
		form: document.querySelector('.rss-form'),
		urlInput: document.getElementById('rss-url-input'),
		feedback: document.querySelector('.feedback'),
		submitBtn: document.getElementById('form-submit'),
	};

	elements.submitBtn.value = i18n.t('form.submitBtn');
	elements.urlInput.placeholder = i18n.t('form.input');
	elements.urlInput.nextElementSibling.textContent = i18n.t('form.input');

	const watchedState = onChange(state, render(state, elements, i18n));


	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		const formData = new FormData(e.target);
		const url = formData.get('rss-url');

		watchedState.rssForm.state = 'sending';
		scheme.validate(url)
			.then(() => {
				getRSS(url).then(parse).then(console.log)
					.then(() => {
						watchedState.rssUrls.push(url);
						// Добавлял объявление валидатора в начало, но state.rssUrls передается не по ссылке, а копируется его значение
						// Поэтому добавил его сюда, чтобы он копировал новое значение при добавление ссылок
						scheme = string().url().required().notOneOf(watchedState.rssUrls);
						watchedState.rssForm.state = 'successfully';
					})
					.catch(() => {
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
