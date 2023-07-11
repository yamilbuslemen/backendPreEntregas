import { __dirname } from "../utils.js";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
    constructor(fileName) {
        this.path = path.join(__dirname, `/files/${fileName}`); //src/files/carts.json
    };

    fileExists() {
        return fs.existsSync(this.path);
    }

    generateId() {
        return uuidv4();
    }

    async getAll() {
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                return carts;
            } else {
                throw new Error("No es posible obtener los carritos");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async getCartById(id) {
        try {
            if (this.existsFile()) {
                let data = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                this.carts = [];
                throw new Error('No se encontro el archivo de carrito, se cargará un arreglo vacío.')
            }
            let cart = this.carts.find((cart) => cart.id == id);
            if (!cart) {
                console.error('Carrito no encontrado');
                return;
            }
            return cart;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async save() {
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                let newId = uuidv4();
                const newCart = {
                    id: newId,
                    products: []
                };
                carts.push(newCart);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return newCart;
            } else {
                throw new Error("No es posible esta operacion");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async saveCart() {
        try {
            const data = JSON.stringify(this.carts, null, 4);
            await fs.promises.writeFile(this.path, data);
            return 'Archivo de carrito guardado.';
        } catch (error) {
            throw new Error('No se pudo guardar el archivo de carrito.');
        }
    }


    async updateCart(cid, pid) {
        try {
            let cart = await this.getCartById(cid);
            if (!cart) return;
            Object.keys(updatedFields).forEach((key) => {
                cart[key] = updatedFields[key];
            });
            const data = JSON.stringify(this.carts, null, 4);
            await fs.promises.writeFile(this.path, data);
            console.log('Carrito actualizado:', cart);
            return 'Archivo de carrito guardado.';
        } catch (error) {
            throw new Error(error.message);
        }
    }
}