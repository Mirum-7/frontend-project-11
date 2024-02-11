/**
 * TODO:
 * - remake render
 * - easy way to Watched state
 * - remake handlers
 *
*/

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

const createChannelItem = (item, linkHandler, buttonHandler) => {
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

	link.addEventListener('click', linkHandler);

	const button = document.createElement('button');
	button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
	button.textContent = 'Просмотр';
	button.dataset.id = item.id;

	button.addEventListener('click', buttonHandler);

	container.append(link, button);

	return container;
};

class View {
	#elements;
	#state;
	#i18n;

	init(elements, state, i18n) {
		this.#elements = elements;
		this.#state = state;
		this.#i18n = i18n;
	}

	render(path, value, prevValue) {
		const {
			form,
			containers,
			modal,
		} = this.#elements;

		// console.log(path, value); // TODO: remove
		if (path === 'form.state') { // render form // TODO: replace to switch
			switch (value) {
				case 'invalid':
					form.feedback.classList.remove('text-success');
					form.feedback.classList.add('text-danger');
					form.feedback.textContent = this.#i18n.t(this.#state.form.error);

					form.submitBtn.disabled = false;
					form.urlInput.disabled = false;

					form.urlInput.focus();
					break;

				case 'sending':
					form.urlInput.classList.remove('is-invalid');
					form.feedback.classList.remove('text-danger', 'text-success');

					form.feedback.textContent = '';

					form.submitBtn.disabled = true;
					form.urlInput.disabled = true;
					break;

				case 'successfully':
					form.feedback.classList.remove('text-danger');
					form.feedback.classList.add('text-success');
					form.feedback.textContent = this.#i18n.t('form.messages.success');

					form.submitBtn.disabled = false;
					form.urlInput.disabled = false;

					form.self.reset();
					form.urlInput.focus();
					break;

				default:
					throw new Error(`StateError: unknown state: ${value}`);
			}
		} else if (path === 'channels') { // render feeds container
			containers.main.classList.remove('d-none');
			containers.feedsList.append(createFeed(value.at(-1)));
		} else if (path === 'posts') {
			const newItems = getNewItemsBy(value, prevValue, 'data');

			const linkHandler = (e) => {
				const target = e.target;
				const dataId = target.dataset.id;
				const currentItem = this.#state.posts.find((item) => item.id == dataId);

				currentItem.visited = true;
			};

			const buttonHandler = (e) => {
				const target = e.target;
				const dataId = target.dataset.id;
				const currentItem = this.#state.posts.find((item) => item.id == dataId);

				currentItem.visited = true;

				this.#state.modal.data.title = currentItem.data.title;
				this.#state.modal.data.description = currentItem.data.description;
				this.#state.modal.link = currentItem.data.link;

				this.#state.modal.open = true;
			};

			newItems
				.map((item) => createChannelItem(item, linkHandler, buttonHandler))
				.forEach((item) => {
					containers.postsList.prepend(item);
				});
		} else if (path === 'modal.open') {
			if (value) {
				modal.self.classList.add('show');
				modal.self.classList.remove('d-none');

				modal.back.classList.add('show');
				modal.back.classList.remove('d-none');

				modal.data.title.textContent = this.#state.modal.data.title;
				modal.data.description.textContent = this.#state.modal.data.description;
				modal.link.href = this.#state.modal.data.link;
			} else {
				modal.self.classList.remove('show');
				modal.self.classList.add('d-none');

				modal.back.classList.remove('show');
				modal.back.classList.add('d-none');
			}
		} else if (path.match(/posts\.\d+\.visited/)) {
			const id = +path.split('.')[1] + 1;
			const link = document.querySelector(`a[data-id="${id}"]`);

			link.classList.add('fw-normal', 'link-secondary');
			link.classList.remove('fw-bold');
		}
	}
};

export default View;
