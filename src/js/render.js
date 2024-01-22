export const render = (state, elements) => (path, value, prevValue) => {
	console.log(value);
	if (path === 'rssForm.state') {
		switch (value) {
		case 'invalid':
			elements.feedback.textContent = state.rssForm.error;
			elements.urlInput.classList.add('is-invalid');

			elements.submitBtn.disabled = true;
			break;
		case 'valid':
			elements.feedback.textContent = '';
			elements.urlInput.classList.remove('is-invalid');
			elements.submitBtn.disabled = false;
			break;
		case 'filling':
			elements.feedback.textContent = '';
			elements.urlInput.classList.remove('is-invalid');
			elements.submitBtn.disabled = true;
			break;
		case 'sending':
			elements.submitBtn.disabled = true;
			elements.urlInput.disabled = true;
			break;
		case 'actually-exist':
			elements.urlInput.classList.add('is-invalid');
			elements.submitBtn.disabled = true;
			elements.feedback.textContent = state.rssForm.error;
			break;
		default:
			throw new Error(`StateError: unknown state: ${value}`);
		}
	}
};
