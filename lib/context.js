const delegate = require('delegates');
const Delegate = require('a');

const context = (module.exports = {
  onerror(err) {
    if (!err) return;
    this.app.emit('error', err, this);
  },
});

Delegate(context, 'response')
  .access('body')
  .access('status')
  .method('set');

Delegate(context, 'request')
  .getter('url')
  .getter('headers')
  .getter('method');
