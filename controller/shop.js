//const products = [];

const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
    Product.fetch().then(products => {
        res.render('shop/product-list', { prods: products, docTitle: 'All Products', path: '/products' });
    }).catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    //to get the value of the promise we have to use ([]) because its an array of array which is passed
    //also we need to pass product[0] because its an array of array which is the result we get

    // Product.findAll({where : {id : prodId}}).then( products => {
    //     res.render('shop/product-detail',{product: products[0], pageTitle: products[0].title,path:'/products'});
    // }).catch(err => console.log(err));

    //findById is replaced by findByPk in current sequelize version
    Product.findById(prodId).then(product => {
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
    }).catch(err => {
        console.log(err);
    });
}

exports.getIndex = (req, res, next) => {
    Product.fetch().then(products => {
        res.render('shop/index', { prods: products, docTitle: 'Shop', path: '/' });
    }).catch(err => {
        console.log(err);
    });
    /*Product.fetchAll.then(result =>{
        console.log(result);
    });*/
    /*Product.fetchAll.then(products => {
        res.render('shop/index',{prods:products,docTitle:'Shop', path:'/'});
    }).catch(err => {
        console.log(err);
    });*/
}

exports.getCart = (req, res, next) => {
    req.user.getCart().then(products => {
        //it creates a magic function that checks in CartItem table having a cart with that product id
        return res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
        });
    }).catch(err => console.log(err));
}
/* Cart.getProducts(cart => {
    //why we are calling product 
    //because cart doesn't give all information we need
    //we have to use cart id and using products we fetch information about product like title 
    Product.fetchAll( products =>{
        const cartProducts = []
        for(product of products){
            const cartProductData = cart.products.find(prod => prod.id === product.id);
            if(cartProductData){
                // we are storing qty because product doesn't have it and only cart has it
                cartProducts.push({productData: product, qty:cartProductData.qty});
            }
        }
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products: cartProducts
        });
    });
});*/

// }

exports.postCart = (req, res, next) => {

    // if i have a product in cart then increase the quantity otherwise add add the product
    const prodId = req.body.productId;
    Product.findById(prodId).then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result);
        res.redirect('/cart');
    }).catch(err => {
        console.log(err);
    })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart().then(cart => {
    //     // this cart is not available near the statement Product.findByPk so to get that
    //     fetchedCart = cart;
    //     return cart.getProducts({where : {id: prodId}});
    // }).then(products =>{
    //     let product;
    //     if(products.length > 0){
    //         product = products[0];
    //     }
    //     //if we do have a product add the quantity
    //     if(product){
    //         console.log(product.cartItem.quantity);
    //         const oldQuantity = product.cartItem.quantity;
    //         newQuantity = oldQuantity + 1;
    //         return product;
    //     }
    //     // if we have no product
    //     return Product.findByPk(prodId);
    // }).then(product =>{
    //     return fetchedCart.addProduct(product,{through: {quantity: newQuantity}});
    // }).then(()=>{
    //     res.redirect('/cart');
    // }).catch(err => console.log(err));
    //res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next)=>{
    const prodId = req.body.productId;

    req.user.deleteItemFromCart(prodId).then(result =>{
        console.log(result);
        res.redirect('/cart');
    }).catch(err => { 
        console.log(err);
    });
}


exports.getOrders = (req,res,next) =>{
     //if you console log you will see that orders are not linked with orderItem in any of the orders
        //using eager loading which is
        //if we want to fetch related products in order we have to provide a field products
        //why products because order belongs to many product
        //the name sequelize.define has a product as a name in model
        //sequelize pluralizes this
        //eager loading when fetching orders please fetch products
        //each order will have product
    req.user.getOrders().then(orders =>{

        console.log(orders);
        res.render('shop/orders',{
            path: '/orders',
            pageTitle: 'Your Orders',
            orders: orders
        });
    });

}

exports.postOrders = (req,res,next) =>{
    let fetchedCart;
    req.user.addOrder().then(result=>{
        res.redirect('/orders');
    }).catch(err => console.log(err));
}

// exports.getCheckout = (req,res,next) =>{
//     res.render('shop/checkout',{
//         path: '/checkout',
//         pageTitle: 'Checkout'
//     });
// }

exports.get404 = (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'page Not Found', path: '/404' });
}