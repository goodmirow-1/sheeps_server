var express = require('express');
var models = require('../../models');
var router = express.Router();
const { Op } = require('sequelize');


const redis = require('redis');
const client = redis.createClient(6379, "127.0.0.1");   //저장용

const roomFuncRouter = require('./roomFuncRouter');

const globalRouter = require('../global'),
    fcmFuncRouter = require('../fcm/fcmFuncRouter');

var URL = '/Room/';

router.post('/Info/Select', async ( req, res ) => {
    await models.RoomInfo.findOne({
        where: {
            RoomName : req.body.roomName,
        },
        include : [
            {
                model : models.RoomUser,
                where : {
                    UserID : req.body.userID
                },
                required : true,
            }
        ]
    }).then( async result => {
        console.log(URL + 'Info/Select Success' + result);


        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + 'Info/Select Failed ' + err);
        res.status(400).send(null);
    })
});

router.post('/Info/IDSelect', async (req, res) => {
    let body = req.body;

    await models.RoomInfo.findAll({
        attributes: ['RoomName'],
        where :{
            RoomID : body.index,
        },
        include : [
            {
                model : models.RoomUser,
                where : {
                    UserID : {
                        [ Op.ne ] : body.userID
                    }
                },
                attributes: ['UserID'],
                required : true,
            }
        ]
    }).then( result => {
        console.log(URL + 'Info/IDSelect Success' + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + 'Info/IDSelect failed' + err);
        res.status(400).send(null);
    });
});

router.post('/User/Select', async (req, res ) => {
    let body = req.body;

    await models.RoomUser.findAll({
        attributes : ["RoomID"],
        where : {
            UserID : body.userID,
        },
    }).then( result => {
        if(result[0] == null){
            res.status(400).send(null);
        }
        else{
            selectIncludeRoomInfo(res, result, body.userID);
        }
    }).catch( err => {
        globalRouter.logger.error(URL + "User/Select Failed" + err);
        res.status(400).send(null);
    });
});

async function selectIncludeRoomInfo( res, roomInfoResult, userID ){
    var data = [];
    var maxLength = roomInfoResult.length;
    for(let i = 0 ; i < maxLength; ++i){
        await models.RoomInfo.findAll({
            order : [
                ['updatedAt', 'DESC']
            ],
            where : {
                RoomID : roomInfoResult[i].RoomID,
            },
            include :[
                {
                    model : models.RoomUser,
                    required : true,
                }
            ]
        }).then( result => {
            console.log(URL + 'selectIncludeRoomInfo Success' + result);
            data.push(result);

            if(i == (maxLength - 1)){
                res.status(200).send(data);
            }
                
        }).catch( err => {
            globalRouter.logger.error(URL + 'selectIncludeRoomInfo Failed' + err);
            res.status(400).send(null);
        })
    }
}


router.post('/Invite/Select', async (req, res) => {
    let body = req.body;
    //await models.InvitingRoomUser.findAndCountAll({
    await models.InvitingRoomUser.findAll({
        where: {
            InviteID : body.userID,
        }
    }).then( result => {
        console.log(URL + '/Invite/Select Success' + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + '/Invite/Select Failed' + err);
        res.status(400).send(null);
    })
})

router.post('/Invite/TargetSelect', async (req, res) => {

    let body = req.body;
    let resData;

    let tarInviteCheck = await models.InvitingRoomUser.findOne({
        where : {
            UserID : body.inviteID,
            InviteID : body.userID,
        }
    });
    
    if(globalRouter.IsEmpty(tarInviteCheck)){
        await models.InvitingRoomUser.findOne({
            where: {
                UserID : body.userID,
                InviteID : body.inviteID,
            }
        }).then( result => {
            console.log(URL + '/Invite/TargetSelect Success' + result);

            //초대장 없음
            if(globalRouter.IsEmpty(result)){
                resData = {
                    res : 3
                }
            }else{//내가 보낸 초대장이 있음
                if(result.Response == 0){
                    resData = {
                        recruitID : result.id,
                        res : 2
                    }
                }else{
                    resData = {
                        recruitID : result.id,
                        res : 4
                    }
                }
            }
            res.status(200).send(resData);
        }).catch( err => {
            globalRouter.logger.error(URL + '/Invite/TargetSelect Failed' + err);
            resData = {
                res : 0
            }
            res.status(400).send(resData);
        })
    }else{
        console.log(URL + 'Invite/Insert InvitingRoomUser Already Have' + tarInviteCheck);

        //상대방이 보낸 초대장
        resData = {
            recruitID : tarInviteCheck.id,
            res : 1
        };

        res.status(200).send(resData);
        return;
    }
})

