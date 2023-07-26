const { application } = require('express');
let express=require('express');
let app=express();
let {dbConnect,getData,postData,deleteOrder} = require('./controller/dbcontroller');
let Mongo = require('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())

app.get('/category',async(req,res) => {
        let query = {};
        let collection = "category";
        let output = await getData(collection,query)
        res.send(output)
    })


app.get('/sub_category',async (req ,res)=>{
    let query = {};
    if(req.query.category_id){
        query={category_id: Number(req.query.category_id)}
    }
    else{
        query={};
    }
    let collection = "sub_category";
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/products' , async (req,res)=>{
    let query = {};
    let collection = "products";
    if(req.query.sub_category_id){
        query={sub_category_id: Number(req.query.sub_category_id)}
    }else
    {
        query={};
    }
    let output = await getData(collection,query);
    res.send(output)
})

app.get('/filter/:sub_category_id', async(req,res) =>{
    let query = {};
    let collection = "products";
    let sub_category_id = Number(req.params.sub_category_id);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);

    if(lcost && hcost){
        query={
            sub_category_id:sub_category_id,
            $and:[{price:{$gt:lcost,$lt:hcost}}]

        }
    }else{
        query = {}
    }
    let output = await getData (collection, query);
    res.send(output);
})


//details

app.get('/details/pid', async(req,res)=>{
    let id = new Mongo.ObjectId(req.params.pid)
    let query = {pid:id}
    let collection = "products";
    let output = await getData(collection,query);
    res.send(output)

})

 //orders

    app.get('/orders',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})

//Cart products

app.get('/cart',async(req,res) => {
    let query = {};
    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }
   
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})


//Place order

app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})

//add product to cart

app.post('/addtocart',async(req,res) => {
    let data = req.body;
    let collection = "cart";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})


//delete Cart

app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})

app.delete('/deleteCart-product',async(req,res) => {
    let collection = 'cart';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})




app.listen(2022,(err)=>{
    dbConnect();
    if(err) throw err;
    console.log('server is runnig on port 2022')
})