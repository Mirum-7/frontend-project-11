
class View {
	#elements;
	#state;
	#i18n;

	constructor(elements, state, i18n) {
		this.#elements = elements;
		this.#state = state;
		this.#i18n = i18n;
	}

	render(path, value, prevValue) {
		const { form, submitBtn, urlInput, feedback } = this.#elements;
		console.log(path, value); // TODO: remove
		if (path === 'form.state') { // TODO: replace to switch
			switch (value) {
				case 'invalid':
					feedback.classList.remove('text-success');
					feedback.classList.add('text-danger');
					feedback.textContent = this.#i18n.t(this.#state.form.error);

					submitBtn.disabled = false;
					urlInput.disabled = false;

					urlInput.focus();
					break;

				case 'sending':
					urlInput.classList.remove('is-invalid');
					feedback.classList.remove('text-danger', 'text-success');

					feedback.textContent = '';

					submitBtn.disabled = true;
					urlInput.disabled = true;
					break;

				case 'successfully':
					feedback.classList.remove('text-danger');
					feedback.classList.add('text-success');
					feedback.textContent = this.#i18n.t('form.messages.success');

					submitBtn.disabled = false;
					urlInput.disabled = false;

					form.reset();
					urlInput.focus();
					break;

				default:
					throw new Error(`StateError: unknown state: ${value}`);
			}
		} else {
			// throw new Error(`unknown state path: ${path}`); // TODO: uncomment
		}
	}
};

export default View;
