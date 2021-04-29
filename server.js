const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var db;
var s;


MongoClient.connect(url,{useUnifiedTopology: true},(err,database)=>{
    if(err)
    {
        console.log(err);
    }
    db=database.db('Books_inventor');
    app.listen(3000,()=>{
        console.log('Listening at port number 3000...');
    });
});

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get('/',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err)
        {
           return console.log(err);
        }
        res.render('home.ejs',{data:result});
    });
});

app.get('/create',(req,res)=>{
    res.render('add_book.ejs')
})

app.get('/update',(req,res)=>{
    res.render('update_book.ejs')
})

app.get('/delete',(req,res)=>{
    res.render('delete_book.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('Books').save(req.body,(err,result)=>{
        if(err)
        {
            return console.log(err);
        }
        res.redirect('/');
    })
})

app.post('/delete',(req,res)=>{
    db.collection('Books').findOneAndDelete({bookID:req.body.bookID},(err,result)=>{
        if(err)
        {
            return console.log(err);
        }
        res.redirect('/');
    })
})

app.post('/update',(req,res)=>{
    db.collection('Books').find().toArray((err,result)=>{
        if(err){
            return (console.log(err));
        }
        for(var i=0;i < result.length ; i++){
            if(result[i].bookID==req.body.bookID){
                s=result[i].Quantity;
                break;
            }

        }
        db.collection("Books").findOneAndUpdate({bookID:req.body.bookID},{
            $set:{Quantity:parseInt(s)+parseInt(req.body.Quantity)}
        },{sort:{_id:-1}},(err,result)=>{
            if(err){
                return res.send(err);
            }
            console.log(req.body.bookID+'Quantity Updated');
            res.redirect('/');
        })

    })

})

app.get('/delete/:_id',(req,res)=>{
    
    var _id = req.params._id;
    const query = {"_id":ObjectId(_id)};

    db.collection("Books").deleteOne(query,(err,result)=>{
        if(err)
        {
            console.log(err);
        }
        console.log("Successfully deleted item from the database with _id: ",_id);
        res.redirect('/');
        
    })


})

app.get('/update/:putvalue',(req,res)=>{
    var putvalue = req.params.putvalue;
    res.render('test.ejs',{putvalue:putvalue});
})