const axios = require('axios');
const { OpResult } = require('./opresult');
const { pathOr } = require('ramda');

class RestOp extends OpResult {
  constructor(options = {}) {
    super(false, '', null);
    this.options = options;
    this.code = 0;
    this.complete = false;
    this.duration = 0;
  }

  execute() {
    let apiop = this;
    return new Promise(function(resolve) {
      let startTs = Date.now();
      axios(apiop.options)
        .then(function(response) {
          apiop.success = true;
          apiop.code = pathOr(0, ['status'], response);
          apiop.data = pathOr(null, ['data'], response);
          apiop.message = '';
          // repeated 3 times for Nicrosoft Edge because it does not undestand .finally. 
          apiop.complete = true;
          apiop.duration = Date.now() - startTs;
          resolve(apiop);
        })
        .catch(function(error) {
          apiop.success = false;
          apiop.code = pathOr(-1, ['response', 'status'], error);
          apiop.message = pathOr(error.message, ['response', 'statusText'], error);
          apiop.data = pathOr(null, ['response', 'data'], error);
          apiop.complete = true;
          apiop.duration = Date.now() - startTs;
          resolve(apiop);
        });
        /* finally is a better way, but Microsoft Edge does not work
        .finally(() => {
          apiop.complete = true;
          apiop.duration = Date.now() - startTs;
          resolve(apiop);
        });
        */
    });
  }

  isComplete() {
    return this.complete;
  }
}

module.exports = {
  RestOp: RestOp
};
