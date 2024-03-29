const parsItem = (item) => {
  const titleElement = item.querySelector('title');
  const title = titleElement.textContent;

  const descriptionElement = item.querySelector('description');
  const description = descriptionElement.textContent;

  const linkElement = item.querySelector('link');
  const link = linkElement.textContent;

  return {
    data: {
      title,
      description,
      link,
    },
  };
};

export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'application/xml');
  const ctx = document.querySelector('rss');

  if (!ctx) {
    throw new Error('RSS not found');
  }

  const channelTitleElement = ctx.querySelector('title');
  const channelTitle = channelTitleElement.textContent;

  const channelDescriptionElement = ctx.querySelector('description');
  const channelDescription = channelDescriptionElement.textContent;

  const itemElements = Array.from(ctx.querySelectorAll('item'));
  const items = itemElements.map(parsItem).reverse();

  const channel = {
    title: channelTitle,
    description: channelDescription,
  };

  return {
    channel,
    items,
  };
};
