const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save(){
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {

        //user.cart contains the database methods because it was retrieved from findById
        //so i was confused how this.cart.items because this cart is accessing database
        //because in User.findbyid it gets user which is a database variable
       
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1});
        }

        const updatedCart = {
            items: updatedCartItems
        };
        


        //don't want to store all the product data but only the product id because it can update the
        //value in product table then it will be a problem
        //items:[{...product, quantity: 1}]
        //so i removed the upper part and added this
        //const updatedCart = { items: [{productId: new ObjectId(product._id), quantity: 1}]};
        const db = getDb();
       
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: updatedCart}});
    }

    getCart(){
        const db = getDb();
        //what we are doing here is getting all the productIds 
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        //$in takes an array of productids
        return db.collection('products').find({_id: {$in:productIds}}).toArray().then(products =>{
            return products.map(p => {
                return {...p, quantity: this.cart.items.find(i => {
                    //here i am checking if the cart contains this product id
                    //if it does then give the quantity also and add in the object list
                    return i.productId.toString() === p._id.toString();
                    //why here quantity because we just found the items product id
                    //so we have to get the quantity
                }).quantity};
            });
        });
    }

    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(item =>{
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {$set: {cart: {items: updatedCartItems}}});
    }

    addOrder(){
        //since we also need the information about the user and products
        const db = getDb();
        //because i just not want to fetch cart id but also product information
        return this.getCart().then(products => {
            const order = {
                items: products,
                user: {
                    _id: new ObjectId(this._id),
                    name: this.name,
                }
            };
            return db.collection('orders').insertOne(order);
        }).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
        });
        const order = {
            items: this.cart.items,
            user: {
                _id: new ObjectId(this._id),
                name: this.name,
            }
        };
        return db.collection('orders').insertOne(this.cart).then(result => {
            this.cart = {items: []};
            return db.collection('users').updateOne({_id: new ObjectId(this._id)},{$set: {cart: {items: []}}});
        });
    }

    getOrders() {
        const db = getDb();
        //you can also check nested properties
        //we have to find the user id inside order
        // to do that we can also check nested properties
        //you have to use quotation for multiple ids
        return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
    }

    static findById(userId){
        const db = getDb();
        //next will return the next or last or first document
        //return db.collection('users').find({_id: new ObjectId(userId)}).next();
        //there is another way which is findOne
        return db.collection('users').findOne({_id: new ObjectId(userId)});
    }
}

module.exports = User;