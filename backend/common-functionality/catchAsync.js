/**
 * CATCH ASYNC
 * THIS METHOD CATCHES ALL ERRORS IN ALL REQUESTS IN THIS CONTROLLER
 * @param fn
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  }
};
