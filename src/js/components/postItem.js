import onChange from 'on-change';

const HTML = `
<a class="fw-bold" target="_blank" href="#" data-id="">Title</a>
<button class="btn btn-outline-primary btn-sm" data-id="">Просмотр</button>
`;

class PostItem {
  constructor(data, modal, local) {
    this.state = onChange({
      visited: false,
      data,
    }, this.render.bind(this));

    this.local = local;
    this.elements = this.create(modal);
  }

  create(modal) {
    const item = document.createElement('li');
    item.classList.add(
      'post-item',
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    item.innerHTML = HTML;

    const link = item.querySelector('a');
    link.textContent = this.state.data.title;
    link.dataset.id = item.id;
    link.href = this.state.data.link;

    const button = item.querySelector('button');
    button.textContent = this.local.t('watchButton');

    link.addEventListener('click', () => {
      this.state.visited = true;
    });

    button.addEventListener('click', () => {
      this.state.visited = true;

      modal.setTitle(this.getData().title);
      modal.setBody(this.getData().description);
      modal.setLink(this.getData().link);

      modal.open();
    });

    return { self: item, link, button };
  }

  getData() {
    return this.state.data;
  }

  getElement() {
    return this.elements.self;
  }

  render(path) {
    switch (path) {
      case 'visited':
        this.elements.link.classList.add('fw-normal', 'link-secondary');
        this.elements.link.classList.remove('fw-bold');
        break;
      default:
        throw new Error(`unknown path: ${path}`);
    }
  }
}

export default PostItem;
