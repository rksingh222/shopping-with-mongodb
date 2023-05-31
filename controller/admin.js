
const Product = require("../models/product");


//commented code has sequelize only with product and no user

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', { pageTitle: 'Add Product', path: '/admin/add-product', editing: false });
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body); // the output comes undefined we need to parse it which is not happening so to parse we need to register parser
    //products.push({ title: req.body.title });
    //passing userId when passed from app.js 
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    //with belongs to hasmany association  
    //for user it creates a Product  we can call this method because sequelize  hasmany relationship 
    const product = new Product(title, price, description, imageUrl, null, req.user._id);
    product.save().then(result => {
        res.redirect('/admin/products');
        console.log("Product Created");
    }).catch(err => {
        console.log(err);
    });

    // this will also work 
    /*Product.create({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id  //we are getting the value from app.js 
    }).then(result => {
        res.redirect('/admin/products');
        console.log("Product Created");
    }).catch(err => {
        console.log(err);
    });*/

}

exports.getEditProduct = (req, res, next) => {
    //add-product here is associated with add-product.ejs
    //passing query param like www.admin.edit-product/12345?edit=true// where edit = true is query // if not found its undefined which is false
    const editMode = req.query.edit;
    //add-product here is associated with add-product.ejs
    //http://localhost:3000/admin/edit-product/123245?edit=true
    if (!editMode) {
        res.redirect('/');
        return;
    }
    const prodId = req.params.productId;

    // to find the product for the currently logged in user
    // we get products array
    Product.findById(prodId).then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    }).catch(err => console.log(err));

    // Product.findByPk(prodId).then(product => {
    //     if (!product) {
    //         return res.redirect('/');
    //     }
    //     res.render('admin/edit-product', { pageTitle: 'Edit Product', path: '/admin/edit-product', editing: editMode, product: product });
    // }).catch(err => console.log(err));
}


exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const product = new Product(updatedTitle, updatedPrice,updatedDesc,updatedImageUrl ,prodId)
    product.save().then( result => {
            // async operation get registered and allows the next step of program to be executed
            // if we put res.redirect at the last it will run res.redirect 
            // before getting the result
            // so we will not see the updated result at first but it gets updated
            console.log('Updated Product!');
            res.redirect('/admin/products');
    }).catch(err => console.log(err));;
    // Product.findByPk(prodId).then(product => {
    //     product.title = updatedTitle;
    //     product.price = updatedPrice;
    //     product.description = updatedDesc;
    //     product.imageUrl = updatedImageUrl;
    //     //this will update on the local app
    //     // to change in the database we have to call product.save90 sequelize fnction
    //     //another method provided by sequelize
    //     // this takes the product as we edited
    //     // and saves it back to the database
    //     // if product does not exist it will create a new one
    //     // in this case it will override
    //     // here again we can chain then and catch block
    //     // but not to start nesting our promises
    //     // that will create the same ugly picture as in call back
    //     // we can return the promise by save
    //     // when we return we can add then block before catch
    //     // and the catch block will display the error for both 
    //     // then block
    //     product.save();
    // }).then( result => {
    //     // async operation get registered and allows the next step of program to be executed
    //     // if we put res.redirect at the last it will run res.redirect 
    //     // before getting the result
    //     // so we will not see the updated result at first but it gets updated
    //     console.log('Updated Product!');
    //     res.redirect('/admin/products');
    // }).catch(err => console.log(err));
   
}

exports.getProducts = (req, res, next) => {

    Product.fetch().then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    });
   /* Product.findAll().then(products => {
        res.render('admin/products', { prods: products, docTitle: 'Admin Products', path: '/admin/products' });
    }).catch(err => {
        console.log(err);
    }); */
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId).then(() => {
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    }).catch(err => console.log(err));
}