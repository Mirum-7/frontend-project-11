
const createSwitchers = (target) => {
	const enable = () => {
		target.disabled = false;
	};

	const disable = () => {
		target.disabled = true;
	};

	return [enable, disable];
};

const createClassSwitchers = (target) => (className) => {
	const remove = () => {
		target.classList.remove(className);
	};

	const add = () => {
		target.classList.add(className);
	};

	return [remove, add];
};

const createFeedbackSetters = (target) => (...classNames) => {
	const setters = classNames.map((className) => {
		const setMessageWithClass = (message) => {
			target.classList.remove(...classNames);
			target.classList.add(className);

			target.textContent = message;
		};

		return setMessageWithClass;
	});

	const clear = () => {
		target.classList.remove(...classNames);

		target.textContent = '';
	};

	return [...setters, clear];
};

const render = (state, elements, i18n) => {
	const [enableBtn, disableBtn] = createSwitchers(elements.submitBtn);
	const [enableInput, disableInput] = createSwitchers(elements.urlInput);

	const [setValidInput, setInvalidInput] = createClassSwitchers(elements.urlInput)('is-invalid');

	const [setDanger, setSuccess, clearMessage] = createFeedbackSetters(elements.feedback)('text-danger', 'text-success');
	const handler = (path, value, prevValue) => {
		console.log(path, value); // TODO: remove
		switch (path) {
			case 'form.state':
				switch (value) {
					case 'invalid':
						setDanger(i18n.t(state.form.error));
						setInvalidInput();
						enableBtn();
						enableInput();
						elements.urlInput.focus();
						break;

					case 'sending':
						clearMessage();
						disableBtn();
						disableInput();
						break;

					case 'successfully':
						setSuccess(i18n.t('form.messages.success'));
						setValidInput();
						enableBtn();
						enableInput();
						elements.form.reset();
						elements.urlInput.focus();
						break;

					default:
						throw new Error(`StateError: unknown state: ${value}`);
				}
				break;
		}
	};

	return handler;
};


export default render;
