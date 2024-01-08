const express = require('express');
const methodOverride = require('method-override');		//Post,Delete,Update 관련 Module
const bodyParser = require('body-parser');			//Json으로 데이터 통신 Module
const helmet = require('helmet');				//http 보안관련 Module

const rateCheck = require('./libs/RateLimiter');		//Rate Limiter Module
const logger = require('./libs/myWinston');			//Log Module

const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());


const   models = require('./models'),
        RoomFuncRouter = require('./routes/room/roomFuncRouter'),
		ChatLogFuncRouter = require('./routes/chatLog/chatLogFuncRouter'),
        fcmFuncRouter = require('./routes/fcm/fcmFuncRouter'),
        globalRouter = require('./routes/global');

const fcmRouter = require('./routes/fcm/fcmRouter');
const verify = require('./controllers/parameterToken');

let isDisableKeepAlive = false;
// configuration =========================
app.set('port', process.argv[2] || process.env.PORT || 50002);
const server = app.listen(app.get('port'), () => {
	logger.info('Express chat server listening on port ' + app.get('port'));
});

app.use('/Personal/Logout', async function (req, res) {
    // globalRouter.client.hgetall(String(req.body.userID), function(err, obj) {
    //     if(err) throw err;
    //     if(obj == null) return;
    //     globalRouter.client.hmset(String(req.body.userID), {
    //         "isOnline" : 0,
    //     });
    // });

    // globalRouter.forceDisconnectFunc(req.body.userID);

    // if(req.body.isSelf == 0){
    //  var data = JSON.stringify({
    //    userID: req.body.userID,
    //    inviteID: req.body.userID,
    //    title: "로그아웃",
    //    type: "LOGOUT",
    //    tableIndex: req.body.userID,
    //    body: 'logout',
    //    isSend : 1
    //  })
   
    //  fcmFuncRouter.SendFcmEvent(data);
    // }else{
    //  res.json(true); 
    // }
});

app.use(function(req,res,next){
	if(isDisableKeepAlive){
		res.set('Connection', 'close');
	}
	next();
});

process.on('SIGTERM', shutDown); //정상종료 
process.on('SIGINT', shutDown); //비정상종료

