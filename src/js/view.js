import {string} from 'yup';

export const view = (state, elements) => {
	const scheme = string().url().required();

	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (state.rssForm.state !== 'valid') return;

		const formData = new FormData(e.target);
		state.rssForm.data = {
			url: formData.get('rss-url'),
		};
		state.rssForm.state = 'sending';
		// e.target.reset();
	});

	elements.urlInput.addEventListener('input', (e) => {
		const url = e.target.value;
		if (url) {
			scheme.isValid(url).then((isValid) => {
				state.rssForm.state = isValid ? 'valid' : 'invalid';
			});
			return;
		}
		state.rssForm.state = 'filling';
	});
};
