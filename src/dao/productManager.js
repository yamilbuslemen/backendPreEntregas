import {__dirname} from "../utils.js";
import path from "path";
import fs from "fs";
import {v4 as uuidv4} from 'uuid';

export class ProductManager {
    constructor(fileName) {
        this.path=path.join(__dirname,`/files/${fileName}`); //src/files/products.json
        this.products = [];
        this.loadProducts();
    }

    fileExists(){
        return fs.existsSync(this.path);
    }


    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            } else {
                throw new Error("No es posible obtener los productos!");
            }
            console.log("loadProducts: ", this.products);
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    generateId() {
        let newId = uuidv4();
        return newId
        /*
        return this.products.length > 0
            // ? Math.max(...this.products.map((product) => product.id)) + 1
            : 1;
        */
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error saving products:', error);
        }
    }

    addProduct(product) {
        if (!product.title || product.title == "" || !product.description || product.description == "" || !product.price || product.price == 0 || !product.code || product.code == "" || !product.stock || !product.status || product.category == "" || !product.category) {
            console.error('All fields are required');
            return;
        }

        const existingProduct = this.products.find((p) => p.code === product.code);
        if (existingProduct) {
            console.error('Product with the same code already exists');
            return;
        }

        const newProduct = {
            id: this.generateId(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnail: product.thumbnail,
            code: product.code,
            stock: product.stock,
            status: product.status,
            category: product.category
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            console.error('Not found');
            return;
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('Not found');
            return;
        } else {
            console.log("Producto para update encontrado!");
        }

        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        this.saveProducts();
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.error('Not found');
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
    }
}