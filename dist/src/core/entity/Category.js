"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Category {
    constructor(name, color, id) {
        if (id)
            this.id = id;
        this.name = name;
        this.color = color;
    }
}
exports.default = Category;
