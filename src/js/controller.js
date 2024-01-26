import { string } from 'yup';

export default (state, elements) => {
	let scheme = string().url().required();

	elements.form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (state.rssForm.state !== 'valid') return;

		const formData = new FormData(e.target);
		const url = formData.get('rss-url');

		state.rssForm.data = {
			url,
		};

		state.rssForm.state = 'sending';
		state.rssUrls.push(url);
		// Добавлял объявление валидатора в начало, но state.rssUrls передается не по ссылке, а копируется его значение
		// Поэтому добавил его сюда, чтобы он копировал новое значение при добавление ссылок
		scheme = string().url().required().notOneOf(state.rssUrls);
		state.rssForm.state = 'successfully';
	});

	elements.urlInput.addEventListener('input', (e) => {
		const url = e.target.value;

		if (!url) {
			state.rssForm.state = 'filling';
			return;
		}
		scheme.validate(url)
			.then(() => {
				state.rssForm.state = 'valid';
			})
			.catch((err) => {
				state.rssForm.error = err.errors[0];
				state.rssForm.state = 'invalid';
			});
	});
};
