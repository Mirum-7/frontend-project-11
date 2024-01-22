import onChange from 'on-change';
import {render} from './render';
import {view} from './view';


export default () => {
	const state = {
		rssForm: {
			state: 'filling',
			data: {
				url: null,
			},
		},
	};

	const elements = {
		form: document.querySelector('.rss-form'),
		urlInput: document.getElementById('rss-url-input'),
		feedback: document.querySelector('.feedback'),
		submitBtn: document.getElementById('form-submit'),
	};

	const watchedState = onChange(state, render(state, elements));

	view(watchedState, elements);
};
