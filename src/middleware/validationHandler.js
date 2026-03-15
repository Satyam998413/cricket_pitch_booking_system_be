import { ZodError } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }

    next(error);
  }
};

export default validate;