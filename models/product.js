//to refer to documentation
//https://www.mongodb.com --- not logged in
// click on resources in navigation /server
// select MongoDb Crud operation
// in mongodb 
const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl,id,userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        //because mongodb.ObjectId will create the id although if its null thats why this check
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        //you can call collection with which collection you want to insert something
        //just like database
        //first level is database and the second level is collection
        //just as a database which when not created first time will be created 
        //in this collection we can execute couple of mongo db commands
        //full list can be found in mongo db doc
        // to insert one it will insert
        // to insert many it will insert many takes []
        let dbOp;
        if(this._id){
            //update the product
            //if we dont want to update all the values you can use
            //{$set: {title: this.title,}}
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set : this});
        }else{
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp.then((result) => {
            console.log(result);
        }).catch(err => console.log(err));
    }

    static fetch() {
        const db = getDb();
        //find could be configured to 
        //find({title: 'A book'});
        // to find all products
        //find does not immediately returns a promise
        //it returns a cursor
        //it allows move on the documents
        //toArray is used to get all documents
        //if it is 100 documents
        ///otherwise its better use pagination
        // return Promise.resolve('check');
        return db.collection('products').find().toArray().then(products => {
            console.log(products);
            return products;
        }).catch(err => {
            console.log(err);
        });
    }

    static fetchAll() {
        //const db = getDb();
        //find could be configured to 
        //find({title: 'A book'});
        // to find all products
        //find does not immediately returns a promise
        //it returns a cursor
        //it allows move on the documents
        //toArray is used to get all documents
        //if it is 100 documents
        ///otherwise its better use pagination

        //return Promise.resolve('rahul');
        /*return db.collection('products').find().toArray().then(products =>{
            console.log(products);
            return products;
        }).catch(err =>{ 
            console.log(err);
        });*/
    }

    static findById(prodId){
        const db = getDb();
        //find will give me cursor
        //next can be used to get next or last document that was returned by find
        return db.collection('products').find({ _id: new mongodb.ObjectId(prodId)}).next().then(product=>{
            console.log(product);
            return product;
        }).catch();
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)}).then(result =>{
            console.log('deleted');
        }).catch(err => {
            console.log(err);
        });
    }
}


module.exports = Product;