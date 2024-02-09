
const createFeed = (channel) => {
	const container = document.createElement('li');
	container.classList.add('list-group-item', 'border-0', 'border-end-0');

	const title = document.createElement('h4');
	title.classList.add('h6', 'm-0');
	title.textContent = channel.title;

	const description = document.createElement('p');
	description.classList.add('m-0', 'small', 'text-black-50');
	description.textContent = channel.description;

	container.append(title, description);

	return container;
};

const createChannelItem = (item) => {
	const container = document.createElement('li');
	container.classList.add('list-group-item',
		'd-flex',
		'justify-content-between',
		'align-items-start',
		'border-0',
		'border-end-0',
	);

	const link = document.createElement('a');
	link.classList.add('fw-bold');
	link.setAttribute('target', '_blank');
	link.setAttribute('href', item.link);
	// link.setAttribute('rel', 'noopener noreferrer'); TODO: ???
	link.textContent = item.title;

	link.addEventListener('click', (e) => {
		link.classList.remove('fw-bold');
		link.classList.add('fw-normal', 'link-secondary');
	});

	const button = document.createElement('button');
	button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
	button.textContent = 'Просмотр';

	container.append(link, button);

	return container;
};

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
		console.log(path);
		switch (path) {
			case 'rssForm.state':
				switch (value) {
					case 'invalid':
						setDanger(i18n.t(state.rssForm.error));
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
			case 'rssChannels':
				elements.main.classList.remove('d-none');

				const lastChannel = value.at(-1);
				elements.feedsList.append(createFeed(lastChannel));

				const items = lastChannel.items;

				elements.postsList.append(
					...items
						.map(createChannelItem),
				);
				break;
		}
	};

	return handler;
};


export default render;
