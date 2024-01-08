const router = require('express').Router(),
    globalRouter = require('../global'),
    models = require('../../models');

    const fcmFuncRouter = require('../fcm/fcmFuncRouter')
        moment = require('moment'),
        roomFuncRouter = require('../room/roomFuncRouter');

    const client = globalRouter.client;

const { Op } = require('sequelize');
var URL = '/Matching/';

router.get('/Select/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        where : {
            IsShow : 1,
        },
        limit : 30,
        order : [
            ['createdAt', 'DESC']
        ],
    }).then( result => {
        console.log(URL + "Select/TeamMemberRecruit find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/TeamMemberRecruit find Faield " + err);
        res.status(400).send(null);
    })
});

router.post('/Select/Offset/TeamMemberRecruit', async(req, res) => {
    var rule = {};

    if(req.body.category != "전체"){
        rule.Category = req.body.category;
    }
    rule.IsShow = 1;

    await models.TeamMemberRecruit.findAll({
        limit : req.body.limit * 1,
        offset: req.body.index * 1,
        order : [
            ['createdAt', 'DESC']
        ],
        where : rule
    }).then( result => {
        console.log(URL + "Select/Offset/TeamMemberRecruit find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/Offset/TeamMemberRecruit find Faield " + err);
        res.status(400).send(null);
    })
})

router.post('/Select/TeamMemberRecruitByID', async(req, res) => {
    await models.TeamMemberRecruit.findOne({
        where : {
            id : req.body.id
        }
    }).then( result => {
        console.log(URL + "Select/TeamMemberRecruitByID find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/TeamMemberRecruitByID find Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Select/TeamMemberRecruitByUserID', async(req, res) => {

    var teamList = await models.team.findAll({where : {LeaderID : req.body.userID},},);

    var resData = [];
    for(var i = 0 ; i < teamList.length; ++i){
      await models.TeamMemberRecruit.findAll({
          where : {
              TeamID : teamList[i].id,
              IsShow : 1
          },
      }).then( result => {
          console.log(URL + "Select/TeamMemberRecruitByID find Success " + result);

          for(var i = 0 ; i < result.length; ++i){
              if(!globalRouter.IsEmpty(result[i])){
                  resData.push(result[i]);
              }
          }

      }).catch( err => {
          globalRouter.logger.error(URL + "Select/TeamMemberRecruitByID find Faield " + err);
          res.status(400).send(null);
      });
    }
    resData.sort(function (a,b) {
      return b.id - a.id;
    });

    if(globalRouter.IsEmpty(resData))
        resData = null;

    res.status(200).send(resData);
})

router.get('/Select/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        limit : 30,
        order : [
            ['createdAt', 'DESC']
        ],
        where : {
            IsShow : 1,
        },
    }).then( result => {
        console.log(URL + "Select/PersonalSeekTeam Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/PersonalSeekTeam Faield " + err);
        res.status(400).send(null);
    })
});

router.post('/Select/Offset/PersonalSeekTeam', async(req, res) => {
    var rule = {};

    if(req.body.category != "전체"){
        rule.Category = req.body.category;
    }
    rule.IsShow = 1;

    await models.PersonalSeekTeam.findAll({
        limit : req.body.limit * 1,
        offset: req.body.index * 1,
        order : [
            ['createdAt', 'DESC']
        ],
        where : rule
    }).then( result => {
        console.log(URL + "Select/Offset/PersonalSeekTeam Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/Offset/PersonalSeekTeam Faield " + err);
        res.status(400).send(null);
    })
});

