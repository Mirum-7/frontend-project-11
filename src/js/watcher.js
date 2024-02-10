import axios from 'axios';

class Watcher {
	#urls;
	#interval;

	constructor(urls = [], interval = 5000) {
		this.#urls = [...urls];
		this.#interval = interval;
	}

	start(callback) {
		this.#urls.forEach((url) => {
			this.once(url)
				.then(callback)
				.catch((err) => {
					console.error(err);
					console.log(`removed: ${url}`);
					this.remove(url);
				});
		});

		setTimeout(() => this.start(callback), this.#interval);
	}

	once(url) {
		return axios
			.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
			.then((response) => response.data)
			.then((data) => data.contents);
	}

	add(url) {
		this.#urls.push(url);
	}

	remove(url) {
		this.#urls = this.#urls.filter((el) => el !== url);
	}
};

export default Watcher;
