const { z } = require('zod'); // Import Zod

const validate = (schema) => (req, res, next) => {
    try {
        // Parse request body with the schema
        const parsedBody = schema.parse(req.body); // Use `parse` for synchronous validation
        req.body = parsedBody;
        next();
    } catch (error) {
        // Check if error is an instance of ZodError
        if (error instanceof z.ZodError) {
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            return res.status(422).json({
                status: 422,
                message: "Validation Error",
                errors
            });
        }
        // Handle other types of errors
        console.error("Validation middleware error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};

module.exports = validate;
