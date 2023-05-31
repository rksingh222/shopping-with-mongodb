//npm install --save mongodb

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) =>{
    //mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/?retryWrites=true&w=majority
    //add before question mark database name which is shop
    //mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/shop?retryWrites=true&w=majority
    //if the database doesn't exist it will be created and if its there it won't have any problems
    MongoClient.connect('mongodb+srv://rahul:Rahulsingh1985@cluster0.wuseu24.mongodb.net/shop?retryWrites=true&w=majority').then(client =>{
        console.log('Connected');
        _db = client.db();
        callback();
        }).catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () =>{
    if(_db){
        return _db;
    }
    throw 'No database found!';
}

//module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;