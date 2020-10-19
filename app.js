const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const session = require("express-session");
const { render } = require("ejs");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"));

const connection =  mysql.createConnection({
    multipleStatements: true,
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "pastebin"
});

app.use(bodyParser.urlencoded({
    extended: true
}))


//P.S. You may use and edit these functions. They are here for a reason :)
function generateUUID(){
    let generate = "";
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    for ( var i = 0; i < length; i++ ) {
        generate += char.charAt(Math.floor(Math.random() * char.length));
    }
    checkExists(generate);
    return generate;
}

function checkExists(code){
    connection.query("SELECT * FROM accounts WHERE uuid = '"+code+"'", (err, response) => {
        if (err) throw err;
        if (length(response) > 0){
            return code;
        }else{
            generateUUID();
        }
    })
}

app.use(session({
    secret: "Ch43y0Vn6Num84W4N",
    saveUninitialized: true,
    resave: true
}));
//write you code here
//Good luck!

app.get("/", (req, res)=>{
    if(req.session.current_user){
        res.redirect('/notes');
    }else{
        res.redirect('/')
    }
})

app.post('/login', (req, res)=>{
    console.log(req.body);
    connection.query(`SELECT * FROM accounts WHERE username = '`+req.body.username+`'`, (err, result)=>{

        if (err) throw err

        if (result.length > 0){

            if(result[0].password == req.body.password){
                req.session.current_user = result[0]
            }else{
                res.session.error = "Account Not Found";
            }
            res.redirect('/')

        }else{
            res.redirect('/')
        }
    })
})

app.get("/notes", (req, res)=>{
    if(req.session.current_user){
        res.render('notes');
    }else{
        res.session.error = "No Account Logged In"
        res.redirect('/')
    }
})

app.get("/create", (req, res)=>{
    if(requestAnimationFrame.session.current_user){
        res.render('editnotes');
    }else{
        res.session.error = "No Account Logged In"
        res.redirect('/')
    }
}) 

app.listen(3000);


