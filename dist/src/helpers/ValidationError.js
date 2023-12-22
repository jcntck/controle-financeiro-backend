"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.default = ValidationError;
