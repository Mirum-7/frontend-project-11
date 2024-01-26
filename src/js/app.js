import onChange from 'on-change';
import render from './render';
import { setLocale } from 'yup';
import i18next from 'i18next';
import resources from './locals/resources';
import view from './view';

export default () => {
	setLocale({
		mixed: {
			notOneOf: { key: 'form.messages.errors.urlActuallyExist' },
		},
		string: {
			url: { key: 'form.messages.errors.invalidUrl' },
		},
	});

	const i18n = i18next.createInstance();
	i18n.init({
		lng: 'ru',
		debug: true,
		resources,
	});

	const state = {
		rssForm: {
			state: 'filling',
			error: '',
			data: {
				url: null,
			},
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

	view(watchedState, elements);
};