router.post('/Select/PersonalSeekTeamByID', async(req, res) => {
    await models.PersonalSeekTeam.findOne({
        where : {
            id : req.body.id
        }
    }).then( result => {
        console.log(URL + "Select/PersonalSeekTeamByID find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/PersonalSeekTeamByID find Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Select/PersonalSeekTeamByUserID', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        where : {
            UserID : req.body.userID,
            IsShow : 1,
        }
    }).then( result => {
        console.log(URL + "Select/PersonalSeekTeamByID find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/PersonalSeekTeamByID find Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Select/TeamMemberRecruitByTeamID', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        where : {
            TeamID : req.body.teamID,
            IsShow : 1,
        }
    }).then( result => {
        console.log(URL + "Select/PersonalSeekTeamByTeamID find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/PersonalSeekTeamByTeamID find Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Insert/TeamMemberRecruit', async(req, res) => {
    var body = req.body;

    await models.TeamMemberRecruit.create({
        TeamID : body.teamID,
        Title : body.title,
        RecruitPeriodStart : body.recruitPeriodStart,
        RecruitPeriodEnd : body.recruitPeriodEnd,
        RecruitInfo : body.recruitInfo,
        Category : body.category,
        ServicePart : body.servicePart,
        Location : body.location,
        SubLocation : body.subLocation,
        RecruitField : body.recruitField,
        RecruitSubField : body.recruitSubField,
        RoleContents : body.roleContents,
        Education : body.education,
        Career : body.career,
        DetailVolunteerQualification : body.detailVolunteerQualification,
        PreferenceInfo : body.preferenceInfo,
        DetailPreferenceInfoContents : body.detailPreferenceInfoContents,
        WorkFormFirst : body.workFormFirst,
        WorkFormSecond : body.workFormSecond,
        WorkDayOfWeek : body.workDayOfWeek,
        WorkTime : body.workTime,
        Welfare : body.welfare,
        DetailWorkCondition : body.detailWorkCondition
    }).then( result => {
        console.log(URL + "Insert/TeamMemberRecruit Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Insert/TeamMemberRecruit Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Insert/PersonalSeekTeam', async(req, res) => {
    var body = req.body;

    await models.PersonalSeekTeam.create({
        UserID : body.userID,
        Title : body.title,
        SeekingState : body.seekingState,
        SelfInfo : body.selfInfo,
        Category : body.category,
        SeekingFieldPart : body.seekingFieldPart,
        SeekingFieldSubPart : body.seekingFieldSubPart,
        AbilityContents : body.abilityContents,
        Education : body.education,
        Career : body.career,
        WorkFormFirst : body.workFormFirst,
        WorkFormSecond : body.workFormSecond,
        WorkDayOfWeek : body.workDayOfWeek,
        WorkTime : body.workTime,
        Welfare : body.welfare,
        NeedWorkConditionContents : body.needWorkConditionContents,
        Location : body.location,
        SubLocation : body.subLocation,
    }).then( result => {
        console.log(URL + "Insert/PersonalSeekTeam Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Insert/PersonalSeekTeam Faield " + err);
        res.status(400).send(null);
    });
})

router.post('/Update/TeamMemberRecruit', async(req, res) => {
    var body = req.body;

    await models.TeamMemberRecruit.update(
        {
            Title : body.title,
            RecruitPeriodStart : body.recruitPeriodStart,
            RecruitPeriodEnd : body.recruitPeriodEnd,
            RecruitInfo : body.recruitInfo,
            Category : body.category,
            ServicePart : body.servicePart,
            Location : body.location,
            SubLocation : body.subLocation,
            RecruitField : body.recruitField,
            RecruitSubField : body.recruitSubField,
            RoleContents : body.roleContents,
            Education : body.education,
            Career : body.career,
            DetailVolunteerQualification : body.detailVolunteerQualification,
            PreferenceInfo : body.preferenceInfo,
            DetailPreferenceInfoContents : body.detailPreferenceInfoContents,
            WorkFormFirst : body.workFormFirst,
            WorkFormSecond : body.workFormSecond,
            WorkDayOfWeek : body.workDayOfWeek,
            WorkTime : body.workTime,
            Welfare : body.welfare,
            DetailWorkCondition : body.detailWorkCondition
        },
        {
            where : {
                id : body.id,
                TeamID : body.teamID
            },
        }).then( result => {
            console.log(URL + "Update/PersonalSeekTeam Success " + result);
            res.status(200).send(result);
        }).catch( err => {
            globalRouter.logger.error(URL + "Update/PersonalSeekTeam Faield " + err);
            res.status(400).send(null);
        });
});

router.post('/Update/PersonalSeekTeam', async(req, res) => {
    var body = req.body;
    
    await models.PersonalSeekTeam.update(
        {
            Title : body.title,
            SeekingState : body.seekingState,
            SelfInfo : body.selfInfo,
            Category : body.category,
            SeekingFieldPart : body.seekingFieldPart,
            SeekingFieldSubPart : body.seekingFieldSubPart,
            AbilityContents : body.abilityContents,
            Education : body.education,
            Career : body.career,
            WorkFormFirst : body.workFormFirst,
            WorkFormSecond : body.workFormSecond,
            WorkDayOfWeek : body.workDayOfWeek,
            WorkTime : body.workTime,
            Welfare : body.welfalre,
            NeedWorkConditionContents : body.needWorkConditionContents,
            Location : body.location,
            SubLocation : body.subLocation,
        },
        {
            where : {
                id : body.id,
                UserID : body.userID,
            },
        }).then( result => {
            console.log(URL + "Update/PersonalSeekTeam Success " + result);
            res.status(200).send(result);
        }).catch( err => {
            globalRouter.logger.error(URL + "Update/PersonalSeekTeam Faield " + err);
            res.status(400).send(null);
        });
});

router.post('/Insert/TeamMemberRecruitLike', async (req, res) => {
    let body = req.body;
  
    globalRouter.CreateOrDestroy( models.TeamMemberRecruitLike,
        {
            UserID : body.userID,
            TargetID : body.targetID
        }
    ).then(result => {
      console.log(URL + 'Insert/TeamMemberRecruitLike CreateOrDestroy Success' + result);
      res.status(200).send(result);
    }).catch(err => {
      globalRouter.logger.error(URL + 'Insert/TeamMemberRecruitLike CreateOrDestroy Failed' + err);
      res.status(400).send(null);
    })
});

router.post('/Insert/PersonalSeekTeamLike', async (req, res) => {
    let body = req.body;
  
    globalRouter.CreateOrDestroy( models.PersonalSeekTeamLike,
        {
            UserID : body.userID,
            TargetID : body.targetID
        }
    ).then(result => {
      console.log(URL + 'Insert/PersonalSeekTeamLike CreateOrDestroy Success' + result);
      res.status(200).send(result);
    }).catch(err => {
      globalRouter.logger.error(URL + 'Insert/PersonalSeekTeamLike CreateOrDestroy Failed' + err);
      res.status(400).send(null);
    })
});

router.post('/Select/TeamMemberRecruitLike', async (req, res) => {
    let body = req.body;
  
    var likeList = await models.TeamMemberRecruitLike.findAll({where : {UserID : body.userID,}});
    res.status(200).send(likeList);
});

router.post('/Select/TeamMemberRecruitSaveList', async( req, res) => {
    let body = req.body;
  
    var likeList = await models.TeamMemberRecruitLike.findAll({where : {UserID : body.userID,}});

    var resData = [];
    var error = false;
    var errorText = '';
    for(var i = 0 ; i < likeList.length; ++i){
        var bcheck = false;
        await models.TeamMemberRecruit.findOne({
            id : likeList[i].id,
            IsShow : 1,
        }).then(result => {
            if(false == globalRouter.IsEmpty(result)){
                resData.push(result);
            }
        }).catch(err => {
            error = true;
            errorText = err;
            bcheck = true;
            return;
        })

        if(bcheck) break;
    }

    if(error){
        globalRouter.logger.error(URL + 'Select/TeamMemberRecruitLike findAll Failed' + errorText);
        res.status(400).send(null);
    }else{
        console.log(URL + 'Select/TeamMemberRecruitLike findAll Success');

        if(globalRouter.IsEmpty(resData))
            resData = null;

        res.status(200).send(resData);  
    }
})

router.post('/Select/PersonalSeekTeamLike', async (req, res) => {
    let body = req.body;
  
    var likeList = await models.PersonalSeekTeamLike.findAll({where : {UserID : body.userID,}});
    res.status(200).send(likeList);
});

router.post('/Select/PersonalSeekTeamSaveList', async (req, res) => {
    let body = req.body;
  
    var likeList = await models.PersonalSeekTeamLike.findAll({where : {UserID : body.userID,}});

    var resData = [];
    var error = false;
    var errorText = '';
    for(var i = 0 ; i < likeList.length; ++i){
        var bcheck = false;
        await models.PersonalSeekTeam.findOne({
            id : likeList[i].id,
            IsShow : 1,
        }).then(result => {
            if(false == globalRouter.IsEmpty(result)){
                resData.push(result);
            }
        }).catch(err => {
            error = true;
            errorText = err;
            bcheck = true;
            return;
        })

        if(bcheck) break;
    }

    if(error){
        globalRouter.logger.error(URL + 'Select/PersonalSeekTeamLike findAll Failed' + errorText);
        res.status(400).send(null);
    }else{
        console.log(URL + 'Select/PersonalSeekTeamLike findAll Success');

        if(globalRouter.IsEmpty(resData))
            resData = null;

        res.status(200).send(resData);
    }
});

router.post('/Select/Target/PersonalSeekTeam', async (req, res) => {
    let body = req.body;

    await models.InvitingPersonalSeekTeamUser.findOne({
        where : {
            TeamID : body.teamID,
            InviteID : body.inviteID,
            TargetIndex : body.id,
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Select/Target/TeamMemberRecruit findOne Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Target/TeamMemberRecruit findOne Failed' + err);
        res.status(400).send(null);
    })
})

router.post('/Select/InvitingPersonalSeekTeamUserByID', async(req, res) => {
    await models.InvitingPersonalSeekTeamUser.findOne({
        where : {
            id : req.body.id
        },
    }).then(result => {
        console.log(URL + 'Select/InvitingPersonalSeekTeamUserByID findOne Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/InvitingPersonalSeekTeamUserByID findOne Failed' + err);
        res.status(400).send(null);
    })
})

router.post('/Select/InvitingTeamMemberRecruitByID', async(req, res) => {
    await models.InvitingTeamMemberRecruitsUser.findOne({
        where : {
            id : req.body.id
        },
    }).then(result => {
        console.log(URL + 'Select/InvitingTeamMemberRecruitByID findOne Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/InvitingTeamMemberRecruitByID findOne Failed' + err);
        res.status(400).send(null);
    })
})

router.post('/Invite/PersonalSeekTeam', async (req, res) => {
    let body = req.body;

    await models.InvitingPersonalSeekTeamUser.create({
        TeamID: body.teamID,
        InviteID: body.inviteID,
        TargetIndex: body.id,
    }).then(result => {
        console.log(URL + 'Invite/PersonalSeekTeam Success' + result);
        client.hgetall(String(body.inviteID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
            
            var data = JSON.stringify({
                userID: body.userID,
                inviteID: body.inviteID,
                title: "인터뷰 요청",
                type: "INVITE_PERSONALSEEKTEAM",
                tableIndex: result.id,
                targetIndex: body.id,
                teamIndex: body.teamID,
                body: "팀 찾기에 인터뷰 요청을 받았습니다.",
                isSend: obj.isOnline,
                topic : 'PERSONAL_SEEKTEAM_INVITE',
            })

            if (fcmFuncRouter.SendFcmEvent(data)) {
                console.log(URL + 'Invite/PersonalSeekTeam fcm is true');
                res.status(200).send(true);
            }
            else {
                console.log(URL + 'Invite/PersonalSeekTeam fcm is false');
                res.status(400).send(null);
            }
        });
    }).catch(err => {
        globalRouter.logger.error(URL + "Invite/PersonalSeekTeam Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Response/PersonalSeekTeam', async (req, res) => {
    let body = req.body;
    
    client.hgetall(String(body.from), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var type = "INVITE_PERSONALSEEKTEAM_ACCEPT";
        var message = "팀 인터뷰를 수락하였습니다.";
        
        if(body.response == 2){
            type = "INVITE_PERSONALSEEKTEAM_REFUSE";
            message = "팀 인터뷰를 거절하였습니다.";
        }
        
        var data = JSON.stringify({
            userID : body.to,
            inviteID : body.from,
            title : "인터뷰 요청",
            type : type,
            tableIndex : body.tableIndex,
            targetIndex: body.targetIndex,
            teamIndex : body.teamIndex,
            body : message,
            isSend : obj.isOnline,
            topic : 'PERSONAL_SEEKTEAM_INVITE',
        })

        if(fcmFuncRouter.SendFcmEvent( data )){
            console.log(URL + 'Response/PersonalSeekTeam fcm is true');
        }
        else {
            console.log(URL + 'Response/PersonalSeekTeam fcm is false');
        }

         //거절
         if(body.response == 2) {
            await models.InvitingPersonalSeekTeamUser.destroy({
                where: {
                    id : body.tableIndex,
                }
            }).then( result => {
                console.log(URL + 'Response/PersonalSeekTeam Reject Success' + result);
                res.status(200).send(true);
            }).catch( err => {
                console.log("Response/PersonalSeekTeam Reject Failed" + err);
                res.status(400).send(null);
            })
            return;
        }else{
            await models.InvitingPersonalSeekTeamUser.update(
                {
                    Response: body.response   
                },
                {where:{id : body.tableIndex,},
            }).then(result => {
                console.log(URL + 'Response/PersonalSeekTeam update success' + result);
            }).catch(err => {
                globalRouter.logger.error(URL + 'Response/PersonalSeekTeam update failed' + err);
                res.status(400).send(null);
                return;
            });
        }
    
        var data = JSON.stringify({
            userID : body.to,
            roomName : body.roomName,
            type : 3,
            max : 30,
        });
        roomFuncRouter.insertRoomInfoAndUser(data).then(function (result){
            console.log('/Response/PersonalSeekTeam  success' + result);
            var subData = JSON.stringify({
                userID : body.from,
                roomName : body.roomName,
                type : 3,
                max : 30,
            });
            roomFuncRouter.insertRoomInfoAndUser(subData).then(function (result2){
                console.log(URL + 'Response/PersonalSeekTeam second success' + result2);
                res.status(200).send(true);
            }).catch(function (err2){
                globalRouter.logger.error(URL + 'Response/PersonalSeekTeam second failed' + err2 );
                res.status(400).send(null);    
            })
        }).catch(function (err) {
            globalRouter.logger.error(URL +'Response/PersonalSeekTeam failed' + err );
            res.status(400).send(null);
        });
    });
});

router.post('/Select/Target/TeamMemberRecruit', async (req, res) => {
    let body = req.body;

    await models.InvitingTeamMemberRecruitsUser.findOne({
        where : {
            UserID : body.userID,
            InviteID : body.inviteID,
            TargetIndex : body.id
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Select/Target/TeamMemberRecruit findOne Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Target/TeamMemberRecruit findOne Failed' + err);
        res.status(400).send(null);
    })
})

router.post('/Invite/TeamMemberRecruit', async ( req, res) => {
    let body = req.body;

    await models.InvitingTeamMemberRecruitsUser.create({
        UserID: body.userID,
        InviteID: body.inviteID,
        TargetIndex: body.id,
    }).then(result => {
        console.log(URL + 'Invite/TeamMemberRecruit Success' + result);
        client.hgetall(String(body.inviteID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
            
            var data = JSON.stringify({
                userID: body.userID,
                inviteID: body.inviteID,
                title: "인터뷰 요청",
                type: "INVITE_TEAMMEMBERRECRUIT",
                tableIndex: result.id,
                targetIndex: body.id,
                body: "팀 모집에 인터뷰 요청을 받았습니다.",
                isSend: obj.isOnline,
                topic : 'TEAM_MEMBER_RECRUIT_INVITE',
            })

            if (fcmFuncRouter.SendFcmEvent(data)) {
                console.log(URL + 'Invite/TeamMemberRecruit fcm is true');
                res.status(200).send(true);
            }
            else {
                console.log(URL + 'Invite/TeamMemberRecruit fcm is false');
                res.status(400).send(null);
            }
        });
    }).catch(err => {
        globalRouter.logger.error(URL + "Invite/TeamMemberRecruit Failed" + err);
        res.status(400).send(null);
    });
});

router.post('/Response/TeamMemberRecruit', async( req, res) => {
    let body = req.body;
    
    client.hgetall(String(body.from), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var type = "INVITE_TEAMMEMBERRECRUIT_ACCEPT";
        var message = "팀 인터뷰를 수락하였습니다.";
        
        if(body.response == 2){
            type = "INVITE_TEAMMEMBERRECRUIT_REFUSE";
            message = "팀 인터뷰를 거절하였습니다.";
        }
        
        var data = JSON.stringify({
            userID : body.to,
            inviteID : body.from,
            title : "인터뷰 요청",
            type : type,
            tableIndex : body.tableIndex,
            targetIndex : body.targetIndex,
            teamIndex : body.teamIndex,
            body : message,
            isSend : obj.isOnline,
            topic : 'TEAM_MEMBER_RECRUIT_INVITE',
        })

        if(fcmFuncRouter.SendFcmEvent( data )){
            console.log(URL + 'Response/TeamMemberRecruit fcm is true');
        }
        else {
            console.log(URL + 'Response/TeamMemberRecruit fcm is false');
        }

         //거절
         if(body.response == 2) {
            await models.InvitingTeamMemberRecruitsUser.destroy({
                where: {
                    id : body.tableIndex,
                }
            }).then( result => {
                console.log(URL + 'Response/TeamMemberRecruit Reject Success' + result);
                res.status(200).send(true);
            }).catch( err => {
                console.log("Response/TeamMemberRecruit Reject Failed" + err);
                res.status(400).send(null);
            })
            return;
        }else{
            await models.InvitingTeamMemberRecruitsUser.update(
                {
                    Response: body.response   
                },
                {where:{id : body.tableIndex,},
            }).then(result => {
                console.log(URL + 'Response/TeamMemberRecruit update success' + result);
            }).catch(err => {
                globalRouter.logger.error(URL + 'Response/TeamMemberRecruit update failed' + err);
                res.status(400).send(null);
                return;
            });
        }
    
        var data = JSON.stringify({
            userID : body.to,
            roomName : body.roomName,
            type : 4,
            max : 30,
        });
        roomFuncRouter.insertRoomInfoAndUser(data).then(function (result){
            console.log('/Response/TeamMemberRecruit  success' + result);
            var subData = JSON.stringify({
                userID : body.from,
                roomName : body.roomName,
                type : 4,
                max : 30,
            });
            roomFuncRouter.insertRoomInfoAndUser(subData).then(function (result2){
                console.log(URL + 'Response/TeamMemberRecruit second success' + result2);
                res.status(200).send(true);
            }).catch(function (err2){
                globalRouter.logger.error(URL + 'Response/TeamMemberRecruit second failed' + err2 );
                res.status(400).send(null);    
            })
        }).catch(function (err) {
            globalRouter.logger.error(URL +'Response/TeamMemberRecruit failed' + err );
            res.status(400).send(null);
        });
    });
});

router.post('/Filter/TeamMemberRecruit', async(req, res) => {
    let recruitPart = req.body.recruitPart;
    let servicePart = req.body.servicePart;
    let location = req.body.location;
    let recruitCheckAll = req.body.recruitCheckAll;
    let serviceCheckAll = req.body.serviceCheckAll;
    let locationCheckAll = req.body.locationCheckAll;
    let OrderRule = req.body.orderrule;
    let isRecommend = req.body.isRecommend;

    var order = (OrderRule == 0 || OrderRule == 2) ? 'createdAt' : 'updatedAt';
    var rule = {};

    if((OrderRule == 2) || (isRecommend == true)) {
        rule = {
            [Op.or] : [
                {
                    recruitPeriodEnd : {
                        [Op.eq] : '상시모집'
                    }
                },
                {
                    recruitPeriodEnd : {
                        [Op.gte] : moment().format('YYYYMMDD')
                    }
                }
            ]
        }
    }

    if(recruitCheckAll == 0){
        rule.RecruitField = {
            [Op.regexp] : '^' + recruitPart
        }
    }
    
    if(serviceCheckAll == 0) {
        rule.ServicePart = {
            [Op.regexp] : '^' + servicePart
        }
    }

    if(locationCheckAll == 0) {
        rule.Location = {
            [Op.regexp] : '^' + location
        }
    }

    rule.IsShow = 1

    await models.TeamMemberRecruit.findAll({
        limit : 30,
        order: [[order, 'DESC']],
        where : rule,
    }).then(result => {
        console.log(URL + 'Filter/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Filter/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Filter/Offset/TeamMemberRecruit', async(req, res) => {
    let recruitPart = req.body.recruitPart;
    let servicePart = req.body.servicePart;
    let location = req.body.location;
    let recruitCheckAll = req.body.recruitCheckAll;
    let serviceCheckAll = req.body.serviceCheckAll;
    let locationCheckAll = req.body.locationCheckAll;
    let OrderRule = req.body.orderrule;

    var order = (OrderRule == 0 || OrderRule == 2) ? 'createdAt' : 'updatedAt';
    var rule = {};

    if(OrderRule == 2) {
        rule = {
            [Op.or] : [
                {
                    recruitPeriodEnd : {
                        [Op.eq] : '상시모집'
                    }
                },
                {
                    recruitPeriodEnd : {
                        [Op.gte] : moment().format('YYYYMMDD')
                    }
                }
            ]
        }
    }

    if(recruitCheckAll == 0){
        rule.RecruitField = {
            [Op.regexp] : '^' + recruitPart
        }
    }
    
    if(serviceCheckAll == 0) {
        rule.ServicePart = {
            [Op.regexp] : '^' + servicePart
        }
    }

    if(locationCheckAll == 0) {
        rule.Location = {
            [Op.regexp] : '^' + location
        }
    }

    rule.IsShow = 1

    await models.TeamMemberRecruit.findAll({
        limit : 30,
        offset : req.body.index * 1,
        order: [[order, 'DESC']],
        where : rule,
    }).then(result => {
        console.log(URL + 'Filter/Offset/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Filter/Offset/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Filter/PersonalSeekTeam', async(req, res) => {
    let seekingFieldPart = req.body.seekingFieldPart;
    let education = req.body.education;
    let workform = req.body.workForm;
    let location = req.body.location;
    let seekingFieldPartCheckAll = req.body.seekingFieldPartCheckAll;
    let educationCheckAll = req.body.educationCheckAll;
    let workCheckAll = req.body.workFormCheckAll;
    let locationCheckAll = req.body.locationCheckAll;
    let OrderRule = req.body.orderrule;
    let isRecommend = req.body.isRecommend;

    var order = (OrderRule == 0 || OrderRule == 2) ? 'createdAt' : 'updatedAt';
    var rule = {};

    if(workCheckAll == 0){
        rule = {
            [Op.or] : [
                {
                    WorkFormFirst : {
                        [Op.regexp] : '^' + workform
                    }
                },
                {
                    WorkFormSecond : {
                        [Op.regexp] : '^' + workform
                    }
                }
            ]
        }
    }

    if(seekingFieldPartCheckAll == 0){
        rule.SeekingFieldPart = {
            [Op.regexp] : '^' + seekingFieldPart
        }
    }
    
    if(educationCheckAll == 0) {
        rule.Education = {
            [Op.regexp] : '^' + education
        }
    }

    if(locationCheckAll == 0) {
        rule.Location = {
            [Op.regexp] : '^' + location
        }
    }

    if((OrderRule == 2) || (isRecommend == true)) {
        rule.SeekingState = 1
    }

    rule.IsShow = 1

    await models.PersonalSeekTeam.findAll({
        limit : 30,
        order: [[order, 'DESC']],
        where : rule,
    }).then(result => {
        console.log(URL + 'Filter/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Filter/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Filter/Offset/PersonalSeekTeam', async(req, res) => {
    let seekingFieldPart = req.body.seekingFieldPart;
    let education = req.body.education;
    let workform = req.body.workForm;
    let location = req.body.location;
    let seekingFieldPartCheckAll = req.body.seekingFieldPartCheckAll;
    let educationCheckAll = req.body.educationCheckAll;
    let workCheckAll = req.body.workFormCheckAll;
    let locationCheckAll = req.body.locationCheckAll;
    let OrderRule = req.body.orderrule;
    
    var order = (OrderRule == 0 || OrderRule == 2) ? 'createdAt' : 'updatedAt';
    var rule = {};

    if(workCheckAll == 0){
        rule = {
            [Op.or] : [
                {
                    WorkFormFirst : {
                        [Op.regexp] : '^' + workform
                    }
                },
                {
                    WorkFormSecond : {
                        [Op.regexp] : '^' + workform
                    }
                }
            ]
        }
    }

    if(seekingFieldPartCheckAll == 0){
        rule.SeekingFieldPart = {
            [Op.regexp] : '^' + seekingFieldPart
        }
    }
    
    if(educationCheckAll == 0) {
        rule.Education = {
            [Op.regexp] : '^' + education
        }
    }

    if(locationCheckAll == 0) {
        rule.Location = {
            [Op.regexp] : '^' + location
        }
    }

    if(OrderRule == 2) {
        rule.SeekingState = 1
    }

    rule.IsShow = 1

    await models.PersonalSeekTeam.findAll({
        limit : 30,
        offset : req.body.index * 1,
        order: [[order, 'DESC']],
        where : rule,
    }).then(result => {
        console.log(URL + 'Filter/Offset/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Filter/Offset/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Search/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        limit : 30,
        order : [
            ['updatedAt', 'DESC']
        ],
        where : {
            IsShow : 1,
            [Op.or] : [
                {
                    Title : {
                        [Op.like]: "%" + req.body.words + "%"
                    },
                },
                {
                    RecruitSubField : {
                        [Op.like]: "%" + req.body.words + "%"
                    }
                }
            ]
        },
    }).then(result => {
        console.log(URL + 'Search/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Search/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Search/Offset/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        limit : 30,
        offset : req.body.index * 1,
        order : [
            ['updatedAt', 'DESC']
        ],
        where : {
            IsShow : 1,
            [Op.or] : [
                {
                    Title : {
                        [Op.like]: "%" + req.body.words + "%"
                    },
                },
                {
                    RecruitSubField : {
                        [Op.like]: "%" + req.body.words + "%"
                    }
                }
            ]
        },
    }).then(result => {
        console.log(URL + 'Search/Offset/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Search/Offset/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Search/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        limit : 30,
        order : [
            ['updatedAt', 'DESC']
        ],
        where : {
            IsShow : 1,
            [Op.or] : [
                {
                    Title : {
                        [Op.like]: "%" + req.body.words + "%"
                    },
                },
                {
                    SeekingFieldSubPart : {
                        [Op.like]: "%" + req.body.words + "%"
                    }
                }
            ]
        },
    }).then(result => {
        console.log(URL + 'Search/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Search/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
});

router.post('/Search/Offset/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        limit : 30,
        offset : req.body.index * 1,
        order : [
            ['updatedAt', 'DESC']
        ],
        where : {
            IsShow : 1,
            [Op.or] : [
                {
                    Title : {
                        [Op.like]: "%" + req.body.words + "%"
                    },
                },
                {
                    SeekingFieldSubPart : {
                        [Op.like]: "%" + req.body.words + "%"
                    }
                }
            ]
        },
    }).then(result => {
        console.log(URL + 'Search/Offset/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Search/Offset/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
});

//지원자 보기
router.post('/Select/Proposed/TeamMemberRecruit', async(req, res) => {
    await models.InvitingTeamMemberRecruitsUser.findAll({
        where : {
            InviteID : req.body.userID,
            TargetIndex : req.body.id,
        }
    }).then(result => {
        console.log(URL + 'Select/Proposed/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Proposed/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
})

//나에게 제안한 팀 보기
router.post('/Select/Applicant/PersonalSeekTeam', async(req, res) => {
    await models.InvitingPersonalSeekTeamUser.findAll({
        where : {
            InviteID : req.body.userID,
            TargetIndex : req.body.id,
        }
    }).then(result => {
        console.log(URL + 'Select/Proposed/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/Proposed/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
})

//내가 지원한 팀 보기
router.post('/Select/Volunteer/TeamList', async(req, res) => {
    var invitingTeamRecruitList = await models.InvitingTeamMemberRecruitsUser.findAll(
        {where : {UserID : req.body.userID,Response : 0}
    });

    //없으면
    if(globalRouter.IsEmpty(invitingTeamRecruitList)){
        console.log(URL + 'Select/Volunteer/TeamList invitingTeamRecruitList is empty');
        res.status(200).send(null);
    }else{
        let resData = [];

        for(var i = 0 ; i < invitingTeamRecruitList.length;++i){
            await models.TeamMemberRecruit.findOne({
                where : {
                    id : invitingTeamRecruitList[i].TargetIndex,
                }
            }).then(async result => {
                console.log(URL + 'Select/Volunteer/TeamList Success');
                
                await models.team.findOne({
                    where : {
                        id : result.TeamID
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
                }).then(result2 => {
                    if(globalRouter.IsEmpty(result2)){
                        console.log(URL + 'Select/Volunteer/TeamList team is empty');
                    }else{
                        resData.push(result2);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + 'Select/Proposed/TeamMemberRecruit team Failed ' + err);
                })
            }).catch(err => {
                globalRouter.logger.error(URL + 'Select/Proposed/TeamMemberRecruit Failed ' + err);
            })
        }

        if(globalRouter.IsEmpty(resData))
            resData = null;

        res.status(200).send(resData);
    }
});

//내가 제안한 구직자 보기
router.post('/Select/Suggest/PersonalList', async(req, res) => {
    var leaderList = await models.team.findAll({where :{LeaderID : req.body.userID} });

    //없으면
    if(globalRouter.IsEmpty(leaderList)){
        console.log(URL + 'Select/Suggest/PersonalList leaderList is empty');
        res.status(200).send(null);
    }else{
        let resData = [];

        for(var i = 0 ; i < leaderList.length; ++i){
            await models.InvitingPersonalSeekTeamUser.findAll({
                where : {
                    TeamID : leaderList[i].id,
                }
            }).then(async invitingResult => {
                console.log(URL + '/Select/Suggest/PersonalList InvitingPersonalSeekTeamUser Success');

                for(var j = 0 ; j < invitingResult.length; ++j){
                    await models.user.findAll({
                        where : {
                            UserID : invitingResult[j].InviteID
                        },
                        include: [
                            {
                              model : models.PersonalPhoto,
                              required: true , 
                              limit: 99,
                              order : [
                                ['Index', 'ASC']
                              ],
                            },
                            {
                              model: models.profileuniv,
                              required: false
                            },
                            {
                              model: models.profilecareer,
                              required: false
                            },
                            {
                              model: models.profilelicense,
                              required: false
                            },
                            {
                              model: models.profilewin,
                              required: false
                            },
                            {
                              model : models.PersonalLinks,
                              required: true,
                              limit: 99
                            }
                          ]
                    }).then(result => {
                        console.log(URL + '/Select/Suggest/PersonalList invitingResult Success');
                        resData.push(result);
                    }).catch(err => {
                        globalRouter.logger.error(URL + 'Select/Suggest/PersonalList Failed ' + err);         
                    }) 
                }
            }).catch(err => {
                globalRouter.logger.error(URL + 'Select/Suggest/PersonalList Failed ' + err);
            })
        }

        if(globalRouter.IsEmpty(resData))
            resData = null;

        res.status(200).send(resData);
    }
});

//저장한 공고 팀 찾기
router.post('/Select/Save/TeamMemberRecruit', async(req, res) => {
    var likeList = await models.TeamMemberRecruitLike.findAll({where : {UserID : req.body.userID,}});

    let resData = [];
    for(var i = 0 ; i < likeList.length; ++i){
        await models.TeamMemberRecruit.findOne({
            where : {
                id : likeList[i].TargetID
            }
        }).then(result => {
            if(globalRouter.IsEmpty(result)){
                console.log(URL + 'Select/Save/TeamMemberRecruit is empty');
            }else{
                if(result.IsShow == 1){
                    resData.push(result);
                }
            }
        }).catch(err => {
            globalRouter.logger.error(URL + 'Select/Save/TeamMemberRecruit is failed');
            res.status(400).send(null);
        })
    }

    if(globalRouter.IsEmpty(resData))
        resData = null;

    res.status(200).send(resData);
})

//저장한 공고 팀원 찾기
router.post('/Select/Save/PersonalSeekTeam', async(req, res) => {
    var likeList = await models.PersonalSeekTeamLike.findAll({where : {UserID : req.body.userID,}});

    var resData = [];
    for(var i = 0 ; i < likeList.length; ++i){
        await models.PersonalSeekTeam.findOne({
            where : {
                id : likeList[i].TargetID
            }
        }).then(result => {
            if(globalRouter.IsEmpty(result)){
                console.log(URL + 'Select/Save/PersonalSeekTeam is empty');
            }else{
                if(result.IsShow == 1){
                    resData.push(result);
                }
            }
        }).catch(err => {
            globalRouter.logger.error(URL + 'Select/Save/PersonalSeekTeam is failed' + err);
            res.status(400).send(null);
        })
    }

    if(globalRouter.IsEmpty(resData))
        resData = null;

    res.status(200).send(resData);
})


router.post('/Delete/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.update(
        {
            IsShow : 0
        },
        {
            where : {
                id : req.body.id
            }
        }
    ).then(async result => {
        console.log(URL + 'Delete/TeamMemberRecruit Success' + result);

        //채팅방 뒤지면서 각각의 user들에게 삭제된 이벤트 보내야함
        await models.RoomInfo.findAll({
            where : {
                RoomName : {
                    [Op.like] : req.body.roomName + '%'
                }
            }
        }).then(async roomInfoResult => {
            //데이터 비어있으면 skip
            if(globalRouter.IsEmpty(roomInfoResult)) return;
            else{

                for(var i = 0 ; i < roomInfoResult.length; ++i){
                    await models.RoomUser.findAll({
                        where : {
                            RoomID : roomInfoResult[i].RoomID
                        }
                    }).then(async roomUserResult => {
                        console.log(URL + 'Delete/TeamMemberRecruit RoomUser findAll Success' + roomUserResult);

                        for(var j = 0 ; j < roomUserResult.length; ++j){
                            //자기자신은 skip
                            if(roomUserResult[j].UserID == req.body.userID) continue;
                            else{
                                client.hgetall(String(roomUserResult[j].UserID), async function(err, obj) {
                                    if(err) throw err;
                                    if(obj == null) return;
            
                                    var data = JSON.stringify({
                                        userID : req.body.userID,
                                        inviteID : roomUserResult[j].UserID,
                                        title : "인터뷰 종료",
                                        type : "DELETE_TEAMMEMBERRECRUIT_POST",
                                        targetIndex : req.body.id,
                                        body : req.body.teamName + " 이 팀 모집을 중단하였습니다.",
                                        isSend : obj.isOnline,
                                        topic : 'DELETE_TEAMMEMBERRECRUIT_POST',
                                    })
                            
                                    if(fcmFuncRouter.SendFcmEvent( data )){
                                        console.log(URL + 'Delete/TeamMemberRecruit fcm is true');
                                    }
                                    else {
                                        console.log(URL + 'Delete/TeamMemberRecruit fcm is false');
                                    }
                                });
    
                                //초대장 삭제
                                await models.InvitingTeamMemberRecruitsUser.destroy({
                                    where : {
                                        TargetIndex : req.body.id,
                                        InviteID : roomUserResult[j].UserID,
                                        Response : 1
                                    }
                                }).then(InvitingPersonalSeekTeamUserResult => {
                                    console.log(URL + 'Delete/PersonalSeekTeam InvitingPersonalSeekTeamUserResult destroy success');
                                }).catch(err => {
                                    console.log(URL + 'Delete/PersonalSeekTeam InvitingPersonalSeekTeamUserResult destroy failed' + err);
                                })
                            }
                        }
                    }).catch(err => {
                        console.log(URL + 'Delete/TeamMemberRecruit RoomUser findAll Failed' + err);
                    })
                }

                //채팅방 나가기
                var data = JSON.stringify({
                    roomName: req.body.roomName,
                });

                roomFuncRouter.destroyRoom(data).then(function (result) {
                    console.log('destroy room success');
                });
            }
        }).catch(err => {
            console.log(URL + 'Delete/TeamMemberRecruit RoomInfo findOne Failed' + err);
        })

        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Delete/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
})

router.post('/Delete/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.update(
        {
            IsShow : 0
        },
        {
            where : {
                id : req.body.id
            }
        }
    ).then(async result => {
        console.log(URL + 'Delete/PersonalSeekTeam Success' + result);

        //채팅방 뒤지면서 각각의 user들에게 삭제된 이벤트 보내야함
        await models.RoomInfo.findAll({
            where : {
                RoomName : {
                    [Op.like] : req.body.roomName + '%'
                }
            }
        }).then(async roomInfoResult => {
            //데이터 비어있으면 skip
            if(globalRouter.IsEmpty(roomInfoResult)) return;
            else{

                for(var i = 0 ; i < roomInfoResult.length; ++i){
                    await models.RoomUser.findAll({
                        where : {
                            RoomID : roomInfoResult[i].RoomID
                        }
                    }).then(async roomUserResult => {
                        console.log(URL + 'Delete/PersonalSeekTeam RoomUser findAll Success' + roomUserResult);

                        for(var j = 0 ; j < roomUserResult.length; ++j){
                            //자기자신은 skip
                            if(roomUserResult[j].UserID == req.body.userID) continue;
                            else {
                                client.hgetall(String(roomUserResult[j].UserID), async function(err, obj) {
                                    if(err) throw err;
                                    if(obj == null) return;
            
                                    var data = JSON.stringify({
                                        userID : req.body.userID,
                                        inviteID : roomUserResult[j].UserID,
                                        title : "인터뷰 종료",
                                        type : "DELETE_PERSONALSEEKTEAM_POST",
                                        targetIndex : req.body.id,
                                        body : req.body.userName + " 이 팀 찾기를 중단하였습니다.",
                                        isSend : obj.isOnline,
                                        topic : 'DELETE_PERSONALSEEKTEAM_POST',
                                    })
                            
                                    if(fcmFuncRouter.SendFcmEvent( data )){
                                        console.log(URL + 'Delete/PersonalSeekTeam fcm is true');
                                    }
                                    else {
                                        console.log(URL + 'Delete/PersonalSeekTeam fcm is false');
                                    }
                                });
    
                                //초대장 삭제
                                await models.InvitingPersonalSeekTeamUser.destroy({
                                    where : {
                                        TargetIndex : req.body.id,
                                        InviteID : roomUserResult[j].UserID,
                                        Response : 1
                                    }
                                }).then(InvitingPersonalSeekTeamUserResult => {
                                    console.log(URL + 'Delete/PersonalSeekTeam InvitingPersonalSeekTeamUserResult destroy success');
                                }).catch(err => {
                                    console.log(URL + 'Delete/PersonalSeekTeam InvitingPersonalSeekTeamUserResult destroy failed' + err);
                                })
                            }
                        }
                    }).catch(err => {
                        console.log(URL + 'Delete/PersonalSeekTeam RoomUser findAll Failed' + err);
                    })
                }

                //채팅방 나가기
                var data = JSON.stringify({
                    roomName: req.body.roomName,
                });

                roomFuncRouter.destroyRoom(data).then(function (result) {
                    console.log('destroy room success');
                });
            }
        }).catch(err => {
            console.log(URL + 'Delete/PersonalSeekTeam RoomInfo findOne Failed' + err);
        })

        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Delete/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
})

router.post('/PullUpPost/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.update(
        {
            createdAt : moment()
        },
        {
            where : {
                id : req.body.id
            }
        }
    ).then(result => {
        console.log(URL + 'PullUpPost/TeamMemberRecruit Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'PullUpPost/TeamMemberRecruit Failed ' + err);
        res.status(400).send(null);
    });
})

router.post('/PullUpPost/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.update(
        {
            createdAt : moment()
        },
        {
            where : {
                id : req.body.id
            }
        }
    ).then(result => {
        console.log(URL + 'PullUpPost/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'PullUpPost/PersonalSeekTeam Failed ' + err);
        res.status(400).send(null);
    });
})

module.exports = router;