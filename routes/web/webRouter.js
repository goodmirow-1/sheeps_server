const router = require('express').Router(),
        models = require('../../models'),
        moment = require('moment'),
        globalRouter = require('../global');

const fcmFuncRouter = require('../fcm/fcmFuncRouter');
const { Op } = require('sequelize');
const client = globalRouter.client;
        
let URL = '/Web';

router.get('/Select/Personal/SummaryProfile', async(req, res) => {
    await models.user.findAll({
        attributes: [ 
          'UserID', 'ID','Name','Part','SubPart','PhoneNumber','Location','SubLocation'
        ],
    }).then(result => {
        console.log(URL + '/Select/Personal/SummaryProfile Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/SummaryProfile Failed ' + err);
        res.json(null);
    })
});

router.post('/Select/Personal/DetailProfile', async(req, res) => {
    await models.user.findOne({
        where : {
            UserID : req.body.userID
        },
        include : [
            {
                model : models.PersonalPhoto,
                required: true , 
                limit: 99,
                order : [
                  ['Index', 'ASC']
                ],
              },
              { 
                model : models.PersonalBadgeList , 
                required: true , 
                limit: 99
              },
              {
                model : models.profilecareer, 
                required: true , 
                limit: 99
              },
              {
                model : models.profilelicense , 
                required: true , 
                limit: 99
              },
              {
                model : models.profileuniv , 
                required: true , 
                limit: 99
              },
              {
                model : models.profilewin, 
                required: true , 
                limit: 99
              },
              {
                model : models.PersonalLinks,
                required: true,
                limit: 99
              },
          ]
    }).then(result => {
        console.log(URL + '/Select/Personal/DetailProfile Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/DetailProfile Failed' + err);
        res.json(null);
    });
});

