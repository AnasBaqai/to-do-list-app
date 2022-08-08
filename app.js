const express = require("express");
const bodyParser = require("body-parser");
const Quote = require("inspirational-quotes");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const randomQuote = require("random-quote");
const app = express();
const _ = require("lodash")
//  const Items = [];
// const workItems = [];
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//aquiring database
mongoose.connect("mongodb+srv://anasbaqai:An12as34@cluster0.uuocn2n.mongodb.net/listDB");

//creating schema for list
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "No task have been entered"],
    }
})

//creatng model || collection
const Item = mongoose.model("Item", itemsSchema)

// creating items
const item1 = new Item({
    name: "welcome to you new list",
})

const item2 = new Item({
    name: "to add,use the add button",
})

const item3 = new Item({
    name: "to delete,check it",
})

// inserting item in database

// Item.insertMany([item1,item2,item3],function(err){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("added Successfully");
//     }
// })



function getQ(){
    let q=Quote.getRandomQuote();
    return q;
}
const day = date.getDate();
//function for rendering page
app.get("/", function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            if (foundItems.length === 0) {
                Item.insertMany([item1, item2, item3], function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added Successfully");
                    }
                })
                res.redirect("/")
            }
            
            // need to render item with date because of error that item does not exist 
            // on first time when it got render
            
            res.render("list", { listTitle: day, tasks: foundItems, motivation:getQ()}); 
          
        }
        
    })





})

const listsSchema = mongoose.Schema({
    name: String,
    item: [itemsSchema],
})

const List = mongoose.model("List", listsSchema);

app.get("/:listName", function (req, res) {
    const listName=_.capitalize(req.params.listName);
    List.findOne({ name: listName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: listName,
                    item: [item1, item2, item3],
                })
                list.save();
                res.redirect("/" + listName)
            } else {
                res.render("list", { listTitle: foundList.name, tasks: foundList.item, motivation: getQ() })
            }

        }
    })


})


app.post("/", function (req, res) {
    const listName = req.body.list;
    console.log(listName)
    const item = new Item({
        name: req.body.task,
    })

    if (listName === date.getDay() + ",") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.item.push(item);
            foundList.save();
            res.redirect("/" + listName);
        })
    }



    // if (req.body.list === "Work") {
    //     let task1 = req.body.task;
    //     if (task1 !== "")
    //         workItems.push(task1)
    //     res.redirect("/work");
    // } else {
    //     let task1 = req.body.task;
    //     if (task1 !== "")
    //         // Items.push(task1);
    //     // we cant use res.render(item:task) here because itwill give error on first one
    //     // that item not found

    //     res.redirect("/");
    // }


})

app.post("/delete", function (req, res) {
    const deletedItemId = req.body.deletedItem;
    const listName = req.body.listName;
    if (listName === day) {
        Item.deleteOne({ _id: deletedItemId }, function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("successfully deleted");

            }
        });
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listName},{$pull: {item:{_id:deletedItemId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        })
    }

})

app.get("/about", function (req, res) {
    res.render("about");
})



app.listen(process.env.PORT ||3000, function () {
    console.log("server is running at port 3000.")
})
