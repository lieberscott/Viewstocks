const express           = require('express');
const app               = express();
const session           = require('express-session');
const sessionStore      = new session.MemoryStore();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const mongo             = require('mongodb').MongoClient;
const helmet            = require('helmet');

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(helmet());
app.use(helmet.noCache());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    connectSrc: ["api.iextrading.com", "'self'", "wss://viewstocks.glitch.me"],
    fontSrc: ["fonts.gstatic.com"],
    imgSrc: ["https://glitch.com"],
    scriptSrc: ["'self'", "cdnjs.cloudflare.com", "code.jquery.com", "'unsafe-inline'"],
    styleSrc: ["cdnjs.cloudflare.com/", "stackpath.bootstrapcdn.com", "'self'", "fonts.googleapis.com", "'unsafe-inline'"]
  }
}));

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
