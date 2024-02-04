class TaskQueue {
  p = Promise.resolve();
  #frozen = false;
  before;
  after;

  constructor(before = 0, after = 0) {
    this.before = before;
    this.after = after;
  }

  freeze() {
    this.#frozen = true;
  }
  melt() {
    this.#frozen = false;
  }

  push(f) {
    this.p = this.p.then(
      function () {
        return new Promise(
          function (res) {
            if (!this.#frozen) f();
            res();
          }.bind(this)
        );
      }.bind(this)
    );
  }
  pushWithDelay(f) {
    this.p = this.p.then(
      function () {
        return new Promise(
          function (res) {
            if (this.#frozen) {
              res();
              return;
            }
            setTimeout(f, this.before);
            setTimeout(res, this.before + this.after);
          }.bind(this)
        );
      }.bind(this)
    );
  }
  pushForced(f) {
    this.p = this.p.then(function () {
      return new Promise(function (res) {
        f();
        res();
      });
    });
  }
}
