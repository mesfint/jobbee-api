//Global Async Error Handler middleware
module.exports = (func) => (err, req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
