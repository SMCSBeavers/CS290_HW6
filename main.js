var express = require('express');
var mysql = require('./dbcon.js')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var request = require('request');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 35001);
app.use(express.static('public'));


app.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        context.results = rows;
        res.render('home', context);
    });
});

app.post('/added',function(req,res){
    var payload= [[req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.lbs]]
    console.log(payload)
    mysql.pool.query('INSERT INTO workouts (name,reps,weight,date,lbs) VALUES (?)',payload,function(err,res){
        if(err){
            throw err;
        }
        else{
            console.log(res);
        }
    })
        res.render('added');
});


app.get('/edit',function(req,res,next){
    var id_num = {id:req.query.id}
    mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.render('edit',id_num)
    });
});

app.post('/editSuccessful', function (req,res,next){
    var data = [req.body.name,req.body.reps,req.body.weight,req.body.date,req.body.lbs, req.query.id]
    console.log(data)
    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ", data,
        function (err,result){
        if(err){
            next(err);
            return;
        }
        res.render('editSuccessful');
        });
});

app.get('/delete',function (req,res,next){
    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.query.id] ,
        function (err,result){
        if(err){
            next(err);
            return;
        }
        res.render('deleted')
    });
});

/* ----------------------------- RESET TABLE --------------------------------------------- */

app.get('/reset-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

/* ----------------------------- ERROR HANDLING ------------------------------------------ */

app.use(function(req,res){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});