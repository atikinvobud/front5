const express =require("express");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs =require("fs");

const app = express();
const port = 8000;
app.use(bodyparser.json());
const SECRET_KEY ="my_super_secret_key_which_is_long_enough";

app.use(express.static(path.join(__dirname, "public")));
let users =[];

const authenticate = (req,res,next) =>{
    const token = req.headers["Authorization"];
    if(!token) return res.status(401).json({message: "Токен не найден"});
    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user)=>{
        if(err) return res.status(403).json({message: "Доступ запрещен"});
        req.user =user;
        next();
    });
};

app.get("/", (req,res) =>{
    fs.readFile(path.join(__dirname, "public", "index.html"), "utf8", (err, data) => {
        if (err) res.status(404).send("Ошибка: файл index.html не найден");
        else res.send(data);
    });
});

app.post("/registr", (req,res)=>{
    const {username, password} =req.body;
    if (users.find(u => u.username === username)) return res.status(400).json({message: "User exist"});
    users.push({Id: users.length+1, username, password});
    return res.status(201).json({message: "Пользователь создан"});
});

app.post("/login", (req,res) =>{
    const {username, password} = req.body;
    let user = users.find(u => u.username === username && u.password ===password);
    if(!user) res.status(404).json({messgae: "Пользователь не найден"});
    const token = jwt.sign({userId: user.Id}, SECRET_KEY, {expiresIn: "1h"});
    res.status(200).json({token}); 
});

app.get("/profile", authenticate, (req, res) =>{
    res.json({user: req.user});
} );

app.listen(port, ()=>{
    console.log("сервер запущен");
});