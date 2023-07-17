export default class ProductDto {
    constructor(product) {
        this._id = product._id;
        this.title = product.title;
        this.category = product.category;
        this["title/category"] = `${product.title} / ${product.category}`;
        this.description = product.description;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.stock = product.stock;
        this.__v = product.__v;
    }
}

export class UserDto {
    constructor(user) {
        this._id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.email = user.email;
        this.role = user.role;
        this.carts = user.carts;
    }
}