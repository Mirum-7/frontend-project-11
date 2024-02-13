import onChange from 'on-change';

const HTML = `
<div class="modal-dialog" role="document">
<div class="modal-content">
	<div class="modal-header">
		<h5 class="modal-title">Modal title</h5>
		<button
			type="button"
			class="btn-close close"
			data-bs-dismiss="modal"
			aria-label="Close"
		></button>
	</div>
	<div class="modal-body text-break">Modal body</div>
	<div class="modal-footer">
		<a
			class="btn btn-primary full-article"
			href="#"
			role="button"
			target="_blank"
			data-bs-link="modal"
		>
			Читать полностью
		</a>
		<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
	</div>
</div>
</div>`;

class Modal {
	constructor(local) {
		this.state = onChange({
			open: false,
			data: {
				title: null,
				body: null,
				link: null,
			},
		}, this.render.bind(this));

		this.local = local;
		this.elements = this.create();
	}

	create() {
		const modal = document.createElement('div');
		modal.classList.add('modal', 'fade', 'd-none');
		modal.id = 'modal';
		modal.style = 'display: block';
		modal.role = 'dialog';
		modal.innerHTML = HTML;

		const back = document.createElement('div');
		back.classList.add('modal-backdrop', 'fade', 'd-none');

		const closeBtns = modal.querySelectorAll('[data-bs-dismiss]');
		closeBtns[1].textContent = this.local.t('modal.closeButton');

		closeBtns.forEach((btn) => {
			btn.addEventListener('click', () => this.close());
		});

		const link = modal.querySelector('[data-bs-link]');
		link.textContent = this.local.t('modal.link');

		return {
			self: modal,
			back,
			closeBtns,
			link,

			title: modal.querySelector('.modal-title'),
			body: modal.querySelector('.modal-body'),
		};
	}

	open() {
		this.state.open = true;
	}

	close() {
		this.state.open = false;
	}

	setTitle(text) {
		this.state.data.title = text;
	}

	setBody(text) {
		this.state.data.body = text;
	}

	setLink(text) {
		this.state.data.link = text;
	}

	getElement() {
		return this.elements.self;
	}

	getBack() {
		return this.elements.back;
	}

	render(path, value, prevValue) {
		switch (path) {
			case 'data.title':
				this.elements.title.textContent = value;
				break;
			case 'data.body':
				this.elements.body.textContent = value;
				break;
			case 'data.link':
				this.elements.link.href = value;
				break;
			case 'open':
				if (value) {
					this.elements.self.classList.add('show');
					this.elements.self.classList.remove('d-none');

					this.elements.back.classList.add('show');
					this.elements.back.classList.remove('d-none');
				} else {
					this.elements.self.classList.remove('show');
					this.elements.self.classList.add('d-none');

					this.elements.back.classList.remove('show');
					this.elements.back.classList.add('d-none');
				}
				break;
		}
	}
};

export default Modal;
