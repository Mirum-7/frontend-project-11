import { getNewItemsBy } from './app';

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

{/* <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a href="http://example.com/test/1707573240" class="fw-bold" data-id="24" target="_blank" rel="noopener noreferrer">Lorem ipsum 2024-02-10T13:54:00Z</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="24" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button></li> */}

const createChannelItem = (item, linkHandler) => {
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
	link.setAttribute('href', item.data.link);
	link.dataset.id = item.id;
	link.textContent = item.data.title;

	// link.addEventListener('click', linkHandler); TODO: create handler

	const button = document.createElement('button');
	button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
	button.textContent = 'Просмотр';
	button.dataset.id = item.id;

	container.append(link, button);

	return container;
};

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
		const {
			form,
			submitBtn,
			urlInput,
			feedback,
			main,
			feedsList,
			postsList,
		} = this.#elements;

		console.log(path, value); // TODO: remove
		if (path === 'form.state') { // render form // TODO: replace to switch
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
		} else if (path === 'channels') { // render feeds container
			main.classList.remove('d-none');
			feedsList.append(createFeed(value.at(-1)));
		} else if (path === 'posts') { // TODO: do refactoring
			const uniqItems = getNewItemsBy(value, prevValue, 'data');

			uniqItems.map(createChannelItem).forEach((item) => {
				postsList.prepend(item);
			});
		}
	}
};

export default View;
