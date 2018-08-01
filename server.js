const express           = require('express');
const app               = express();
const session           = require('express-session');
const sessionStore      = new session.MemoryStore();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const mongo             = require('mongodb').MongoClient;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, (err, client) => {
  if(err) console.log('Database error: ' + err);
  
  let db = client.db('freecodecamp2018');
  
  app.get('/', (req, res) => {
    
    db.collection('stockcharts').findOne( {}, (err, doc) => {
      if (err) { console.log(err); }
      else {
        res.render(process.cwd() + '/views/pug/index', { symbolsArr: doc.symbolsArr });
      }
    });

  });
  
  http.listen(process.env.PORT || 3000);


  //start socket.io code  
  io.on('connection', (socket) => {
    
    socket.on('add symbol', (symbol) => {
            
      db.collection('stockcharts').update( {}, { $addToSet: { symbolsArr: symbol } }, (err, doc) => {
        if (err) { console.log(err); }
        else {
          return;
        }
      });

      io.emit('add symbol', { symbol });
    });
    
    socket.on('delete symbol', (symbol) => {
      
      db.collection('stockcharts').findOneAndUpdate( { }, { $pull: { symbolsArr: symbol } }, (err, doc) => {
        if (err) { console.log(err); }
        else {
          return;
        }
      });

      io.emit('delete symbol', { symbol });
    });
    
  });
  //end socket.io code

});
