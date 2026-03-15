import { validationResult } from "express-validator";
import { ApiError } from "../../utils/responseHandler.js";

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send(ApiError("Please fill required properties...!",errors.array(),422));
    }
    next();
};

export { validationHandler };