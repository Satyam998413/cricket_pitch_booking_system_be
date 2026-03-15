export const requestHandler = (req, res, next) => {
    const err = new Error(`Requested url ${req.path} not found`);
    err.statusCode = 404;
    next(err);
}