router.post('/Invite/Insert', async (req, res) => {
    let body = req.body;
    var date = new Date();
    let resData;

    let tarInviteCheck = await models.InvitingRoomUser.findOne({
        where : {
            UserID : body.inviteID,
            InviteID : body.userID,
            Response : 0
        }
    });

    if(globalRouter.IsEmpty(tarInviteCheck)){
        await models.InvitingRoomUser.findOrCreate({
            where : {
                UserID : body.userID,
                InviteID : body.inviteID,
                Response : 0,
                createdAt : date,
                updatedAt : date,
            },
        }).then(function(result) {
            if(result[1]){
                console.log(URL + 'Invite/Insert success' + result);
    
                client.hgetall(String(body.inviteID), async function(err, obj) {
                    if(err) throw err;
                    if(obj == null) return;
    
                    var data = JSON.stringify({
                        userID : body.userID,
                        inviteID : body.inviteID,
                        title : "채팅 초대",
                        type : "INVITE",
                        tableIndex : result[0].id,
                        body : body.userName + " 님이 당신에게 채팅 요청을 보냈습니다.",
                        isSend : obj.isOnline,
                        topic : 'TEAM_INVITE',
                    })
        
                    if(fcmFuncRouter.SendFcmEvent( data )){
                        console.log(URL + 'Invite/Insert fcm is true');
                        let resData = {
                            res : 2
                        };            
                        res.status(200).send(resData);
                    }
                    else {
                        console.log(URL + 'Invite/Insert fcm is false');
                        res.status(400).send(null);   
                    }
                });
            }else{
                console.log(URL + 'Invite/Insert already have invite data');
            }
        }).catch( err => {
            globalRouter.logger.error(URL + 'Invite/Insert failed' + err);

            let resData = {
                res : 0
            };

            res.status(200).send(resData);
        });
    }else{
        console.log(URL + 'Invite/Insert InvitingRoomUser Already Have' + tarInviteCheck);

        let resData = {
            recruitID : tarInviteCheck.id,
            res : 1
        };

        res.status(400).send(resData);
        return;
    }
});

router.post('/Invite/Response', async (req, res) => {
    let body = req.body;

    client.hgetall(String(body.from), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var type = "INVITE_ACCEPT";
        var message = " 님이 채팅 초대를 수락하였습니다.";
        
        if(body.response == 2){
            type = "INVITE_REFUSE";
            message = " 님이 채팅 초대를 거절하였습니다.";
        }   
    
        var data = JSON.stringify({
            userID : body.to,
            inviteID : body.from,
            title : "채팅 초대",
            type : type,
            tableIndex : body.tableIndex,
            body : body.userName +  message,
            isSend : obj.isOnline,
            topic : 'TEAM_INVITE',
        })

        if(fcmFuncRouter.SendFcmEvent( data )){
            console.log(URL + 'Invite/Response fcm is true');
        }
        else {
            console.log(URL + 'Invite/Response fcm is false');
        }
    
        //거절
        if(body.response == 2) {
            await models.InvitingRoomUser.destroy({
                where: {
                    id : body.tableIndex,
                }
            }).then( result => {
                console.log(URL + 'Invite/Response InvitingRoomUser Reject' + result);
                res.status(200).send(true);
            }).catch( err => {
                console.log("Invite/Response InvitingRoomUser Reject Failed" + err);
                res.status(400).send(null);
            })
            return;
        }else{
            await models.InvitingRoomUser.update(
                {
                    Response: body.response   
                },
                {where:{id : body.tableIndex,},
            }).then(result => {
                console.log(URL + 'Invite/Response update success' + result);
            }).catch(err => {
                globalRouter.logger.error(URL + 'Invite/Response update failed' + err);
                res.status(400).send(null);
                return;
            });
        }
    
        var data = JSON.stringify({
            userID : body.to,
            roomName : body.roomName,
            type : 1,
            max : 30,
        });
        roomFuncRouter.insertRoomInfoAndUser(data).then(function (result){
            console.log('/Invite/Response  success' + result);
            var subData = JSON.stringify({
                userID : body.from,
                roomName : body.roomName,
                type : 1,
                max : 30,
            });
            roomFuncRouter.insertRoomInfoAndUser(subData).then(function (result2){
                console.log(URL + 'Invite/Response second success' + result2);
                res.status(200).send(true);
            }).catch(function (err2){
                globalRouter.logger.error(URL + 'Invite/Response second failed' + err2 );
                res.status(400).send(null);    
            })
        }).catch(function (err) {
            globalRouter.logger.error(URL +'Invite/Response failed' + err );
            res.status(400).send(null);
        });
    });
});

