import {string} from 'yup';
const scheme = string().url().required();

export const view = (state, elements) => {
	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (state.rssForm.state !== 'valid') return;

		const formData = new FormData(e.target);
		const url = formData.get('rss-url');

		state.rssForm.data = {
			url,
		};
		state.rssUrls.push(url);
		// state.rssForm.state = 'sending';
		e.target.reset();
	});

	elements.urlInput.addEventListener('input', (e) => {
		const url = e.target.value;

		if (!url) {
			state.rssForm.state = 'filling';
			return;
		}

		if (state.rssUrls.includes(url)) {
			state.rssForm.state = 'actually-exist';
			return;
		}

		scheme.isValid(url).then((isValid) => {
			state.rssForm.state = isValid ? 'valid' : 'invalid';
		});
	});
};
