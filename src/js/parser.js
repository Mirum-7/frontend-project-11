
export default (data) => {
	const parser = new DOMParser();
	const document = parser.parseFromString(data, 'application/xml');
	const ctx = document.querySelector('rss');

	if (!ctx) {
		throw new Error('RSS not found');
	}

	const channelTitle = ctx.querySelector('title');
	const channelDescription = ctx.querySelector('description');
	const items = ctx.querySelectorAll('item');

	return items;
};
