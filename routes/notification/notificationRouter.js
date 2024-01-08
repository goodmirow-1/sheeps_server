const router = require('express').Router(),
    globalRouter = require('../global'),
    models = require('../../models');

var URL = '/Notification/';

router.post('/UnSendSelect', async (req, res) => {
    let data = req.body;

    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            isSend : 0
        }    
    }).then(result => {

        let value = {
            isSend : 1,
        }

        for(let i = 0 ; i < result.length; ++i){
            result[i].update(value).then(result2 => {
                console.log(URL + "UnSendSelect update Success" + result2);
            })
        }

        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + "UnSendSelect error" + err);
        res.status(400).send(null);
    });
});

router.post('/HandLoginSelect', async (req, res) => {
    let data = req.body;
    var resData = [];

    //개인용 초대 찾기
    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            Type: "INVITE"
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(async result => {
        if(false == globalRouter.IsEmpty(result)){
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(URL + "HandLoginSelect INVITE update Success" + result2);
                })

                await models.InvitingRoomUser.findOne({
                    where: {
                        id : result[i].TableIndex,
                        Response : 0
                    }
                }).then(result2 => {
                    if(false == globalRouter.IsEmpty(result2)){
                        resData.push(result[i]);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + "HandLoginSelect INVITE error" + err);
                    res.status(400).send(false);
                })
            }
        }
    }).catch(err => {
        globalRouter.logger.error(URL + "HandLoginSelect INVITE error" + err);
        res.status(400).send(null);
    });

    //팀용 초대 찾기 팀의 경우 TEAM_INVITE
    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            Type: "TEAM_INVITE"
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(async result => {
        if(false == globalRouter.IsEmpty(result)){
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(URL + "handLoginSelect TEAM_INVITE update Success" + result2);
                })
    
                await models.InvitingTeamUsers.findOne({
                    where: {
                        id : result[i].TableIndex,
                        Response : 0
                    }
                }).then(result2 => {
                    if(false == globalRouter.IsEmpty(result2)){
                        resData.push(result[i]);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + "HandLoginSelect TEAM_INVITE error" + err);
                    res.status(400).send(null);
                })
            }
        }
    }).catch(err => {
        globalRouter.logger.error(URL + "HandLoginSelect TEAM_INVITE error" + err);
        res.status(400).send(null);
    });

    //개인용 초대 찾기
    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            Type: "TEAM_REQUEST"
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(async result => {
        if(false == globalRouter.IsEmpty(result)){
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(URL + "HandLoginSelect TEAM_REQUEST update Success" + result2);
                })

                await models.InvitingTeamUsers.findOne({
                    where: {
                        id : result[i].TableIndex,
                        Response : 0
                    }
                }).then(result2 => {
                    if(false == globalRouter.IsEmpty(result2)){
                        resData.push(result[i]);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + "HandLoginSelect TEAM_REQUEST error" + err);
                    res.status(400).send(null);
                })
            }
        }
    }).catch(err => {
        globalRouter.logger.error("UnSendSelect TEAM_REQUEST error" + err);
        res.status(400).send(null);
    });

    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            Type: "INVITE_TEAMMEMBERRECRUIT"
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(async result => {
        if(false == globalRouter.IsEmpty(result)){
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(URL + "HandLoginSelect INVITE_TEAMMEMBERRECRUIT update Success" + result2);
                })


                await models.InvitingTeamMemberRecruitsUser.findAll({
                    where: {
                        id : result[i].TableIndex,
                        Response : 0
                    }
                }).then(result2 => {
                    if(false == globalRouter.IsEmpty(result2)){
                        resData.push(result[i]);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + "HandLoginSelect INVITE_TEAMMEMBERRECRUIT error" + err);
                    res.status(400).send(null);
                })
            }
        }
    }).catch(err => {
        globalRouter.logger.error("UnSendSelect INVITE_TEAMMEMBERRECRUIT error" + err);
        res.status(400).send(null);
    });

    await models.NotificationList.findAll({
        where : {
            TargetID : data.userID,
            Type: "INVITE_PERSONALSEEKTEAM"
        },
        order: [
            ['id', 'DESC']
        ],
    }).then(async result => {
        if(false == globalRouter.IsEmpty(result)){
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(URL + "HandLoginSelect INVITE_PERSONALSEEKTEAM update Success" + result2);
                })

                await models.InvitingPersonalSeekTeamUser.findAll({
                    where: {
                        id : result[i].TableIndex,
                        Response : 0
                    }
                }).then(result2 => {
                    if(false == globalRouter.IsEmpty(result2)){
                        resData.push(result[i]);
                    }
                }).catch(err => {
                    globalRouter.logger.error(URL + " INVITE_PERSONALSEEKTEAM TEAM_REQUEST error" + err);
                    res.status(400).send(null);
                })
            }
        }
        
        if(globalRouter.IsEmpty(resData))
            resData = null;

        res.status(200).send(resData);
    }).catch(err => {
        globalRouter.logger.error("UnSendSelect TEAM_REQUEST error" + err);
        res.status(400).send(null);
    });
});

module.exports = router;