router.post('/Declare', async (req, res) => {

    await models.RoomDeclare.findOrCreate({
        where: {
          UserID : req.body.userID,
          RoomName : req.body.roomName,
          Type: req.body.type
        },
        defaults: {
          UserID : req.body.userID,
          RoomName : req.body.roomName,
          Contents : req.body.contents,
          Type: req.body.type
        }
      }).then( result => {
        console.log(URL + "Declare RoomDeclare findOrCreate Success");
        res.status(200).send(result);
      }).catch( err => {
        globalRouter.logger.error(URL + "Declare RoomDeclare findOrCreate Faield" + err);
        res.status(400).send(null);
      })
  });

  router.post('/Update/Alarm', async( req, res) => {
      await models.RoomUser.update(
          {
              Alarm : req.body.alarm
          },
          {
              where : {
                  id : req.body.id
              }
          }
      ).then(result => {
        console.log(URL + "Update/Alarm RoomUser update Success");
        res.status(200).send(result);
      }).catch( err => {
        globalRouter.logger.error(URL + "Update/Alarm RoomUser update Faield" + err);
        res.status(400).send(null);
      })
  })

  //방 나가기
  router.post('/Leave', async ( req, res) => {

    if(req.body.type != 1){
        //게시글의 주인일때
        if(req.body.recruitID != -1){
            if(req.body.type == 4){ //팀원이 되었으므로 초대장 삭제
                await models.InvitingTeamMemberRecruitsUser.destroy(
                    {
                        where : {
                            id : req.body.recruitID
                        }
                    }
                ).then(result => {
                    console.log(URL + 'Leave invite destroy success');
                }).catch(err => {
                    globalRouter.logger.error(URL + 'Leave invite destroy'  + err);    
                })
            }else{
                await models.InvitingPersonalSeekTeamUser.destroy(
                    {
                        where : {
                            id : req.body.recruitID
                        }
                    }
                ).then(result => {
                    console.log(URL + 'Leave invite destroy success');
                }).catch(err => {
                    globalRouter.logger.error(URL + 'Leave destroy failed' + err);    
                })
            }
        }
    }else{
        await models.InvitingRoomUser.destroy(
            {
                where : {
                    id : req.body.recruitID
                }
            }
        ).then(result => {
            console.log(URL + 'Leave invite destroy success');
        }).catch(err => {
            globalRouter.logger.error(URL + 'Leave invite destroy'  + err);    
        })
    }

    await models.RoomUser.destroy(
        {
            where : {
                UserID : req.body.userID,
                RoomID : req.body.roomID
            }
        }
    ).then(async result => {
        console.log(URL + "Leave RoomUser destroy Success");

        //채팅방에 있는 사람들에게
        await models.RoomUser.findAll({
            where : {
                RoomID : req.body.roomID
            }
        }).then(roomUserResult => {
            for(var i = 0 ; i < roomUserResult.length; ++i){
                var targetID = roomUserResult[i].UserID;
                client.hgetall(String(targetID), async function(err, obj) {
                    if(err) throw err;
                    if(obj == null) return;

                    var data = JSON.stringify({
                        userID : req.body.userID,
                        inviteID : targetID,
                        title : "채팅",
                        type : "ROOM_LEAVE",
                        targetIndex : req.body.roomID,
                        body : "'" + req.body.userName + "' 이 방을 나갔습니다.",
                        isSend : obj.isOnline,
                        topic : 'ROOM_LEAVE',
                    })
            
                    if(fcmFuncRouter.SendFcmEvent( data )){
                        console.log(URL + 'Leave fcm is true');
                    }
                    else {
                        console.log(URL + 'Leave fcm is false');
                    }
                });
                
            }
        }).catch(err => {
            globalRouter.logger.error(URL + "Leave RoomUser destroy Faield" + err);
            res.status(400).send(null);
        })

        res.status(200).send(true);
    }).catch(err => {
        globalRouter.logger.error(URL + "Leave RoomUser destroy Faield" + err);
        res.status(400).send(null);
    })
  })

module.exports = router;