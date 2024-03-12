import PostItem from './components/postItem';

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

class View {
  #elements;

  #state;

  #i18n;

  constructor(elements, state, i18n) {
    this.#elements = elements;
    this.#state = state;
    this.#i18n = i18n;
  }

  render(path, value, prevValue, applyData) {
    const {
      form,
      containers,
      modal,
    } = this.#elements;

    if (path === 'form.state') {
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
      const lastFeed = applyData.args[0];

      containers.main.classList.remove('d-none');
      containers.feedsList.append(createFeed(lastFeed));
    } else if (path === 'posts') {
      const newItems = applyData.args;

      newItems
        .map((item) => {
          const element = new PostItem(item, modal, this.#i18n);
          return element.getElement();
        })
        .forEach((item) => {
          containers.postsList.prepend(item);
        });
    } else if (path === 'lang') {
      form.submitBtn.textContent = this.#i18n.t('form.submitBtn');
      form.urlInput.placeholder = this.#i18n.t('form.input');
      form.urlInput.nextElementSibling.textContent = this.#i18n.t('form.input');
    }
  }
}

export default View;
