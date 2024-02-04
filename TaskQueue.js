class TaskQueue {
  p = Promise.resolve();
  before;
  after;
  constructor(before = 0, after = 0) {
    this.before = before;
    this.after = after;
  }
  push(f) {
    this.p = this.p.then(function () {
      return new Promise(function (res) {
        f();
        res();
      });
    });
  }
  pushWithDelay(f) {
    this.p = this.p.then(
      function () {
        return new Promise(
          function (res) {
            setTimeout(f, this.before);
            setTimeout(res, this.before + this.after);
          }.bind(this)
        );
      }.bind(this)
    );
  }
}
