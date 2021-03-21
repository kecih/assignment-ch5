const express = require('express')
const expressLayout = require("express-ejs-layouts")
const fs = require('fs')
const app = express()

app.set("views", "./views")
app.set('view engine', 'ejs')
app.set('layout', './layouts/master')

let data = require("./data.json")

app.use(expressLayout);
app.use(express.json())
const fileJSON = fs.readFileSync('./data.json')
const dataJSON= JSON.parse(fileJSON)

// console.log(dataJSON)
//save function
const save = () => {
    fs.writeFile(
        "./data.json",
        JSON.stringify(data, null, 2),
        (error) => {
            if (error) {
                throw error;
            }
        }
    );
};

//Read(R) in CRUD
app.get("/data", (req, res) => {
    res.render('index', {hasil : data})
});
app.get("/data/:name", (req, res) => {
    const findId = data.find((data) => data.id === req.params.name);
    res.json(findId);
});

//Create(C) in CRUD
app.post("/data", express.json(), (req, res) => {
    data.push(req.body);
    save();
    res.json({
        status: "create success",
        stateInfo: req.body,
    });
});

//Update(U) in CRUD
app.put("/data/:name", express.json(), (req, res) => {
    data = data.map((data) => {
        if (data.id === req.params.name) {
            return req.body;
        } else {
            return data;
        }
    });
    save();
    res.json({
        status: "update success",
        stateInfo: req.body,
    });
});

//Delete(D) in CRUD
app.delete("/data/:name", (req, res) => {
    data = data.filter((data) => data.id !== req.params.name);
    save();
    res.json({
        status: "delete success",
        removed: req.params.name,
        newLength: data.length,
    });
});

app.listen(3001, () => {
    console.log(`Listening at http://localhost:3001`);
});