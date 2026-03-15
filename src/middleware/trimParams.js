export const trimParams = (req, res, next) => {
    for (const i in req.body) {
      if (typeof req.body[i] === 'string') {
        req.body[i] = req.body[i].trim();
      }
    }
    for (const i in req.query) {
      if (typeof req.query[i] === 'string') {
        req.query[i] = req.query[i].trim();
      }
    }
    next();
};