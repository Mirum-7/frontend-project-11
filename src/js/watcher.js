class Watcher {
  #urls;

  #server;

  #interval;

  constructor(server, urls = [], interval = 5000) {
    this.#server = server;
    this.#urls = [...urls];
    this.#interval = interval;
  }

  start(callback) {
    setTimeout(() => this.check(callback), this.#interval);
  }

  check(callback) {
    this.#urls.forEach((url) => {
      this.get(url)
        .then(callback)
        .catch(() => {
          this.remove(url);
        });
    });

    setTimeout(() => this.check(callback), this.#interval);
  }

  get(url) {
    return this.server
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
}

export default Watcher;
