const express = require('express');
const bodyParser = require('body-parser');			//Json으로 데이터 통신 Module

const RoomRouter = require('./routes/room/roomRouter'),
TeamRouter = require('./routes/team/teamRouter'),
FcmRouter = require('./routes/fcm/fcmRouter'),
ChatLogRouter = require('./routes/chatLog/chatLogRouter'),
NotificationRouter = require('./routes/notification/notificationRouter'),
CommunityPostRouter = require('./routes/communitypost/communityPostRouter'),
communityFuncRouter = require('./routes/communitypost/communityPostFuncRouter'),
SearchRouter = require('./routes/search/searchRouter'),
BadgeRouter = require('./routes/badge/badgeRouter'),
bannerRouter = require('./routes/banner/banner'),
matchingRouter = require('./routes/matching/matchingRouter');
fcmFuncRouter = require('./routes/fcm/fcmFuncRouter');

const moment = require('moment');
const globalRouter = require('./routes/global');
const fs_extra = require('fs-extra');
const fs = require('fs');
const { Op } = require('sequelize');

const routerindex = require('./routes/index');
const models = require("./models/index.js");

const app = express();
const LIKES_LIMIT = 100;
    
const client = globalRouter.client;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

app.use('/Profile', routerindex);
app.use('/Team', TeamRouter);
app.use('/Notification', NotificationRouter);
app.use('/CommunityPost', CommunityPostRouter);
app.use('/Room', RoomRouter);
app.use('/Search', SearchRouter);
app.use('/Matching', matchingRouter);
app.use('/ChatLog', ChatLogRouter);
app.use('/Badge', BadgeRouter);
app.use('/Fcm', FcmRouter);
app.use('/Banner', bannerRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

app.use(express.static('views'));

// configuration =========================
app.set('port', process.argv[2] || process.env.PORT || 50004);

var route, routes = [];

const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
	
    app._router.stack.forEach(print.bind(null, []))
    //console.dir(routes, {'maxArrayLength': null});
});

app.get('/main', function(req, res) {
  res.render('main.ejs');
});

app.get('/main/survey', function(req, res) {
  res.render('survey.ejs');
});

app.post('/InsertTest', async(req, res) => {
  console.log(req.body);
  res.status(200).send(true);
});

app.get('/imgs', function(req, res) {
  fs.readFile('01.jpg', function(err, data) {
    res.writeHead(200, { 'Content-Type' : 'text/html'});
    res.end(data);
  });
});

function print (path, layer) {
    if (layer.route) {
      layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
      layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
      var obj = new Object();
      //console.log('%s /%s',layer.method.toUpperCase(),path.concat(split(layer.regexp)).filter(Boolean).join('/'))
      obj.rest = layer.method.toUpperCase();
      obj.url = path.concat(split(layer.regexp)).filter(Boolean).join('/')
      //console.log(obj);
      routes.push(obj);
    }
  }
  
  function split (thing) {
    if (typeof thing === 'string') {
      return thing.split('/')
    } else if (thing.fast_slash) {
      return ''
    } else {
      var match = thing.toString()
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '$')
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
      return match
        ? match[1].replace(/\\(.)/g, '$1').split('/')
        : '<complex:' + thing.toString() + '>'
    }
  }
  
  app.get('/Url/Show', function(req, res) {
    res.render('home.ejs', {
      urls : routes,
      myFunc : moveDetailPage,
    })
  })

  var moveDetailPage = function(object) {
    res.render('detailurl.ejs', {
      obj : object
    })
  }

  app.post('/DetailUrl', function(req, res){
    console.log(req.body);
  })
