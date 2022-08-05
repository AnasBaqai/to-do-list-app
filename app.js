const express = require("express");
const bodyParser = require("body-parser");
const Quote = require("inspirational-quotes");
const date =require(__dirname+"/date.js");

const app = express();
const items = ["Cook food", "Eat Food"];
const workItems = [];
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    const day=date.getDate();

    // need to render item with date because of error that item does not exist 
    // on first time when it got render  
    res.render("list", { listTitle: day, tasks: items, motivation: Quote.getRandomQuote() });


})
app.get("/work", function (req, res) {
    res.render("list", { listTitle: "Work List", tasks: workItems, motivation: Quote.getRandomQuote() });
})


app.post("/", function (req, res) {
    console.log(req.body);
    if (req.body.list === "Work") {
        let task1 = req.body.task;
        if (task1 !== "")
            workItems.push(task1)
        res.redirect("/work");
    } else {
        let task1 = req.body.task;
        if (task1 !== "")
            items.push(task1);
        // we cant use res.render(item:task) here because itwill give error on first one
        // that item not found

        res.redirect("/");
    }


})

app.get("/about",function(req,res){
    res.render("about");
})



app.listen(3000, function () {
    console.log("server is running at port 3000.")
})
