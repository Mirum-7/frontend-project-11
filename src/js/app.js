import onChange from 'on-change';
import { render } from './render';
import { view } from './view';
import { setLocale } from 'yup';
import i18next from 'i18next';
import { resources } from './locals/resources';

export default () => {
	setLocale({
		string: {
			url: () => ({ key: 'form.errors.invalidUrl' }),
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
			errors: [

			],
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

	const watchedState = onChange(state, render(state, elements));

	view(watchedState, elements, i18n);
};