function shutDown() {
    logger.info('Received kill signal, shutting down gracefully');
    
    //sendForceOutEventToLoginUser();

    sub.quit();

	server.close(() => {
		logger.info('Closed out rmaining connections');
        process.exit(0);
	});

	setTimeout(() => {
		logger.error('Could not close connections in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
}

// sequelize 연동
models.sequelize.sync().then( () => {
    console.log("DB Connect Success");
    var key = "user:" + 7777 + ":check";
    client.del(key);

    models.user.findAll({}).then(result => {
        for(let i = 0 ; i < result.length; ++i){
            client.hmset(String(result[i].UserID), {
                "socketID" : 0,
                "isOnline" : 0,
            });

        }
    });
}).catch( err => {
    console.log("DB Connect Faield");
    console.log(err);
})

const socketio = require('socket.io');
app.io = socketio(server);
const router = require('express').Router();

const redis = require('redis');
const redisStore = require('socket.io-redis');
const client = globalRouter.client; //redis.createClient(6379, "127.0.0.1");   //저장용

var _ = require('underscore');

const sub = redis.createClient();
const pub = redis.createClient();

var Redlock = require('redlock');
var redlock = new Redlock(
    // you should have one client for each independent redis node
    // or cluster
    [client],
    {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01, // multiplied by lock ttl to determine drift time
    
        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount:  -1,
    
        // the time in ms between attempts
        retryDelay:  200, // time in ms
    
        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter:  200 // time in ms
    }
);

redlock.on('clientError', function(err) {
    console.error('A redis error has occurred:', err);
});

app.io.adapter(redisStore({pubClient: pub, subClient: sub}));

pub.on('error', (err) => console.log(err));
sub.on('error', (err) => console.log(err));

//Reserved Events
let ON_CONNECTION = 'connection';
let ON_DISCONNECT = 'disconnect';
let ON_PAUSED = 'paused';
let ON_RESUMED = 'resumed';

//Main Event
let EVENT_IS_USER_ROOM_STATUS = 'room_status_online';

let EVENT_JOIN_ROOM = 'joinRoom';

let EVENT_ROOM_CHAT_MESSAGE = 'roomChatMessage';

//Sub Events
let SUB_EVENT_RECEIVE_MESSAGE = 'receive_message';
let SUB_EVENT_ROOM_LIST_RECEIVE_MESSAGE = 'room_list_receive_message';
let SUB_EVENT_ETC_RECEIVED_EVENT = 'etc_receive_message';
let SUB_EVENT_FORCE_LOGOUT_EVENT = 'force_logout';

//Status
let MAX_ROOM_USERS = 30;

let ROOM = 0;
let CHAT = 1;
let ETC = 2;

var roomMap = {};
let roomIdx = 1;
let chatIdx = 0;

function onlineUser(){
    var key = "user:" + 7777 + ":check";
    client.incr(key);
    showNowUser();
}

function offlineUser(){
    var key = "user:" + 7777 + ":check";
    client.decr(key);
    showNowUser();
}

function showNowUser(){
    var headlineKey = "user:" + 7777 + ":headline";
    var checkKey = "user:" + 7777 + ":check";

    client.mget([headlineKey,checkKey], function(err, values) {
        if(err) throw err;
        console.log("The User " + values[0] + "has " + values[1] + "check");
    });
}

var ttl = 2000;

const userMap = new Map();
const offlineUserList = [];

function sendForceOutEventToLoginUser(){
    var sendData = JSON.stringify({
        result : "disconnect"
    })

    for (let key of userMap) {
        let userMapVal = key[1];
        app.io.to(userMapVal.socket_id).emit(SUB_EVENT_FORCE_LOGOUT_EVENT,JSON.parse(sendData));
    }
}

function getSocketIDFromMapForThisUser(to_user_id) {
    let userMapVal = userMap.get(String(to_user_id));
    
    if (userMap.has(String(to_user_id))) {
        //print("userMapVal socket_id : " + userMapVal.socket_id);
    }

    if (undefined == userMapVal) {
        return undefined;
    }
    return userMapVal.socket_id;
}

function disconnectFunc(socket){
    console.log('Disconnected ' + socket.id);
    removeUserWithSocketIDFromMap(socket.id);
    socket.removeAllListeners(EVENT_JOIN_ROOM);
    socket.removeAllListeners(EVENT_IS_USER_ROOM_STATUS);
    socket.removeAllListeners(EVENT_ROOM_CHAT_MESSAGE);
    socket.removeAllListeners(ON_CONNECTION);
    socket.removeAllListeners(ON_DISCONNECT);
    socket.removeAllListeners(ON_PAUSED);
    socket.removeAllListeners(ON_RESUMED);
}

function removeUserWithSocketIDFromMap(id) {
    console.log("Logout / UserID: " + id);

    let toDeleteUser;
    for (let key of userMap) {
        let userMapVal = key[1];
        if (userMapVal.socket_id == id) {
            toDeleteUser = key[0];
        }
    }

    if (undefined != toDeleteUser) { 
        
        client.keys('*', function (err, keys) {
            
			for(var i = 0 ; i < keys.length; ++i){
                let key = keys[i];
                if(key == 'user:7777:check') continue;
				client.hget(key, "socketID", function(err, value) {
					if(err) throw err;
					if(id == value) {
						client.hmset( key, {
							"isOnline" : 0
                        });

						return;
					}
				});
			}
		});

        userMap.delete(toDeleteUser);
    }
    printOnlineUsers();
}

function addUserToMap(key_user_id, userMapVal) {
    userMap.set(key_user_id, userMapVal);
}    

function printOnlineUsers() {
    console.log('Online Users :' + userMap.size);
}

sub.subscribe('roomChat');

sub.on('message',async (channel, data) => {
    console.log('Message [' + data + '] on channel [' + channel + '] arrived!');

    if(channel == 'roomChat'){
        var msg = JSON.parse(data);

        // if(msg.port == app.get('port')) {
        //     console.log('same server');
        //     return;
        // }

        let to_user_socket_id = getSocketIDFromMapForThisUser(msg.to);

        if(to_user_socket_id != undefined){

            var data = JSON.stringify({
                roomName : msg.roomName,
                to : msg.to ,
                from : msg.from,
                message : msg.message,
                isImage : msg.isImage,
                date : msg.date,
                isSend : 1
            });

            var chatData = await ChatLogFuncRouter.InsertLog(data);

            var sendData = JSON.stringify({
                chat_id : chatData.id,
                roomName : msg.roomName,
                to : msg.to,
                from : msg.from,
                message : msg.message,
                isImage : msg.isImage,
                send_date : msg.date,
                createdAt : msg.createdAt,
                updatedAt : msg.updatedAt,
            })
            
            app.io.to(to_user_socket_id).emit(SUB_EVENT_RECEIVE_MESSAGE,JSON.parse(sendData));
        }else{
            //offline

            var data = JSON.stringify({
                roomName : msg.roomName,
                to : msg.to,
                from : msg.from,
                message : msg.message,
                isImage : msg.isImage,
                date : msg.date,
                isSend : 0
            })

            var lockResource = msg.roomName+msg.to+msg.from+msg.message+msg.date;

            redlock.lock(lockResource, ttl).then(async function(lock) {

                await globalRouter.sleep(1000)

                ChatLogFuncRouter.FindOrInsertLog(data).then(async function (result){
                    if(result == true){
                        var fcmData = JSON.stringify({
                            userID : msg.from,
                            inviteID : msg.to,
                            title : msg.fromName,
                            body : msg.message,
                            type : 'CHATTING',
                            isImage : msg.isImage,
                            isSend : 0,
                            roomName : msg.roomName,
                            topic : 'CHATTING'
                        })

                        await models.RoomUser.findOne({
                            where : {
                                UserID : msg.to,
                                RoomID : msg.roomId
                            }
                        }).then(roomUserResult => {
                            if(globalRouter.IsEmpty(roomUserResult)){
                                globalRouter.logger.error('roomUserResult is empty');
                                fcmFuncRouter.SendFcmEvent( fcmData );
                            }else{
                                //상대방 알람이 켜져있으면
                                if(roomUserResult.Alarm == 1){
                                    if(fcmFuncRouter.SendFcmEvent( fcmData )){
                                        console.log("chat fcm success");
                                    }
                                    else console.log("chat fcm faield");
                                }
                            }
                        }).catch(err => {
                            globalRouter.logger.error("roomUserResult faield " + err);
                        })
                    }
                });
             
                return lock.unlock().catch(function(err) {
                    console.error(err);
                });
            });
        }
    }
})

app.io.sockets.on(ON_CONNECTION, function (socket) {
    onEachUserConnection(socket);
});

function onEachUserConnection(socket){
    globalRouter.print('-----------------------------');
    globalRouter.print('Connected => Socket ID: '+ socket.id + ', User: '+ socket.handshake.headers.from);
    var from_user_id = socket.handshake.headers.from;
    let userMapVal = {socket_id : socket.id};
    globalRouter.print(userMapVal);

    var res = getSocketIDFromMapForThisUser(from_user_id);
    //연결중이면 기존 정보 삭제 및 소켓 연결 끊기
    if(undefined != res){
        console.log('already socket data discoonect');
        disconnectFunc(app.io.sockets.connected[res]);
    }

    addUserToMap(from_user_id, userMapVal);
    client.hgetall(from_user_id,  function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        deleteUserID(from_user_id * 1);
        client.hmset(from_user_id, {
            "socketID" : socket.id,
            "isOnline" : 1,
        });
    })

    onlineUser();

    console.log(userMap);
    printOnlineUsers();

    joinRoom(socket);
    roomChatMessage(socket);

    onDisconnect(socket);

    onPaused(socket);
    onResumed(socket);
}

function roomChatMessage(socket){
    socket.on(EVENT_ROOM_CHAT_MESSAGE,async function(msg){

        if(verify.verifyToken(msg.accessToken)){
            let toList = msg.to.split('|');

            var imageRes;
            if(msg.isImage != 0){
                imageRes = await models.ChatImageLog.create({
                    UserID : msg.from,
                    Data : msg.message
                });
            }

            for(var i = 0 ; i < toList.length; ++i){
                let to_user_id  = toList[i] * 1;
                msg.to = to_user_id;
                msg.port = app.get('port');
    
                let to_user_socket_id = getSocketIDFromMapForThisUser(msg.to);
                var parseMsg = globalRouter.stringifyToJson(msg);
    
                if( checkUserID(msg.to) == true || to_user_socket_id == undefined){
                    //릴리즈 서버 용
                    //pub.publish('roomChat', parseMsg);
                    var message = msg.message;
                    if(msg.isImage != 0) message = imageRes.id;

                    var data = JSON.stringify({
                        roomName : msg.roomName,
                        to : msg.to ,
                        from : msg.from,
                        message : message,
                        isImage : imageRes.id,
                        date : msg.date,
                        isSend : 0
                    })
    
                    var chatData = await ChatLogFuncRouter.InsertLog(data);

                    var fcmData = JSON.stringify({
                        userID : msg.from,
                        inviteID : msg.to,
                        title : msg.fromName,
                        body : msg.message,
                        type : 'CHATTING',
                        isImage : imageRes.id,
                        isSend : 0,
                        roomName : msg.roomName,
                        topic : 'CHATTING'
                    })

                    await models.RoomUser.findOne({
                        where : {
                            UserID : msg.to,
                            RoomID : msg.roomId
                        }
                    }).then(roomUserResult => {
                        if(globalRouter.IsEmpty(roomUserResult)){
                            globalRouter.logger.error('roomUserResult is empty');
                            fcmFuncRouter.SendFcmEvent( fcmData );
                        }else{
                            //상대방 알람이 켜져있으면
                            if(roomUserResult.Alarm == 1){
                                if(fcmFuncRouter.SendFcmEvent( fcmData )){
                                    console.log("chat fcm success");
                                }
                                else console.log("chat fcm faield");
                            }
                        }
                    }).catch(err => {
                        globalRouter.logger.error("roomUserResult faield " + err);
                    })
                }else{
                    var message = msg.message;
                    if(msg.isImage != 0) message = imageRes.id;

                    var data = JSON.stringify({
                        roomName : msg.roomName,
                        to : msg.to ,
                        from : msg.from,
                        message : message,
                        isImage : msg.isImage,
                        date : msg.date,
                        isSend : 1
                    })
    
                    var chatData = await ChatLogFuncRouter.InsertLog(data);
    
                    var sendData = JSON.stringify({
                        chat_id : chatData.id,
                        roomName : msg.roomName,
                        to : msg.to,
                        from : msg.from,
                        message : msg.message,
                        isImage : msg.isImage,
                        isDirect : true,
                        send_date : msg.date,
                        createdAt : msg.createdAt,
                        updatedAt : msg.updatedAt,
                    })
    
                    socket.to(to_user_socket_id).emit(SUB_EVENT_RECEIVE_MESSAGE, JSON.parse(sendData));
                }
            }
        }
    })
}

function joinRoom(socket){
    socket.on(EVENT_JOIN_ROOM, async function(msg){
        
    });
}

function onDisconnect(socket){
    socket.on(ON_DISCONNECT, function(){
        disconnectFunc(socket);
    })
}

function deleteUserID(userID){
    for(var i = 0 ; i < offlineUserList.length; ++i){
        if(offlineUserList[i] === userID){
            offlineUserList.splice(i,1);
            i--;
        }
    }
}

function checkUserID(userID){
    var check = false;
    for(var i = 0 ; i < offlineUserList.length; ++i){
        if(offlineUserList[i] === userID){
            check = true;
        }
    }

    return check;
}

function onResumed(socket){
    socket.on(ON_RESUMED, function(msg) {
        var userID = msg.userID;

        client.hmset(String(userID), {
            "isOnline" : 1,
        });

        onlineUser();
        deleteUserID(userID * 1);
    })
}

function onPaused(socket){
    socket.on(ON_PAUSED, function(msg){
        var userID = msg.userID;

        client.hmset(String(userID), {
            "isOnline" : 0,
        });

        offlineUser();
        offlineUserList.push(userID * 1);
    })
}