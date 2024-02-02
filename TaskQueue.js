class TaskQueue {
  p = Promise.resolve();
  before = 100;
  after = 0;
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
  close(after = null) {
    this.p = this.p.then(
      function () {
        return new Promise(
          function (_, rej) {
            after();
            //make state fulfilled
            //  *promise = Promise.resolve();でもよいが
            //  *catchするとerrorを吐かない
            this.p = this.p.catch(function () {
              return new Promise(function (res) {
                res();
              });
            });
            rej();
          }.bind(this)
        );
      }.bind(this)
    );
  }
}
