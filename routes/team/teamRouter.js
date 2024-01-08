const fcmFuncRouter = require('../fcm/fcmFuncRouter');
const fs = require('fs');

const { Op } = require('sequelize');
const { error } = require('console');


//const redis = require('redis');
//const client = redis.createClient(6379, "127.0.0.1");   //저장용

const router = require('express').Router(),
    models = require('../../models'),
    roomFuncRouter = require('../room/roomFuncRouter'),
    globalRouter = require('../global'),
    formidable = require('formidable'),
    fs_extra = require('fs-extra'),
    badgeFuncRouter = require('../badge/badgeFuncRouter');

const client = globalRouter.client;

var URL = '/Team/';

router.post('/Profile/SelectID', async (req, res) => {
    await models.team.findOne({
        where: {
            id: req.body.id
        },
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
    }).then(result => {
        console.log(URL + 'Profile/SelectID Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/SelectID Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Profile/ModifySelectID', async (req, res) => {
    await models.team.findOne({
        where: {
            id: req.body.id
        },
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
    }).then(result => {
        console.log(URL + 'Profile/ModifySelectID Success' + result);

        var date= new Date(result.updatedAt.toString());
    
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
    
        month = month >= 10 ? month : '0' + month; 
        day = day >= 10 ? day : '0' + day; 
        hour = hour >= 24 ? hour - 24 : hour;
        hour = hour >= 10 ? hour : '0' + hour;
        minutes = minutes >= 10 ? minutes : '0' + minutes;
        seconds = seconds >= 10 ? seconds : '0' + seconds;
    
        var strDate = year.toString() + month.toString() + day.toString() + hour.toString() + minutes.toString() + seconds.toString();
        if(strDate == updateAt){
            console.log('IS SAME');
            res.status(400).send(null);
          }else{
            console.log('DIFF');
            res.status(200).send(result);
          }
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/ModifySelectID Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Profile/SelectUser', async (req, res) => {
    await models.TeamList.findAll({
        where: {
            UserID: req.body.userID,
        },
    }).then(result => {
        console.log(URL + 'Profile/SelectUser Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/SelectUser Failed" + err);
        res.status(400).send(null);
    });
})

router.post('/Profile/Check/Member', async (req, res) => {
    await models.TeamList.findOne({
        where: {
            TeamID : req.body.teamID,
            UserID: req.body.userID
        },
    }).then(result => {
        console.log(URL + 'Profile/SelectUser Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/SelectUser Failed" + err);
        res.status(400).send(null);
    });
});

router.get('/Profile/Select', async (req, res) => {
    await models.team.findAll({
        limit: 30,
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
        order : [
            ['updatedAt', 'DESC']
        ],
        where : {
            IsShow : 1
        }
    }).then(result => {
        console.log(URL + 'Profile/Select Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/Select Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Profile/SearchName', async (req, res) => {
    let searchWord = req.body.searchWord;

    await models.team.findAll({
      where: {
        Name : {
            [Op.like] : '%' + searchWord + '%'
        },
        IsShow : 1
      },
      order : [
        ['updatedAt', 'DESC']
      ],
      offset : req.body.index * 1,
      include: [
        {
            model: models.TeamList,
            required: true,
            limit: 99,
        },
        {
            model: models.teamauth,
            required: true,
            limit: 99,
        },
        {
            model: models.teamperformance,
            required: true,
            limit: 99,
        },
        {
            model: models.teamwin,
            required: true,
            limit: 99,
        },
        {
            model: models.teamlinks,
            required: true,
            limit: 99,
        },
        {
            model: models.TeamPhoto,
            required: true,
            limit: 99,
            order : [
              ['Index', 'ASC']
            ],
        }
    ],
    }).then(result => {
        console.log(URL + 'Profile/SearchName Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/SearchName Failed" + err);
        res.status(400).send(null);
    });
})

router.post('/Profile/SelectOffset', async (req, res) => {
    await models.team.findAll({
        where : {
            IsShow : 1
        },
        offset: req.body.index * 1, //새로운 리스트로 보여주는 부분이 없으 offset 다시 . . 
        limit: 30,
        order : [
            ['updatedAt', 'DESC']
        ],
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
    }).then(result => {
        console.log(URL + 'Profile/SelectOffset Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/SelectOffset Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Profile/UserSelect', async (req, res) => {
    let body = req.body;

    await models.team.findOne({
        where: {
            id: body.id
        },
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
    }).then(result => {
        console.log(URL + 'Profile/UserSelect Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/UserSelect Failed" + err);
        res.status(400).send(null);
    });
});

router.get('/Profile/NewUserSelect', async (req, res) => {
    await models.team.findAll({
        attributes: [ //여기없는데 필요한 부분 추가해야함
          'id', 'Name','Part','Location'
        ],
        include : [
            {
                model: models.TeamPhoto,
                required: true,
                limit: 1,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
        order : [
          ['createdAt', 'DESC']
        ],
        limit : 10,
        where : {
            IsShow : 1
        }
    }).then(result => {
        console.log(URL + 'Profile/NewUserSelect Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/NewUserSelect Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/WithoutTeamList', async (req, res) => {
    let body = req.body;

    await models.TeamList.findAll({
        where : {
            TeamID: body.teamID,
            UserID : {
            [Op.notIn] : [body.to, body.from]
            }
        }
    }).then(result => {
        console.log(URL + 'WithoutTeamList Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "WithoutTeamList Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Profile/Leader', async (req, res) => {
    let data = req.body;

    await models.team.findAll({
        where: {
            LeaderID: data.userID,
            IsShow : 1
        },
        order : [
            ['updatedAt', 'DESC']
          ],
        include: [
            {
                model: models.TeamList,
                required: true,
                limit: 99,
            },
            {
                model: models.teamauth,
                required: true,
                limit: 99,
            },
            {  
                model: models.teamperformance,
                required: true,
                limit: 99,
            },
            {   
                model: models.teamwin,
                required: true,
                limit: 99,
            },
            {
                model: models.teamlinks,
                required: true,
                limit: 99,
            },
            {
                model: models.TeamPhoto,
                required: true,
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
            }
        ],
    }).then(result => {
        console.log(URL + 'Profile/Leader Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "Profile/Leader Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Request/Insert', async (req, res) => {
    let body = req.body;

    await models.InvitingTeamUsers.create({
        TeamID: body.teamID,
        InvitingID: body.userID,
    }).then(result => {
        console.log(URL + 'Request/Insert Success' + result);
        client.hgetall(String(body.leaderID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID: body.userID,
                inviteID: body.leaderID,
                title: "팀 요청",
                type: "TEAM_REQUEST",
                tableIndex: result.id,
                teamIndex: body.teamID,
                body: "팀 요청를 받았습니다.",
                roomName: body.roomName,
                isSend: obj.isOnline,
                topic : 'TEAM_INVITE',
            })

            if (fcmFuncRouter.SendFcmEvent(data)) {
                console.log(URL + 'Request/Insert fcm is true');
                res.status(200).send(true);
            }
            else {
                console.log(URL + 'Request/Insert fcm is false');
                res.status(400).send(null);
            }
        });
    }).catch(err => {
        globalRouter.logger.error(URL + "Request/Insert Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Request/Response', async (req, res) => {
    let body = req.body;

    client.hgetall(String(body.from), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var type = "TEAM_REQUEST_ACCEPT";
        var message = "팀 요청을 수락하였습니다.";

        if (body.response == 2) {
            type = "TEAM_REQUEST_REFUSE";
            message = "팀 요청을 거절하였습니다.";
        }

        var data = JSON.stringify({
            userID: body.to,
            inviteID: body.from,
            title: "팀 초대",
            type: type,
            tableIndex: body.tableIndex,
            teamIndex: body.teamIndex,
            body: message,
            roomName: body.roomName,
            isSend: obj.isOnline,
            topic : 'TEAM_INVITE',
        })

        if (fcmFuncRouter.SendFcmEvent(data)) {
            console.log(URL + 'Request/Response TEAM_INVITE fcm is true');
        }
        else {
            console.log(URL + 'Request/Response TEAM_INVITE fcm is false');
        }

        //채팅 상태 업데이트
        await models.InvitingTeamUsers.findOne({
            where : {
                TeamID: body.teamIndex, 
                InvitingID : body.from
            }
        }).then(async invitingTeamResult => {
            console.log(invitingTeamResult);
            if(body.response == 2){
                invitingTeamResult.destroy({
                }).then( result => {
                    console.log(URL + 'Request/Response Reject' + result);
                    res.status(200).send(true);
                    return;
                }).catch( err => {
                    globalRouter.logger.error("Request/Response Reject Failed" + err);
                    res.status(400).send(null);
                    return;
                })
            }else{
                invitingTeamResult.update(
                {
                    Response: body.response
                }).then(async result => {
                    console.log(URL + 'Request/Response update success' + result);
        
                    var data = JSON.stringify({
                        userID: body.to,
                        roomName: body.roomName,
                        type : 2,
                        max: 30,
                    });
            
                    await models.TeamList.findOrCreate({
                        where: {
                            TeamID: body.teamIndex,
                            UserID: body.from
                        },
                        defaults: {
                            TeamID: body.teamIndex,
                            UserID: body.from
                        }
                    }).then(teamListResult => {
                        console.log('Request/Response teamList success' + teamListResult);
                    }).catch(teamListError => {
                        globalRouter.logger.error('Request/Response teamList failed' + teamListError);
                    })
            
                    var teamList = await models.TeamList.findAll({where : {
                        TeamID: body.teamIndex,
                        UserID : {
                            [Op.notIn] : [req.body.to, req.body.from]
                        }
                    }});
            
                    if(false == globalRouter.IsEmpty(teamList)){
                        for(let i = 0 ; i < teamList.length; ++i){
            
                            client.hgetall(String(teamList[i].UserID), async function(err, obj) {
                                if(err) throw err;
                                if(obj == null) return;
            
                                
                            var memberAddData = JSON.stringify({
                                userID: body.from,
                                inviteID: teamList[i].UserID,
                                title: "팀 초대",
                                type: "TEAM_MEMBER_ADD",
                                tableIndex: body.tableIndex,
                                teamIndex: body.teamIndex,
                                body: message,
                                roomName: body.roomName,
                                isSend: obj.isOnline,
                            })
                        
                            if (fcmFuncRouter.SendFcmEvent(memberAddData)) {
                                console.log(URL + 'Request/Response TEAM_MEMBER_ADD fcm is true');
                            }
                            else {
                                console.log(URL + 'Request/Response TEAM_MEMBER_ADD fcm is false');
                            }
                            });     
                        }

                        var condition = teamList.length * 1 + 2; //수락한 팀원과 리더

                        let badgedata = {
                            category : 2,
                            part : '팀원규모',
                            value : condition
                        }
                    
                        let badgeTable = await badgeFuncRouter.SelectlevelTeamBadge(badgedata);
                    
                        if(badgeTable != null && condition >= badgeTable.Condition){
                            let badgeIdData = {
                                badgeID : badgeTable.id,
                                teamID : body.index,
                            }
                            await badgeFuncRouter.InsertTeam(badgeIdData);
                        }
                    }
            
                    roomFuncRouter.insertRoomInfoAndUser(data).then(function (result) {
                        console.log(URL + 'Request/Response  success' + result);
                        var subData = JSON.stringify({
                            userID: body.from,
                            roomName: body.roomName,
                            type : 2,
                            max: 30,
                        });
                        roomFuncRouter.insertRoomInfoAndUser(subData).then(function (result2) {
                            console.log(URL + 'Request/Response second success' + result2);
                            res.status(200).send(teamList);
                            return;
                        }).catch(function (err2) {
                            globalRouter.logger.error(URL + 'Request/Response second failed' + err2);
                            res.status(400).send(null);
                            return;
                        })
                    }).catch(function (err) {
                        globalRouter.logger.error(URL + 'Request/Response failed' + err);
                        res.status(400).send(null);
                        return;
                    });
                }).catch(err => {
                    globalRouter.logger.error(URL + 'Request/Response invitingTeamResult update failed' + err);
                    res.status(400).send(null);
                });
            }
        }).catch(err => {
            globalRouter.logger.error(URL + 'Request/Response InvitingTeamUsers findOne failed' + err);
            res.status(400).send(null);
            return;
        }); 
    });

});

router.post('/Invite/Insert', async (req, res) => {
    let body = req.body;

    await models.InvitingTeamUsers.create({
        TeamID: body.teamID,
        InvitingID: body.userID,
    }).then(result => {

        client.hgetall(String(body.userID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID: body.leaderID,
                inviteID: body.userID,
                title: "팀 초대",
                type: "TEAM_INVITE",
                tableIndex: result.id,
                teamIndex: body.teamID,
                body: "팀 초대를 받았습니다.",
                roomName: body.roomName,
                isSend: obj.isOnline,
                topic : 'TEAM_INVITE',
            })

            if (fcmFuncRouter.SendFcmEvent(data)) {
                console.log(URL + 'Invite/Insert TEAM_INVITE fcm is true');
            }
            else {
                console.log(URL + 'Invite/Insert TEAM_INVITE fcm is false');
            }
        });
    }).catch(err => {
        globalRouter.logger.error("Invite/Insert InvitingTeamUsers create Failed error" + err);
        res.status(400).send(null);
    });
});

router.post('/Invite/Response', async (req, res) => {
    let body = req.body;

    client.hgetall(String(body.to), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;


        var type = "TEAM_INVITE_ACCEPT";
        var message = "팀 초대를 수락하였습니다.";

        if (body.response == 2) {
            type = "TEAM_INVITE_REFUSE";
            message = "팀 초대를 거절하였습니다.";
        }

        var data = JSON.stringify({
            userID: body.to,
            inviteID: body.from,
            title: "팀 초대",
            type: type,
            tableIndex: body.tableIndex,
            teamIndex: body.teamIndex,
            body: message,
            roomName: body.roomName,
            isSend: obj.isOnline,
        })

        if (fcmFuncRouter.SendFcmEvent(data)) {
            console.log(URL + 'Invite/Response TEAM_INVITE fcm is true');
        }
        else {
            console.log(URL + 'Invite/Response TEAM_INVITE fcm is false');
        }

        var invitingTeam = await models.InvitingTeamUsers.findOne({
            where : {
                TeamID : body.teamIndex,
                InvitingID : body.to
            }
        });

        if(body.response == 2){
            invitingTeam.destroy({
            }).then( result => {
                console.log(URL + 'Invite/Response invitingTeam destroy Success' + result);
                res.status(200).send(true);
                return;
            }).catch( err => {
                globalRouter.logger.error(URL + "Invite/Response invitingTeam destroy Failed" + err);
                res.status(400).send(null);
                return;
            })
        }else{
            invitingTeam.update(
            {
                Response: body.response
            }).then(async result => {
                console.log(URL + 'Invite/Response invitingTeam update Success' + result);

                await models.TeamList.findOrCreate({
                    where: {
                        TeamID: invitingTeam.TeamID,
                        UserID: body.to
                    },
                    defaults: {
                        TeamID: invitingTeam.TeamID,
                        UserID: body.to
                    }
                }).then(teamListResult => {
                    console.log(URL + 'Invite/Response TeamList findOrCreate Success' + teamListResult);
                }).catch(teamListError => {
                    globalRouter.logger.error(URL + 'Invite/Response TeamList findOrCreate Failed' + teamListResult);
                })
        
                var teamList = await models.TeamList.findAll({where : {
                    TeamID: invitingTeam.TeamID,
                    UserID : {
                        [Op.notIn] : [req.body.to, req.body.from]
                    }
                }});

                var toUser = await models.user.findOne({where : {
                    UserID : body.to
                }})
        
                if(false == globalRouter.IsEmpty(teamList)){
                    for(let i = 0 ; i < teamList.length; ++i){
        
                        client.hgetall(String(teamList[i].UserID), async function(err, obj) {
                            if(err) throw err;
                            if(obj == null) return;
        
                            var memberAddData = JSON.stringify({
                                userID: body.to,
                                inviteID: teamList[i].UserID,
                                title: "팀 초대",
                                type: "TEAM_MEMBER_ADD",
                                tableIndex: body.tableIndex,
                                teamIndex: body.teamIndex,
                                body: toUser.Name + " 가 팀에 가입하였습니다.",
                                roomName: body.roomName,
                                isSend: obj.isOnline,
                            })

                            if (fcmFuncRouter.SendFcmEvent(memberAddData)) {
                                console.log(URL + 'Invite/Response TEAM_MEMBER_ADD fcm is true');
                            }
                            else {
                                console.log(URL + 'Invite/Response TEAM_MEMBER_ADD fcm is false');
                            }
                        });
                    }

                    var condition = teamList.length * 1 + 2; //수락한 팀원과 리더

                    let badgedata = {
                        category : 2,
                        part : '팀원규모',
                        value : condition
                    }
                
                    let badgeTable = await badgeFuncRouter.SelectlevelTeamBadge(badgedata);
                
                    if(badgeTable != null && condition >= badgeTable.Condition){
                        let badgeIdData = {
                            badgeID : badgeTable.id,
                            teamID : invitingTeam.TeamID
                        }
                        await badgeFuncRouter.InsertTeam(badgeIdData);
                    }
                }
                
        
                var data = JSON.stringify({
                    userID: body.to,
                    roomName: body.roomName,
                    max: 30,
                    type : 2,
                });
                roomFuncRouter.insertRoomInfoAndUser(data).then(function (result) {
                    console.log(URL + 'Invite/Response insertRoomInfoAndUser success' + result);
                    var subData = JSON.stringify({
                        userID: body.from,
                        roomName: body.roomName,
                        max: 30,
                        type : 2,
                    });
                    roomFuncRouter.insertRoomInfoAndUser(subData).then(async function (result2) {
                        console.log(URL + 'Invite/Response insertRoomInfoAndUser second success' + result2);
        
                        res.status(200).send(teamList);
                    }).catch(function (err2) {
                        globalRouter.logger.error(URL + 'Invite/Response insertRoomInfoAndUser second failed' + err2);
                        res.status(400).send(null);
                    })
                }).catch(function (err) {
                    globalRouter.logger.error(URL + 'Invite/Response insertRoomInfoAndUser failed' + err);
                    res.status(400).send(null);
                });
            }).catch(err => {
                globalRouter.logger.error(URL + 'Invite/Response invitingTeam update failed' + err);
                res.status(400).send(null);
            });
        }
    });
});

router.post('/Invite/Select', async (req, res) => {
    let data = req.body;

    await models.InvitingTeamUsers.findAll({
        where: {
            InvitingID: data.userID,
            Response: {
                [Op.eq]: 0
            }
        },
        
    }).then(result => {
        console.log(URL + 'Invite/Select InvitingTeamUsers findAll Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Invite/Select InvitingTeamUsers findAll Failed' + err);
        res.status(400).send(null);
    });
});

router.post('/Invite/TargetSelect', async (req, res) => {
    let data = req.body;

    await models.InvitingTeamUsers.findOne({
        where: {
            TeamID: data.teamID,
            InvitingID: data.userID
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Invite/TargetSelect InvitingTeamUsers findOne Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Invite/TargetSelect InvitingTeamUsers findOne Failed' + err);
        res.status(400).send(null);
    });
});

router.post('/Invite/SelectTarget', async (req, res) => {
    let data = req.body;
    var resData = [];

    await models.team.findAll({
        where: {
            LeaderID: data.userID,
            IsShow : 1
        }
    }).then(async result => {
        
        if (globalRouter.IsEmpty(result)) {
            console.log(URL + 'Invite/SelectTarget team is Empty');
            res.status(400).send(null);
            return;
        }

        for (let i = 0; i < result.length; ++i) {
            await models.InvitingTeamUsers.findOne({
                where: {
                    TeamID: result[i].id,
                    InvitingID: data.inviteID
                },
                order: [
                    ['id', 'DESC']
                ],
            }).then(result2 => {
                console.log(URL + 'Invite/SelectTarget InvitingTeamUsers findAll Success' + result2);
                if (false == globalRouter.IsEmpty(result2)) {
                    resData.push(result2);
                }

                if (i == (result.length - 1)) {

                    if (globalRouter.IsEmpty(resData))
                        resData = null;

                    res.status(200).send(resData);
                    return;
                }
            }).catch(err => {
                globalRouter.logger.error(URL + 'Invite/SelectTarget InvitingTeamUsers findAll Failed' + err);
                res.status(400).send(null);
            });
        }

    }).catch(err => {
        globalRouter.logger.error(URL + 'Invite/SelectTarget team findAll Failed' + err);
        res.status(400).send(null);
    })
});


router.post('/InsertLike', async (req, res) => {
    let body = req.body;

    globalRouter.CreateOrDestroy(models.TeamLike,
        {
            UserID: body.userID,
            TargetID: body.targetID
        }
    ).then(async result => {

        if (result['created'] == true) {

            var team = await models.team.findOne({ where: { id: body.targetID } })

            if (globalRouter.IsEmpty(team)) {
                globalRouter.logger.error(URL + 'InsertLike team is empty');
                res.status(400).send(result);
                return;
            }

            res.status(200).send(result);

            // //자기자신이면 건너뜀
            // if (team.LeaderID == body.userID) {
            //     res.status(200).send(result);
            //     return;
            // }

            // client.hgetall(String(team.LeaderID), async function(err, obj) {
            //     if(err) throw err;
            //     if(obj == null) return;

            //     var user = await models.user.findOne({ where: { UserID: body.userID } });

            //     var data = JSON.stringify({
            //         userID: body.userID,
            //         inviteID: team.LeaderID,
            //         title: "팀 프로필",
            //         type: "TEAM_LIKE",
            //         tableIndex: result['item'].id,
            //         body: user.Name + "님이 " + team.Name + "팀에 " + "좋아요 를 눌렀습니다.",
            //         isSend: obj.isOnline,
            //         topic : 'TEAM_INVITE',
            //     })

            //     if (fcmFuncRouter.SendFcmEvent(data)) {
            //         console.log(URL + 'InsertLike TEAM_LIKE fcm is true');
            //         res.status(200).send(result);
            //         return;
            //     } else {
            //         console.log(URL + 'InsertLike TEAM_LIKE fcm is false');
            //         res.status(200).send(result);
            //         return;
            //     }
            // });
        }else{
            res.status(200).send(result);
        }
    }).catch(err => {
        globalRouter.logger.error(URL + "InsertLike TeamLike CreateOrDestroy error" + err);
        res.status(400).send(null);
    })
});

router.post('/SelectLike', async (req, res) => {
    let data = req.body;

    await models.TeamLike.findAll({
        where: {
            UserID: data.userID,
        }
    }).then(result => {
        console.log(URL + 'SelectLike TeamLike findAll Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'SelectLike TeamLike findAll Failed ' + err);
        res.status(400).send(null);
    })
});

router.post('/Select/Auth', async (req, res) => {
    let data = req.body;

    await models.teamauth.findOne({
        where : {
            TAuthID : data.id
        }
    }).then(result => {
        console.log(URL + 'Select/Auth Successd' + result);
        res.status(200).send(result);
      }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Auth Failed' + err);
        res.status(400).send(null);
      })
});

router.post('/Select/Performance', async (req, res) => {
    let data = req.body;

    await models.teamperformance.findOne({
        where : {
            TPerformanceID : data.id
        }
    }).then(result => {
        console.log(URL + 'Select/Performance Successd' + result);
        res.status(200).send(result);
      }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Performance Failed' + err);
        res.status(400).send(null);
      })
});

router.post('/Select/Win', async (req, res) => {
    let data = req.body;

    await models.win.findOne({
        where : {
            TWinID : data.id
        }
    }).then(result => {
        console.log(URL + 'Select/Win Successd' + result);
        res.status(200).send(result);
      }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Win Failed' + err);
        res.status(400).send(null);
      })
});

router.post('/InsertOrUpdate/Links', async(req, res) => {
    var teamlinks = await models.teamlinks.findOne({
      where : {
        TeamID : req.body.teamID
      }
    });
  
    if(globalRouter.IsEmpty(teamlinks)){
      await models.teamlinks.create({        
        TeamID : req.body.teamID,
        Site : req.body.site,
        Recruit : req.body.recruit,
        Instagram : req.body.instagram,
        Facebook : req.body.facebook,
      }).then(result => {
        console.log(URL + 'InsertOrUpdate/Links teamlinks create Success' + result);
        res.status(200).send(result);
      }).catch(err => {
        globalRouter.logger.error(URL + 'InsertOrUpdate/Links teamlinks create Failed' + err);
        res.status(400).send(null);
      })
    }else{
      await models.teamlinks.update(
        {
            Site : req.body.site,
            Recruit : req.body.recruit,
            Instagram : req.body.instagram,
            Facebook : req.body.facebook,
        },
        {
          where : {
            TeamID : req.body.teamID
          }
        }
      ).then(result => {
        console.log(URL + 'InsertOrUpdate/Links teamlinks update Success' + result);
        res.status(200).send(result);
      }).catch(err => {
        globalRouter.logger.error(URL + 'InsertOrUpdate/Links teamlinks update Failed' + err);
        res.status(400).send(null);
      })
    }
});

router.post('/KickOut/TeamMember', async(req, res) => {
    await models.TeamList.destroy({
        where : {
            TeamID : req.body.teamID,
            UserID : req.body.targetID,
        }
    }).then(async result => {
        console.log(URL + 'KickOut/TeamMember TeamList destroy Success' + result);

        // await models.InvitingTeamUsers.destroy({
        //     where : {
        //         TeamID : req.body.teamID,
        //         InvitingID : req.body.targetID,
        //         Response : 1
        //     }
        // }).then(result => {
        //     console.log(URL + 'KickOut/TeamMember InvitingTeamUsers destroy Success' + result);
        // }).catch(err => {
        //     globalRouter.logger.error(URL + 'KickOut/TeamMember InvitingTeamUsers destroy Failed' + err);
        // })

        //채팅방 나가기
        var data = JSON.stringify({
            userID : req.body.targetID,
            roomName: req.body.roomName,
        });

        roomFuncRouter.leaveRoomMember(data).then(function (result) {
            console.log('leave room success');
        });

        client.hgetall(String(req.body.targetID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID : req.body.userID,
                inviteID : req.body.targetID,
                title : "팀 프로필",
                type : "TEAM_MEMBER_KICKED_OUT",
                targetIndex : req.body.targetID,
                teamIndex : req.body.teamID,
                body : "팀 '" + req.body.teamName + "' 에서 강퇴 당하였습니다.",
                isSend : obj.isOnline,
                topic : 'TEAM_MEMBER_KICKED_OUT',
            })
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                console.log(URL + 'KickOut/TeamMember fcm is true');
            }
            else {
                console.log(URL + 'KickOut/TeamMember fcm is false');
            }
        });

        res.status(200).send(true);
    }).catch(err => {
        globalRouter.logger.error(URL + 'KickOut/TeamMember TeamList destroy Failed' + err);
        res.status(400).send(null);
    })

    //팀 리더를 제외한 사람들에게 보냄
    await models.TeamList.findAll({
        where : {
            TeamID : req.body.teamID
        }
    }).then(teamListResult => {
        console.log('KickOut/TeamMember teamListResult findAll Success' + teamListResult);

        if(globalRouter.IsEmpty(teamListResult) == false){
            for(var i = 0 ; i < teamListResult.length ; ++i){

                var userID = teamListResult[i].UserID;

                client.hgetall(String(teamListResult[i].UserID), async function(err, obj) {
                    if(err) throw err;
                    if(obj == null) return;
        
                    var data = JSON.stringify({
                        userID : req.body.userID,
                        inviteID : userID,
                        title : "팀 프로필",
                        type : "TEAM_MEMBER_KICKED_OUT",
                        targetIndex : req.body.targetID,
                        teamIndex : req.body.teamID,
                        body : "팀원 '" + req.body.userName + "' 이 팀에서 추방되었습니다.",
                        isSend : obj.isOnline,
                        topic : 'TEAM_MEMBER_KICKED_OUT',
                    })
            
                    if(fcmFuncRouter.SendFcmEvent( data )){
                        console.log(URL + 'KickOut/TeamMember fcm is true');
                    }
                    else {
                        console.log(URL + 'KickOut/TeamMember fcm is false');
                    }
                });
            }
        }
    }).catch(err => {
        globalRouter.logger.error(URL + 'KickOut/TeamMember teamListResult findAll Failed' + err);    
    })
});

router.post('/Leave', async(req, res) => {
    await models.TeamList.destroy({
        where : {
            TeamID : req.body.teamID,
            UserID : req.body.userID,
        }
    }).then(async result => {
        console.log(URL + 'Leave TeamList destroy Success' + result);

        //초대장 삭제
        await models.InvitingTeamUsers.destroy({
            where : {
                TeamID : req.body.teamID,
                InvitingID : req.body.userID,
                Response : 1
            }
        }).then(result => {
            console.log(URL + 'Leave InvitingTeamUsers destroy Success' + result);
        }).catch(err => {
            globalRouter.logger.error(URL + 'Leave InvitingTeamUsers destroy Failed' + err);
        })

        //채팅방 나가기
        var data = JSON.stringify({
            userID : req.body.userID,
            roomName: req.body.roomName,
        });

        roomFuncRouter.leaveRoomMember(data).then(function (result) {
            console.log('leave room success');
        });

        //팀 리더한테는 보냄
        client.hgetall(String(req.body.targetID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID : req.body.userID,
                inviteID : req.body.targetID,
                title : "팀 프로필",
                type : "TEAM_MEMBER_LEAVE",
                targetIndex : req.body.targetID,
                teamIndex : req.body.teamID,
                body : "팀원 '" + req.body.userName + "' 이 팀에서 나갔습니다.",
                isSend : obj.isOnline,
                topic : 'TEAM_MEMBER_KICKED_OUT',
            })
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                console.log(URL + 'Leave fcm is true');
            }
            else {
                console.log(URL + 'Leave fcm is false');
            }
        });

        res.status(200).send(true);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Leave TeamList destroy Failed' + err);
        res.status(400).send(null);
    })

    //팀 리더를 제외한 사람들에게 보냄
    await models.TeamList.findAll({
        where : {
            TeamID : req.body.teamID
        }
    }).then(teamListResult => {
        console.log('Leave teamListResult findAll Success' + teamListResult);

        if(globalRouter.IsEmpty(teamListResult) == false){
            for(var i = 0 ; i < teamListResult.length ; ++i){

                var userID = teamListResult[i].UserID;

                client.hgetall(String(teamListResult[i].UserID), async function(err, obj) {
                    if(err) throw err;
                    if(obj == null) return;
        
                    var data = JSON.stringify({
                        userID : req.body.userID,
                        inviteID : userID,
                        title : "팀 프로필",
                        type : "TEAM_MEMBER_LEAVE",
                        targetIndex : req.body.targetID,
                        teamIndex : req.body.teamID,
                        body : "팀원 '" + req.body.userName + "' 이 팀에서 나갔습니다.",
                        isSend : obj.isOnline,
                        topic : 'TEAM_MEMBER_KICKED_OUT',
                    })
            
                    if(fcmFuncRouter.SendFcmEvent( data )){
                        console.log(URL + 'Leave fcm is true');
                    }
                    else {
                        console.log(URL + 'Leave fcm is false');
                    }
                });
            }
        }
    }).catch(err => {
        globalRouter.logger.error(URL + 'Leave teamListResult findAll Failed' + err);    
    })
})

router.post('/Pass/Interview', async(req, res) => {
    let body = req.body;

    client.hgetall(String(body.to), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var type = "TEAM_INVITE_ACCEPT";
        var message = "팀 초대를 수락하였습니다.";

        var data = JSON.stringify({
            userID: body.to,
            inviteID: body.from,
            title: "팀 초대",
            type: type,
            tableIndex: body.tableIndex,
            teamIndex: body.teamIndex,
            body: message,
            roomName: body.roomName,
            isSend: obj.isOnline,
        })

        var target = body.from;
        if(body.isRecruit == true){ //팀원이 되었으므로 초대장 삭제
            await models.InvitingTeamMemberRecruitsUser.destroy(
                {
                    where : {
                        id : body.tableIndex
                    }
                }
            ).then(result => {
                console.log(URL + 'Pass/Interview invite response update success');
            }).catch(err => {
                globalRouter.logger.error(URL + 'Pass/Interview invite response update'  + err);    
            })
        }else{
            target = body.to;
            await models.InvitingPersonalSeekTeamUser.destroy(
                {
                    where : {
                        id : body.tableIndex
                    }
                }
            ).then(result => {
                console.log(URL + 'Pass/Interview invite response update success');
            }).catch(err => {
                globalRouter.logger.error(URL + 'Pass/Interview invite response update'  + err);    
            })
        }

        if (fcmFuncRouter.SendFcmEvent(data)) {
            console.log(URL + 'Pass/Interview TEAM_INVITE fcm is true');
        }
        else {
            console.log(URL + 'Pass/Interview TEAM_INVITE fcm is false');
        }

        await models.TeamList.findOrCreate({
            where: {
                TeamID: body.teamIndex,
                UserID: target
            },
            defaults: {
                TeamID: body.teamIndex,
                UserID: target
            }
        }).then(teamListResult => {
            console.log(URL + 'Invite/Response TeamList findOrCreate Success' + teamListResult);
        }).catch(teamListError => {
            globalRouter.logger.error(URL + 'Invite/Response TeamList findOrCreate Failed' + teamListResult);
        })

        var teamList = await models.TeamList.findAll({where : {
            TeamID: body.teamIndex,
            UserID : {
                [Op.notIn] : [req.body.to, req.body.from]
            }
        }});

        var who = await models.user.findOne({where : {
            UserID : target
        }})

        if(false == globalRouter.IsEmpty(teamList)){
            for(let i = 0 ; i < teamList.length; ++i){

                client.hgetall(String(teamList[i].UserID), async function(err, obj) {
                    if(err) throw err;
                    if(obj == null) return;

                    var memberAddData = JSON.stringify({
                        userID: body.to,
                        inviteID: teamList[i].UserID,
                        title: "팀 초대",
                        type: "TEAM_MEMBER_ADD",
                        tableIndex: body.tableIndex,
                        targetIndex: body.from,
                        teamIndex: body.teamIndex,
                        body: who.Name + " 가 팀에 가입하였습니다.",
                        roomName: body.roomName,
                        isSend: obj.isOnline,
                    })

                    if (fcmFuncRouter.SendFcmEvent(memberAddData)) {
                        console.log(URL + 'Invite/Response TEAM_MEMBER_ADD fcm is true');
                    }
                    else {
                        console.log(URL + 'Invite/Response TEAM_MEMBER_ADD fcm is false');
                    }
                });
            }

            var condition = teamList.length * 1 + 2; //수락한 팀원과 리더

            let badgedata = {
                category : 2,
                part : '팀원규모',
                value : condition
            }
        
            let badgeTable = await badgeFuncRouter.SelectlevelTeamBadge(badgedata);
        
            if(badgeTable != null && condition >= badgeTable.Condition){
                let badgeIdData = {
                    badgeID : badgeTable.id,
                    teamID : body.teamIndex
                }
                await badgeFuncRouter.InsertTeam(badgeIdData);
            }
        }
        
        //채팅방 생성 및 가입
        var data = JSON.stringify({
            userID: body.to,
            roomName: body.roomName,
            max: 30,
            type : 2,
        });
        roomFuncRouter.insertRoomInfoAndUser(data).then(function (result) {
            console.log(URL + 'Invite/Response insertRoomInfoAndUser success' + result);
            var subData = JSON.stringify({
                userID: body.from,
                roomName: body.roomName,
                max: 30,
                type : 2,
            });
            roomFuncRouter.insertRoomInfoAndUser(subData).then(async function (result2) {
                console.log(URL + 'Invite/Response insertRoomInfoAndUser second success' + result2);

                res.status(200).send(teamList);
            }).catch(function (err2) {
                globalRouter.logger.error(URL + 'Invite/Response insertRoomInfoAndUser second failed' + err2);
                res.status(400).send(null);
            })
        }).catch(function (err) {
            globalRouter.logger.error(URL + 'Invite/Response insertRoomInfoAndUser failed' + err);
            res.status(400).send(null);
        });
    });
});

router.post('/Check/LeaderTeam', async(req, res) => {
    await models.team.findAll({
        where : {
            LeaderID : req.body.userID
        }
    }).then(result => {
        if(globalRouter.IsEmpty(result)){
            res.status(200).send(true);
        }else{
            res.status(200).send(false);
        }
    }).catch(function (err) {
        globalRouter.logger.error(URL + 'Check/LeaderTeam team findAll failed' + err);
        res.status(400).send(null);
    });
})

router.post('/Delete', async(req, res) => {
    // await models.team.update(
    //     {
    //         IsShow : 0
    //     },
    //     {
    //         where : {
    //             id : req.body.id
    //         }
    //     }
    // ).then(result => {
    //     console.log(URL + 'Delete update Success');
    //     res.status(200).send(result);
    // }).catch(err => {
    //     globalRouter.logger.error(URL + 'Delete update Failed ' + err);
    //     res.status(400).send(null);
    // });

    await models.team.destroy(
        {
            where : {
                id : req.body.id
            }
        }
    ).then(result => {
        console.log(URL + 'Delete update Success');
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Delete update Failed ' + err);
        res.status(400).send(null);
    });
});

module.exports = router;