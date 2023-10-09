const fs = require('fs');
const { json } = require('stream/consumers');
class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado,
    // asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).

    async addProduct(title, description, price, thumbnail, code, stock) {

        if (!title, !description, !price, !thumbnail, !code, !stock) {
            console.error('The title, description, price, thumbnail, code, and stock fields are required 🎯');
            return;
        }
        try {
            const products = await getJsonFromFile(this.path);
            const existingProduct = products.find(product => product.code === code);
            if (existingProduct) {
                console.error('There is already a product with that code');
                return;
            } else {
                const newProduct = {
                    id: products.length + 1,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock,
                }
                products.push(newProduct)
                await saveJsonInFile(this.path, products)
                console.log('The product was added 😎')
            }
        } catch (error) {
            console.error('Error adding product:', error)
        }
    }

    // Debe tener un método getProducts, el cual debe leer el archivo de productos y
    // devolver todos los productos en formato de arreglo.
    async getProducts() {
        try {
            return getJsonFromFile(this.path)
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo,
    // // debe buscar el producto con el id especificado y devolverlo en formato objeto
    async getProductById(productId) {
        try {
            const products = await getJsonFromFile(this.path)
            console.log(products)
            const product = products.find(product => product.id === productId);
            if (!product) {
                return 'Product Not found! 😨';
            } else {
                return product
            }
        } catch (error) {
            console.error(error)
        }

    }

    // Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar,
    // así también como el campo a actualizar (puede ser el objeto completo, como en una DB),
    // y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID
    async updateProduct(id, data) {
        const { title, description, price, thumbnail, code, stock } = data;
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((u) => u.id === id);
        if (position === -1) {
            console.error('Producto no encontrado 😨');
            return;
        }
        if (title) {
            products[position].title = title;
        }
        if (description) {
            products[position].description = description;
        }
        if (price) {
            products[position].price = price;
        }
        if (thumbnail) {
            products[position].thumbnail = thumbnail;
        }
        if (code) {
            products[position].code = code;
        }
        if (stock) {
            products[position].stock = stock;
        }
        await saveJsonInFile(this.path, products);
        console.log('Product updated! 😎');
    }


    // Debe tener un método deleteProduct, el cual debe recibir un id y
    // debe eliminar el producto que tenga ese id en el archivo.
    async deleteProduct(id) {
        const products = await getJsonFromFile(this.path);
        const position = products.findIndex((product) => product.id === id);
        if (position >= 0) {
            products.splice(position, 1);
            await saveJsonInFile(this.path, products);
            console.log('Product deleted! 😎');
        } else {
            console.log('There is no product with that ID')
        }

    }
}
    const getJsonFromFile = async (path) => {
        if (!fs.existsSync(path)) {
            return [];
        }
        const content = await fs.promises.readFile(path, 'utf-8');
        return JSON.parse(content);
    };

    const saveJsonInFile = (path, data) => {
        const content = JSON.stringify(data, null, '\t');
        return fs.promises.writeFile(path, content, 'utf-8');
    }


async function test() {
    //Creo una instancia de la clase “ProductManager”
    const productManager = new ProductManager('./products.json');
    //Llamo “getProducts” recién creada la instancia
    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    await productManager.addProduct('Apple Ipad 10 9 10th', 'Tablet de ultima generación', 959, './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi', 5698, 20)

    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    // Pruebo agregar un producto sin un parametro obligatorio.
    await productManager.addProduct('Apple Ipad 10 9 10th', 959, './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi', 5698, 20);
    // Agrego producto con todos los parametros.
    await productManager.addProduct('Apple Ipad 10 9 10th', 'Tablet de ultima generación', 959, './img/cel-tecno/apple-ipad-10-9-10th-gen-wifi', 5698, 20);
    // Me fijo si lo agrego al array de productos
    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });


    //Pruebo agregar un producto con un codigo ya existente.
    await productManager.addProduct('Cel Samsung Galaxy A04', 'Uno de los celulares mas venididos del 2022', 179, './img/cel-tecno/cel-samsung-galaxy-a04', 5698, 20);
    // Agrego segundo producto
    await productManager.addProduct('Cel Samsung Galaxy A04', 'Uno de los celulares mas venididos del 2022', 179, './img/cel-tecno/cel-samsung-galaxy-a04', 5699, 20);
    //Me fijo si lo agrego al array de productos
    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    // Agrego dos productos más.
    await productManager.addProduct('Cel Xiaomi Redmi 10a', 'Uno de los celulares mas venididos del 2021', 153, './img/cel-tecno/xiaomi-redmi-10a', 5700, 20);
    await productManager.addProduct('ASUS Vivobook m513ia bq322t', 'Computador portatil de gran performace', 800, './img/notebooks/asus-vivobook-m513ia', 5701, 10);


    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    // // Pruebo traer un producto de id inexistente
    await productManager.getProductById(5)
        .then(product => {
            console.log('Product By Id:', product);
        })
        .catch(error => {
            console.error(error);
        });
    // // Pruebo traer un producto de id existente
    await productManager.getProductById(3)
        .then(product => {
            console.log('Product By Id:', product);
        })
        .catch(error => {
            console.error(error);
        });



    const data = {
        id: 1,
        title: 'Prueba 1',
        description: 'Ningun',
        price: 100000000,
        thumbnail: 'no tengo',
        code: 2315,
        stock: 0
    }
    await productManager.updateProduct(1, data)

    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });

    await productManager.deleteProduct(1);

    await productManager.getProducts()
        .then(products => {
            console.log(products);
        })
        .catch(error => {
            console.error(error);
        });
}

test();