router.get('/Select/Personal/AuthManagement', async(req, res) => {
    var data = [];

    //대학교 인증
    var profileunivs = await models.profileuniv.findAll({
        where : {
            PfUnivAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(profileunivs) == false){
        for(let i = 0; i < profileunivs.length; ++i){
            var temp = {
               userID : profileunivs[i].PfUUserID,
               id : profileunivs[i].PfUnivID,
               type : 0,
            };
    
            data.push(temp);
        }
    }

    // //대학원 인증
    // var profilegraduates = await models.profilegraduate.findAll({
    //     where : {
    //         PfGraduateAuth : 2
    //     },
    //     order : [
    //         ['updatedAt', 'DESC']
    //       ],
    // });

    // if(globalRouter.IsEmpty(profilegraduates) == false){
    //     for(let i = 0; i < profilegraduates.length; ++i) {
    //         var temp = {
    //             userID : profilegraduates[i].PfGUserID,
    //             id : profilegraduates[i].PfGraduateID,
    //             type : 1
    //         };
    
    //         data.push(temp);
    //     }
    // }

    //경력 인증
    var profilecareers = await models.profilecareer.findAll({
        where : {
            PfCareerAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(profilecareers) == false){
        for(let i = 0; i < profilecareers.length; ++i){
            var temp = {
               userID : profilecareers[i].PfCUserID,
               id : profilecareers[i].PfCareerID,
               type : 2,
            };
    
            data.push(temp);
        }
    }

    //자격증 인증
    var profilelicenses = await models.profilelicense.findAll({
        where : {
            PfLicenseAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(profilelicenses) == false){
        for(let i = 0; i < profilelicenses.length; ++i){
            var temp = {
               userID : profilelicenses[i].PfLUserID,
               id : profilelicenses[i].PfLicenseID,
               type : 3,
            };
    
            data.push(temp);
        }
    }

    //수상경력 인증
    var profilewins = await models.profilewin.findAll({
        where : {
            PfWinAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(profilewins) == false){
        for(let i = 0; i < profilewins.length; ++i){
            var temp = {
               userID : profilewins[i].PfWUserID,
               id : profilewins[i].PfWinID,
               type : 4,
            };
    
            data.push(temp);
        }
    }

    res.json(data);
});

router.post('/Select/Personal/CertificationSuccessList', async(req, res) => {
    var data = [];

    //대학교 인증
    var profileunivs = await models.profileuniv.findAll({
        where : {
            PFUUserID : req.body.userID,
            PfUnivAuth : 1
        }
    });

    if(globalRouter.IsEmpty(profileunivs) == false){
        for(let i = 0; i < profileunivs.length; ++i){
            var temp = {
               userID : profileunivs[i].PfUUserID,
               id : profileunivs[i].PfUnivID,
               type : 0,
            };
    
            data.push(temp);
        }
    }

    // //대학원 인증
    // var profilegraduates = await models.profilegraduate.findAll({
    //     where : {
    //         PfGUserID : req.body.userID,
    //         PfGraduateAuth : 1
    //     }
    // });

    // if(globalRouter.IsEmpty(profilegraduates) == false){
    //     for(let i = 0; i < profilegraduates.length; ++i) {
    //         var temp = {
    //             userID : profilegraduates[i].PfGUserID,
    //             id : profilegraduates[i].PfGraduateID,
    //             type : 1
    //         };
    
    //         data.push(temp);
    //     }
    // }

    //경력 인증
    var profilecareers = await models.profilecareer.findAll({
        where : {
            PfCUserID : req.body.userID,
            PfCareerAuth : 1
        }
    });

    if(globalRouter.IsEmpty(profilecareers) == false){
        for(let i = 0; i < profilecareers.length; ++i){
            var temp = {
               userID : profilecareers[i].PfCUserID,
               id : profilecareers[i].PfCareerID,
               contents : profilecareers[i].PfCareerContents,
               type : 2,
            };
    
            data.push(temp);
        }
    }

    //자격증 인증
    var profilelicenses = await models.profilelicense.findAll({
        where : {
            PfLUserID : req.body.userID,
            PfLicenseAuth : 1
        }
    });

    if(globalRouter.IsEmpty(profilelicenses) == false){
        for(let i = 0; i < profilelicenses.length; ++i){
            var temp = {
               userID : profilelicenses[i].PfLUserID,
               id : profilelicenses[i].PfLicenseID,
               type : 3,
            };
    
            data.push(temp);
        }
    }

    //수상경력 인증
    var profilewins = await models.profilewin.findAll({
        where : {
            PfWUserID: req.body.userID,
            PfWinAuth : 1
        }
    });

    if(globalRouter.IsEmpty(profilewins) == false){
        for(let i = 0; i < profilewins.length; ++i){
            var temp = {
               userID : profilewins[i].PfWUserID,
               id : profilewins[i].PfWinID,
               type : 4,
            };
    
            data.push(temp);
        }
    }

    res.json(data);
})

router.post('/Select/Personal/BadgeList', async(req, res) => {
    await models.PersonalBadgeList.findAll({
        where : {
            UserID :    req.body.userID
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/BadgeList Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/BadgeList Failed' + err);
        res.json(null);
    })
})

router.post('/Select/Personal/Univ', async(req, res) => {
    await models.profileuniv.findOne({
        where : {
            PfUnivID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/Univ Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/Univ Failed ' + err);
        res.json(null);
    })
})

router.post('/Update/Personal/Univ', async(req, res) => {

    await models.profileuniv.update(
        {
            PfUnivAuth : req.body.res
        }
        , { where: { PfUnivID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Personal/Univ Success ' + result);

        var win = await models.profileuniv.findOne({
            where : {
                PfUnivID: req.body.id
            }
        })

        client.hgetall(String(win.PfUnivID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : win.PfUUserID,
                title : "개인 프로필 인증",
                type : "PERSONAL_UNIV_AUTH_UPDATE",
                tableIndex : req.body.id,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "PERSONAL_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Personal/Univ Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Personal/Graduate', async(req, res) => {
    await models.profilegraduate.findOne({
        where : {
            PfGraduateID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/Graduate Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/Graduate Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Personal/Graduate', async(req, res) => {
    await models.profilegraduate.update(
        {
            PfGraduateAuth : req.body.res
        }
        , { where: { PfGraduateID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Personal/Graduate Success ' + result);
        
        var graduate = await models.profilegraduate.findOne({
            where : {
                PfGraduateID: req.body.id
            }
        })

        client.hgetall(String(graduate.PfGraduateID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : graduate.PfGUserID,
                title : "개인 프로필 인증",
                type : "PERSONAL_GRADUATE_AUTH_UPDATE",
                tableIndex : req.body.id,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "PERSONAL_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Personal/Graduate Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Personal/Career', async(req, res) => {
    await models.profilecareer.findOne({
        where : {
            PfCareerID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/Career Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/Career Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Personal/Career', async(req, res) => {
    await models.profilecareer.update(
        {
            PfCareerAuth : req.body.res
        }
        , { where: { PfCareerID: req.body.id} }
    ).then(async result => {

        console.log(URL + '/Update/Personal/Career Success ' + result);

        var career = await models.profilecareer.findOne({
            where : {
                PfCareerID: req.body.id
            }
        })
        
        client.hgetall(String(career.PfCUserID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : career.PfCUserID,
                title : "개인 프로필 인증",
                type : "PERSONAL_CAREER_AUTH_UPDATE",
                tableIndex : req.body.id,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "PERSONAL_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Personal/Career Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Personal/License', async(req, res) => {
    await models.profilelicense.findOne({
        where : {
            PfLicenseID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/License Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/License Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Personal/License', async(req, res) => {
    await models.profilelicense.update(
        {
            PfLicenseAuth : req.body.res
        }
        , { where: { PfLicenseID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Personal/License Success ' + result);
        
        var license = await models.profilelicense.findOne({
            where : {
                PfLicenseID: req.body.id
            }
        })
        
        client.hgetall(String(license.PfLUserID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : license.PfLUserID,
                title : "개인 프로필 인증",
                type : "PERSONAL_LICENSE_AUTH_UPDATE",
                tableIndex : req.body.id,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "PERSONAL_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Personal/License Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Personal/Win', async(req, res) => {
    await models.profilewin.findOne({
        where : {
            PfWinID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Personal/Win Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Personal/Win Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Personal/Win', async(req, res) => {
    await models.profilewin.update(
        {
            PfWinAuth : req.body.res
        }
        , { where: { PfWinID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Personal/Win Success ' + result);
        
        var win = await models.profilewin.findOne({
            where : {
                PfWinID : req.body.id
            }
        })
        
        client.hgetall(String(win.PfWUserID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : win.PfWUserID,
                title : "개인 프로필 인증",
                type : "PERSONAL_WIN_AUTH_UPDATE",
                tableIndex : req.body.id,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "PERSONAL_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Personal/Win Failed ' + err);
        res.json(null);
    });
});

router.get('/Select/Team/SummaryProfile', async(req, res) => {
    await models.team.findAll({
        attributes: [
            'id', 'LeaderID', 'Name', 'Category', 'Part', 'Location', 'SubLocation','PossibleJoin'
        ],
    }).then(result => {
        console.log(URL + '/Select/Team/SummaryProfile Success'+ result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/SummaryProfile Failed'+ err);
        res.json(null);
    });
});

router.post('/Select/Team/DetailProfile', async(req, res) => {
    await models.team.findOne({
        where : {
            id : req.body.id
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
        console.log(URL + '/Select/Team/DetailProfile Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/DetailProfile Failed ' + err);
        res.json(null);
    });
})

router.get('/Select/Team/AuthManagement', async(req, res) => {
    var data = [];

    let teamauths = await models.teamauth.findAll({
        where : {
            TAuthAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(teamauths) == false) {
        for(let i = 0 ; i < teamauths.length ; ++i) {
            var temp = {
                teamID : teamauths[i].TATeamID,
                id : teamauths[i].TAuthID,
                type : 0
            };

            data.push(temp);
        }
    }

    let teamperformances = await models.teamperformance.findAll({
        where : {
            TPerformAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(teamperformances) == false) {
        for(let i = 0 ; i < teamperformances.length ; ++i) {
            var temp = {
                teamID : teamperformances[i].TPTeamID,
                id : teamperformances[i].TPerformID,
                type : 1
            };

            data.push(temp);
        }
    }

    let teamwins = await models.teamwin.findAll({
        where : {
            TWinAuth : 2
        },
        order : [
            ['updatedAt', 'DESC']
          ],
    });

    if(globalRouter.IsEmpty(teamwins) == false) {
        for(let i = 0 ; i < teamwins.length ; ++i) {
            var temp = {
                teamID : teamwins[i].TWTeamID,
                id : teamwins[i].TWinID,
                type : 2
            };

            data.push(temp);
        }
    }

    res.json(data);
});

router.post('/Select/Team/CertificationSuccessList', async(req, res) => {
    var data = [];

    let teamauths = await models.teamauth.findAll({
        where : {
            TATeamID : req.body.teamID,
            TAuthAuth : 1
        }
    });

    if(globalRouter.IsEmpty(teamauths) == false) {
        for(let i = 0 ; i < teamauths.length ; ++i) {
            var temp = {
                teamID : teamauths[i].TATeamID,
                id : teamauths[i].TAuthID,
                type : 0
            };

            data.push(temp);
        }
    }

    let teamperformances = await models.teamperformance.findAll({
        where : {
            TPTeamID : req.body.teamID,
            TPerformAuth : 1
        }
    });

    if(globalRouter.IsEmpty(teamperformances) == false) {
        for(let i = 0 ; i < teamperformances.length ; ++i) {
            var temp = {
                teamID : teamperformances[i].TPTeamID,
                id : teamperformances[i].TPerformID,
                type : 1
            };

            data.push(temp);
        }
    }

    let teamwins = await models.teamwin.findAll({
        where : {
            TWTeamID : req.body.teamID,
            TWinAuth : 1
        }
    });

    if(globalRouter.IsEmpty(teamwins) == false) {
        for(let i = 0 ; i < teamwins.length ; ++i) {
            var temp = {
                teamID : teamwins[i].TWTeamID,
                id : teamwins[i].TWinID,
                type : 2
            };

            data.push(temp);
        }
    }

    res.json(data);
})

router.post('/Select/Team/BadgeList', async(req, res) => {
    await models.TeamBadgeList.findAll({
        where : {
            TeamID :    req.body.teamID
        }
    }).then(result => {
        console.log(URL + '/Select/Team/BadgeList Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/BadgeList Failed' + err);
        res.json(null);
    })
})

router.post('/Select/Team/Auth', async(req, res) => {
    await models.teamauth.findOne({
        where : {
            TAuthID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Team/Auth Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/Auth Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Team/Auth', async(req, res) => {
    await models.teamauth.update(
        {
            TAuthAuth : req.body.res
        }
        , { where: { TAuthID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Team/Auth Success ' + result);

        var teamAuth = await models.teamauth.findOne({
            where : {
                TAuthID: req.body.id
            }
        })

        var team = await models.team.findOne({
            where : {
                id: teamAuth.TATeamID
            }
        })

        client.hgetall(String(team.LeaderID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : team.LeaderID,
                title : "팀 프로필 인증",
                type : "TEAM_AUTH_AUTH_UPDATE",
                tableIndex : req.body.id,
                teamIndex : teamAuth.TATeamID,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "TEAM_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });

    }).catch(err => {
        console.log(URL + '/Update/Team/Auth Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Team/Performance', async(req, res) => {
    await models.teamperformance.findOne({
        where : {
            TPerformID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Team/Performance Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/Performance Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Team/Performance', async(req, res) => {
    await models.teamperformance.update(
        {
            TPerformAuth : req.body.res
        }
        , { where: { TPerformID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Team/Performance Success ' + result);
        
        var teamPerformance = await models.teamperformance.findOne({
            where : {
                TPerformID: req.body.id
            }
        })

        var team = await models.team.findOne({
            where : {
                id: teamPerformance.TPTeamID
            }
        })

        client.hgetall(String(team.LeaderID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : team.LeaderID,
                title : "팀 프로필 인증",
                type : "TEAM_PERFORMANCE_AUTH_UPDATE",
                tableIndex : req.body.id,
                teamIndex : teamPerformance.TPTeamID,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "TEAM_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });

    }).catch(err => {
        console.log(URL + '/Update/Team/Performance Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Team/Win', async(req, res) => {
    await models.teamwin.findOne({
        where : {
            TWinID : req.body.id
        }
    }).then(result => {
        console.log(URL + '/Select/Team/Win Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Team/Win Failed ' + err);
        res.json(null);
    })
});

router.post('/Update/Team/Win', async(req, res) => {
    await models.teamwin.update(
        {
            TWinAuth : req.body.res
        }
        , { where: { TWinID: req.body.id} }
    ).then(async result => {
        console.log(URL + '/Update/Team/Win Success ' + result);
        
        var teamWin = await models.teamwin.findOne({
            where : {
                TWinID: req.body.id
            }
        })

        var team = await models.team.findOne({
            where : {
                id: teamWin.TWTeamID
            }
        })

        client.hgetall(String(team.LeaderID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;
    
            var data = JSON.stringify({
                userID : 1, //관리자
                inviteID : team.LeaderID,
                title : "팀 프로필 인증",
                type : "TEAM_WIN_AUTH_UPDATE",
                tableIndex : req.body.id,
                teamIndex : teamWin.TWTeamID,
                body : '요청하신 인증에 대한 결과가 도착했습니다.',
                isSend : obj.isOnline,
                topic : "TEAM_PROFILE_AUTH",
            })  
    
            if(fcmFuncRouter.SendFcmEvent( data )){
                res.status(200).send(result);
                return;
            }else{
                res.status(200).send(result);
                return;
            }
        });
    }).catch(err => {
        console.log(URL + '/Update/Team/Win Failed ' + err);
        res.json(null);
    });
});

router.post('/Select/Team/Leader', async (req, res) => {
    let data = req.body;

    await models.team.findAll({
        where: {
            LeaderID: data.userID
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
        ],
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log("Profile/Leader select error " + err);
        res.json(null);
    });
});

router.post('/Select/Team/SelectUser', async (req, res) => {
    await models.TeamList.findAll({
        where: {
            UserID: req.body.userID
        },
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log("/Profile/SelectID error" + err);
        res.json(null);
    });
})

router.get('/Select/Professional/SummaryProfile', async(req, res) => {

});

router.get('/Select/CommunityManagement', async(req, res) => {

});

router.get('/Select/Declare/Community', async(req, res) => {
    await models.CommunityDeclare.findAll({
        order : [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/Declare/Community Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Declare/Community Failed ' + err);
        res.json(null);
    });
});

router.post('/Update/CommunityDeclare/Processing', async(req, res) => {
    await models.CommunityDeclare.update(
        {
            IsProcessing : req.body.isprocessing
        },
        {
            where : { id : req.body.id}
        }
    ).then(result => {
        console.log(URL + '/Update/CommunityDeclare/Processing' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Update/CommunityDeclare/Processing' + err);
        res.json(null);
    })
});

router.get('/Select/Declare/CommunityReply', async(req, res) => {
    await models.CommunityReplyDeclare.findAll({
        order : [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/Declare/CommunityReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Declare/CommunityReply Failed ' + err);
        res.json(null);
    });
});

router.post('/Update/CommunityReplyDeclare/Processing', async(req, res) => {
    await models.CommunityReplyDeclare.update(
        {
            IsProcessing : req.body.isprocessing
        },
        {
            where : { id : req.body.id}
        }
    ).then(result => {
        console.log(URL + '/Update/CommunityReplyDeclare/Processing' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Update/CommunityReplyDeclare/Processing' + err);
        res.json(null);
    })
});

router.get('/Select/Declare/CommunityReplyReply', async(req, res) => {
    await models.CommunityReplyReplyDeclare.findAll({
        order : [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/Declare/CommunityReplyReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Declare/CommunityReplyReply Failed ' + err);
        res.json(null);
    });
});

router.post('/Update/CommunityReplyReplyDeclare/Processing', async(req, res) => {
    await models.CommunityReplyReplyDeclare.update(
        {
            IsProcessing : req.body.isprocessing
        },
        {
            where : { id : req.body.id}
        }
    ).then(result => {
        console.log(URL + '/Update/CommunityReplyReplyDeclare/Processing' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Update/CommunityReplyReplyDeclare/Processing' + err);
        res.json(null);
    })
});

router.get('/Select/CommunityPost', async(req, res) => {
    await models.CommunityPost.findAll({
      limit : 30,
      order : [
        ['createdAt', 'DESC']
      ],
      include: [
        { 
          model : models.CommunityLike , 
          required: true, 
          limit: 99,
        },
        { 
          model : models.CommunityReply , 
          required: true , 
          limit: 99
        },
        { 
            model : models.CommunityDeclare , 
            required: true , 
            limit: 99
        },
      ],
      where: {
        IsShow : 1
      }
    }).then( result => {
      console.log("CommunityPost find Success");
      res.json(result);
    }).catch( err => {
      console.log("CommunityPost find Faield" + err);
      res.json(null);
    })
})
  
router.post('/SelectOffset/CommunityPost', async ( req, res ) => {
    let offset = req.body.index * 1;
    let limit = 30;
  
    await models.CommunityPost.findAll({
      offset: offset,
      limit: limit,
      order: [
        ['id', 'DESC']
      ],
      include: [
        { 
          model : models.CommunityLike , 
          required: true, 
          limit: 99,
        },
        { 
          model : models.CommunityReply , 
          required: true , 
          limit: 99
        },
        { 
            model : models.CommunityDeclare , 
            required: true , 
            limit: 99
        },
      ],
      where : {
        IsShow : 1
      }
    }).then( result => {
      console.log("CommunityPost find Success");
      res.json(result);
    }).catch( err => {
      console.log("CommunityPost find Faield" + err);
      res.json(null);
    })
  })

router.post('/Select/Detail/CommunityPost', async(req, res) => {
    await models.CommunityPost.findOne({
        where : {
            id : req.body.id,
        },
        include: [
            { 
              model : models.CommunityLike , 
              required: true, 
              limit: 99,
            },
            { 
              model : models.CommunityReply , 
              required: true , 
              limit: 99,
              where : {
                  PostID : req.body.id
              },
              include: [
                { 
                  model : models.CommunityReplyLike , 
                  required: true, 
                  limit: 99
                },
                { 
                  model : models.CommunityReplyReply , 
                  required: true , 
                  limit: 99,
                  include:[
                    { 
                      model : models.CommunityReplyReplyLike , 
                      required: true , 
                      limit: 99
                    },
                  ]
                },
              ],
            },
            { 
                model : models.CommunityDeclare , 
                required: true , 
                limit: 99
            },
          ],
    }).then(result => {
        console.log(URL + '/Select/CommunityPost Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/CommunityPost Failed' + err);
        res.json(null);
    });
});

router.post('/Select/Detail/CommunityReply', async(req, res) => {
    await models.CommunityReply.findOne({
        where : {
            id : req.body.id,
        },
        include: [
            { 
              model : models.CommunityReplyLike , 
              required: true, 
              limit: 99
            },
            { 
              model : models.CommunityReplyReply , 
              required: true , 
              limit: 99,
              include:[
                { 
                  model : models.CommunityReplyReplyLike , 
                  required: true , 
                  limit: 99
                },
              ]
            },
            { 
                model : models.CommunityReplyDeclare , 
                required: true, 
                limit: 99
              },
          ],
    }).then(result => {
        console.log(URL + '/Select/Detail/CommunityReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Detail/CommunityReply Failed' + err);
        res.json(null);
    });
});

router.post('/Select/Detail/CommunityReplyReply', async(req, res) => {
    await models.CommunityReplyReply.findOne({
        where : {
            id : req.body.id,
        },
        include: [
            { 
              model : models.CommunityReplyReplyLike , 
              required: true, 
              limit: 99
            },
            { 
                model : models.CommunityReplyReplyDeclare , 
                required: true, 
                limit: 99
              },
          ],
    }).then(result => {
        console.log(URL + '/Select/Detail/CommunityReplyReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Detail/CommunityReplyReply Failed' + err);
        res.json(null);
    });
});

router.post('/Select/UserID/CommunityPost', async(req, res) => {
    await models.CommunityPost.findAll({
        where : {
            UserID : req.body.userID,

        },
        order : [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/UserID/CommunityPost Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/UserID/CommunityPost Failed' + err);
        res.json(null);
    });
});

router.post('/Select/UserID/CommunityReply', async(req, res) => {
    await models.CommunityReply.findAll({
        where : {
            UserID : req.body.userID,

        },
        order : [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/UserID/CommunityPostReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/UserID/CommunityPost Failed' + err);
        res.json(null);
    });
});

router.post('/Select/UserID/CommunityReplyReply', async(req, res) => {
    await models.CommunityReplyReply.findAll({
        where : {
            UserID : req.body.userID,

        },
        order : [
            ['id', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/UserID/CommunityPostReplyReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/UserID/CommunityPostReplyReply Failed' + err);
        res.json(null);
    });
});

router.post('/Select/ReplyID/CommunityReply', async(req, res) => {
    await models.CommunityReply.findOne({
        where : {
            id : req.body.id
        },
        order : [
            ['createdAt', 'DESC']
        ],
        include: [
            { 
              model : models.CommunityReplyLike , 
              required: true, 
              limit: 99
            },
            { 
              model : models.CommunityReplyReply , 
              required: true , 
              limit: 99,
              include:[
                { 
                  model : models.CommunityReplyReplyLike , 
                  required: true , 
                  limit: 99
                },
              ]
            },
        ]
    }).then(result => {
        console.log(URL + '/Select/ReplyID/CommunityReply Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/ReplyID/CommunityReply Failed' + err);
        res.json(null);
    })
});

router.get('/Select/Declare/Chat', async(req, res) => {
    await models.RoomDeclare.findAll({
        order : [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/Declare/Chat Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/Declare/Chat Failed ' + err);
        res.json(null);
    });
});

router.post('/Update/ChatDeclare/Processing', async(req, res) => {
    await models.RoomDeclare.update(
        {
            IsProcessing : req.body.isprocessing
        },
        {
            where : { id : req.body.id}
        }
    ).then(result => {
        console.log(URL + '/Update/ChatDeclare/Processing' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Update/ChatDeclare/Processing' + err);
        res.json(null);
    })
});

router.post('/Select/ChatLog', async(req, res) => {
    await models.ChatLog.findAll({
        where : {
            roomName : req.body.roomName
        },
        order : [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + '/Select/ChatLog Success' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Select/ChatLog Failed ' + err);
        res.json(null);
    });
})

router.post('/Insert/Personal/Badge', async(req, res) => {
    await models.PersonalBadgeList.findOrCreate({
        where: {
            UserID : req.body.userID,
            BadgeID : req.body.badgeID,
          },
        defaults: {
            UserID : req.body.userID,
            BadgeID : req.body.badgeID,
        }
    }).then(async result => {
        if(result[1]){
            console.log(URL + '/Insert/Personal/Badge Success ' + result);

            client.hgetall(String(req.body.userID), async function(err, obj) {
                if(err) throw err;
                if(obj == null) return;
        
                var data = JSON.stringify({
                    userID : 1, //관리자
                    inviteID : req.body.userID,
                    title : "개인 프로필 뱃지 획득",
                    type : "PERSONAL_GET_BADGE",
                    tableIndex : result['item'].id,
                    targetIndex : req.body.badgeID,
                    body : '새로운 개인 프로필 뱃지를 획득하였습니다!',
                    isSend : obj.isOnline,
                    topic : "PERSONAL_PROFILE_BADGE",
                })  
        
                if(fcmFuncRouter.SendFcmEvent( data )){
                    res.status(200).send(result);
                    return;
                }else{
                    res.status(200).send(result);
                    return;
                }
            });
        }else{
            console.log(URL + '/Insert/Personal/Badge already have data ' + result);
            res.json(null);
        }
    }).catch(err => {
        console.log(URL + '/Insert/Personal/Badge Failed ' + err);
        res.json(null);
    })
});

router.post('/Destroy/Personal/Badge', async(req, res) => {
    await models.PersonalBadgeList.destroy({
        where: {
            id : req.body.id,
        },
    }).then(result => {
        console.log(URL + '/Destroy/Personal/Badge Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Destroy/Personal/Badge Failed ' + err);
        res.json(null);
    })
});

router.post('/Insert/Team/Badge', async(req, res) => {
    await models.TeamBadgeList.findOrCreate({
        where: {
            TeamID : req.body.teamID,
            BadgeID : req.body.badgeID,
          },
          defaults: {
            TeamID : req.body.teamID,
            BadgeID : req.body.badgeID,
          }
    }).then(async result => {
        if(result[1]){
            console.log(URL + '/Insert/Team/Badge Success ' + result);

            var team = await models.team.findOne({
                where : {
                    id: req.body.teamID
                }
            })

            client.hgetall(String(team.LeaderID), async function(err, obj) {
                if(err) throw err;
                if(obj == null) return;
        
                var data = JSON.stringify({
                    userID : 1, //관리자
                    inviteID : team.LeaderID,
                    title : "팀 프로필 뱃지 획득",
                    type : "TEAM_GET_BADGE",
                    tableIndex : result['item'].id,
                    targetIndex : req.body.badgeID,
                    teamIndex : req.body.teamID,
                    body : '새로운 팀 프로필 뱃지를 획득하였습니다!',
                    isSend : obj.isOnline,
                    topic : "TEAM_PROFILE_BADGE",
                })  
        
                if(fcmFuncRouter.SendFcmEvent( data )){
                    res.status(200).send(result);
                    return;
                }else{
                    res.status(200).send(result);
                    return;
                }
            });

            res.json(result);
        }else{
            console.log(URL + '/Insert/Team/Badge already have data ' + result);
            res.json(null);
        }
    }).catch(err => {
        console.log(URL + '/Insert/Team/Badge Failed ' + err);
        res.json(null);
    })
});

router.post('/Destroy/Team/Badge', async(req, res) => {
    await models.TeamBadgeList.destroy({
        where: {
            id : req.body.id,
        },
    }).then(result => {
        console.log(URL + '/Destroy/Team/Badge Success ' + result);
        res.json(result);
    }).catch(err => {
        console.log(URL + '/Destroy/Team/Badge Failed ' + err);
        res.json(null);
    })
});

// 팀 리쿠르트
router.get('/Select/TeamMemberRecruit', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Select/TeamMemberRecruit find Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/TeamMemberRecruit find Faield' + err);
        res.status(400).send(null);
    })
});

// 개인 리쿠르트
router.get('/Select/PersonalSeekTeam', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Select/PersonalSeekTeam Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/PersnalSeekTeam Faield' + err);
        res.status(400).send(null);
    })
})

// 팀 리쿠르트 유저 아이디
router.post('/Select/TeamMemberRecruitByUserID', async(req, res) => {

    var teamList = await models.team.findAll({where : {LeaderID : req.body.userID},},);

    var resData = [];
    for(var i = 0 ; i < teamList.length; ++i){
      await models.TeamMemberRecruit.findAll({
          where : {
              TeamID : teamList[i].id,
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

// 개인 리쿠르트 유저 아이디
router.post('/Select/PersonalSeekTeamByUserID', async(req, res) => {
    await models.PersonalSeekTeam.findAll({
        where : {
            userID : req.body.userID,
        },
        order: [
            ['createdAt', 'DESC']
        ],
    }).then(result => {
        console.log(URL + 'Select/PersonalSeekTeamByUserID Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'Select/PersnalSeekTeamByUserID Faield' + err);
        res.status(400).send(null);
    })
})

// 팀 리쿠르트 팀 아이디
router.post('/Select/TeamMemberRecruitByTeamID', async(req, res) => {
    await models.TeamMemberRecruit.findAll({
        where : {
            TeamID : req.body.teamID,
        }
    }).then( result => {
        console.log(URL + "Select/TeamMemberRecruitByTeamID find Success " + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + "Select/TeamMemberRecruitByTeamID find Faield " + err);
        res.status(400).send(null);
    });
})

router.get('/Select/TodayLoginUser', async(req, res) => {
	await models.user.findAll({
	  where : {
		updatedAt : {
		  [Op.gte] : moment().subtract(24, 'H').toDate()
		},
	  }
	}).then(result => {
      console.log(URL + '/Select/TodayLoginUser user findall success');
      
      let resData = {
          LENGTH : result.length
      }

	  res.status(200).send(resData);
	}).catch(err => {
        console.log(URL + '/Select/TodayLoginUser user findall failed ' + err);
	  res.status(404).send(err);
    })
  })

router.get('/Select/NowLoginUser', async(req, res) => {
    var headlineKey = "user:" + 7777 + ":headline";
    var checkKey = "user:" + 7777 + ":check";

    client.mget([headlineKey,checkKey], function(err, values) {
        if(err) throw err;
        console.log("The User " + values[0] + "has " + values[1] + "check");

        let resData = {
            LENGTH : values[1] * 1
        }

        res.status(200).send(resData);
    });
    
})

module.exports = router;