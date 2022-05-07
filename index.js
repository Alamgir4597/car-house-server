const express = require('express');
const cors = require('cors');
const app =express();
const port=process.env.PORT || 5000;
const mongo = require('mongodb');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sq3pw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//     const productCollection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

async function run(){
    try{
        await client.connect();
        console.log(' db connected');
        const productCollection=client.db('assignment-eleven-db').collection('products');
        app.post('/products', async(req,res)=>{
            const newProduct=req.body;
            console.log('add new product', newProduct);
            const result= await productCollection.insertOne(newProduct);
            res.send(result);
        })
        app.get('/products', async(req,res)=>{
            const query={};
            const cusor = productCollection.find(query);
            const products=await cusor.toArray();
            res.send(products);
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
           
            const query = {_id: ObjectId(id)};
            
             const product = await productCollection.findOne(query);
             console.log(product)
            res.send(product);
        })
        app.put('/product/:id', async(req,res)=>{
            const id=req.params.id;
            const  updateProdct=req.body;
            const filter={_id:ObjectId(id)};
            console.log(filter)
            const option={ upsert: true};
            console.log(updateProdct.productQty);
            const updateDoc={
                $set:{
                    quantity: parseInt(updateProdct.productQty),           
                     
                },
            };
            console.log(updateDoc);
            const result= await productCollection.updateOne(filter,updateDoc,option)
            console.log(result)
            res.send(result);

        });
        app.delete('/product/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result= await productCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Home')
})

app.listen(port,()=>{
    console.log("Server is Running" , port)
})