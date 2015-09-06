exports.error = function log_error (err) {
  console.error(err.message);
  this.emit('end');
}

exports.warn = function log_warn (err) {
  console.warn(err.message);
  this.emit('end');
}
