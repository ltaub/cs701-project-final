var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var express = require('express');
var swig = require('swig');
var app = express();
var file = "schedule.db";
var exists = fs.existsSync(file);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

console.log(exists);


app.get(/submitted/, function(req, res){
  var data = [];
  var user = req.path.split('/')[2];
  /*QUERIES THE DATABASE*/
  db.serialize(function(){
    db.each('SELECT * FROM users WHERE userID = "'+user+'"', function(err,row){
      data.push(row);
    })
    db.each('SELECT * FROM classes WHERE userID = "'+user+'"', function(err, row){
      data.push(row);
    });
    db.each('SELECT * FROM assignments WHERE userID = "'+user+'"', function(err,row){
      data.push(row);
    });
    db.each('SELECT * FROM practices WHERE userID = "'+user+'"', function(err, row){
      data.push(row);
    }, function(err, num_rows){
      res.render('view.html', {
        data: JSON.stringify(data)
      });
    });
  });

  // db.each("SELECT * FROM users", function(err,row){
  //   data.push(row);
  // }, function(err, num_rows){
  //   //res.json(data);
  //   res.render('view.html', {
  //     data: JSON.stringify(data)
  //   });
  // });

});


app.get('/', function(req, res){
  displayForm(res);
});
app.post('/', function(req, res){
  processFormFieldsIndividual(req,res);
});
app.listen(process.argv[2]|| 8888);




// var server = http.createServer(function(req,res){
//   if(req.method.toLowerCase() == 'get'){
//     displayForm(res);
//   }else if (req.method.toLowerCase() == 'post'){
//     processFormFieldsIndividual(req,res);
//   }
//
// });
function displayForm(res) {
    fs.readFile('test.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}


function processFormFieldsIndividual(req, res, fields) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var field_names = [];
    var num = 0;
    var form = new formidable.IncomingForm();
    var userID = "";
    form.on('field', function (field, value) {
      console.log('FIELD: '+ field + '   VALUE: '+value);
      db.serialize(function(){
        if(field == 'user_name'){
          userID = value;
          db.run("INSERT INTO users (userID) VALUES ('"+value+"')");
          db.run("INSERT INTO classes (userID) VALUES ('"+value+"')");
          db.run("INSERT INTO practices (userID) VALUES ('"+value+"')");
          db.run("INSERT INTO assignments (userID) VALUES ('"+value+"')");
        }
        else if (field == 'email'){
          db.run("UPDATE users SET email = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'id'){
          db.run("UPDATE users SET name = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_name'){
           db.run("UPDATE classes SET class = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_type'){
          db.run("UPDATE classes SET type ='"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_day1'){
          db.run("UPDATE classes SET days1 = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_day2'){
          db.run("UPDATE classes SET days2 = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_day3'){
          db.run("UPDATE classes SET days3 = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_day4'){
          db.run("UPDATE classes SET days4 = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_start'){
          db.run("UPDATE classes SET time_start = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if (field == 'class_end'){
          db.run("UPDATE classes SET time_end = '"+value+"' WHERE userID = '"+userID+"'");
        }
        else if(field == 'practice'){
          db.run("UPDATE practices SET practice = '"+value+"' WHERE userID ='"+userID+"'");
        }
        else if (field == 'prac_day1'){
          db.run("UPDATE practices SET days1 = '"+value+"' WHERE userID ='"+userID+"'");
        }
        else if (field == 'prac_day2'){
          db.run("UPDATE practices SET days2 = '"+value+"' WHERE userID ='"+userID+"'");
        }

        else if(field == 'prac_start'){
          db.run("UPDATE practices SET time_start = '"+value+"' WHERE userID ='"+userID+"'");
        }
        else if(field == 'prac_end'){
          db.run("UPDATE practices SET time_end = '"+value+"' WHERE userID ='"+userID+"'");
        }
        else if(field == 'assignment'){
          db.run("UPDATE assignments SET assignment = '"+value+"' WHERE userID ='"+userID+"'");
        }
        else if(field == 'due_date'){
          db.run("UPDATE assignments SET due_date = '"+value+"' WHERE userID ='"+userID+"'");

        }

      });
        fields[field] = value;
        field_names[num] = field;

    });

    form.on('end', function () {
      console.log('form submitted');
      fs.readFile('submitted.html', function(err,data){
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        res.write(data);
        res.end();
      });
    });
    form.parse(req);
}

//server.listen(8888);
console.log("server listening on 8888");
