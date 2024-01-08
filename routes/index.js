const express = require('express');
const models = require('../models');
const router = express.Router();
//로그인 대소문자 구분 = {caseSensitive: true}

const { Op } = require('sequelize');

var UserInfo = require('../controllers/userInfo');
var TokenInfo = require('../controllers/tokenInfo');

const globalRouter = require('./global'),
      fcmFuncRouter = require('./fcm/fcmFuncRouter');


const passwordController = require('../controllers/encryptpwd');

const moment = require('moment');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
      

//const redis = require('redis');
//const client = redis.createClient(6379, "127.0.0.1");   //저장용
const client = globalRouter.client;

//chris
//회원가입
var URL = '/Personal/';

router.post('/Select/DebugLogin', async (req, res, next) => {
  await UserInfo.DebugLogin(req, res);
})

router.post('/Insert', async (req, res, next) => {
  await UserInfo.Insert(req, res);
});

router.post('/Delete', async (req, res, next) => {
  await UserInfo.Delete(req, res);
});

router.post('/Select/SocialLogin', async (req, res, next) => {
  await UserInfo.SocialLogin(req, res);
});

router.post('/Select/UserInfo', async (req, res, next) => {
  await UserInfo.GetUserInfo(req, res);
});

router.post('/Update/Name', async (req, res, next) => {
  await UserInfo.NameUpdate(req, res);
})

router.post('/Update/Phone', async (req, res, next) => {
  await UserInfo.PhoneUpdate(req, res);
})

router.post('/Select/Login', async (req, res, next) => {
  await UserInfo.Login(req, res);
})

router.post('/Select/IDCheck', async (req, res, next) => {
  await UserInfo.IDCheck(req, res);
})

// for login token authentication
router.post('/Select/Login/Auth', async (req, res, next) => {
  await TokenInfo.Auth(req, res);
})

// give new access token with refreshtoken 
router.post('/Select/Login/Token', async (req, res, next) => {
  await UserInfo.getNewAccessToken(req, res);
})

//For token middle ware check
router.post('/Select/ChangePassword', require('../controllers/verifyToken'), async (req, res, next) => {
//router.post('/Select/ChangePassword', async (req, res, next) => {
  await UserInfo.Edit(req, res);
});

//For token middle ware check
router.post('/DebugChangePassword', require('../controllers/verifyToken'), async (req, res, next) => {
  await UserInfo.DebugEdit(req, res);
});

// use middleware for ' do something '
router.post('/Login/Data', require('../controllers/verifyToken'), async (req, res, next) => {
  //UserInfo.somedata ( req, res );
  await res.status(200).json({
    "status": "success",
    "message": "Accessing secure route.."
  });
})

router.post('/Exit/Member', async(req, res) => {

  //알림 삭제
  await models.NotificationList.destroy(
    {
      where : {
        [Op.or] : {
          UserID : req.body.userID,
          TargetID : req.body.userID
        }
      }
    }
  )

  //초대장 삭제
  //1:1초대
  await models.InvitingRoomUser.destroy(
    {
      where : {
        [Op.or] : {
          UserID : req.body.userID,
          InviteID : req.body.userID
        }
      }
    }
  )

  //팀 초대
  await models.InvitingTeamUsers.destroy(
    {
      where : {
        InvitingID : req.body.userID
      }
    }
  )

  //개인 리쿠르트 초대
  await models.InvitingPersonalSeekTeamUser.destroy(
    {
      where : {
        InviteID : req.body.userID
      }
    }
  )

  //팀 리쿠르트 초대
  await models.InvitingTeamMemberRecruitsUser.destroy(
    {
      where : {
        UserID : req.body.userID
      }
    }
  )

  //팀원인 곳에서 나가기
  var memberTeam = await models.TeamList.findAll({
    where : {
      UserID : req.body.userID
    }
  })

  for(var i = 0 ; i < memberTeam.length; ++i){
    await models.team.findOne({
      where : {id : memberTeam[i].TeamID}
    }).then(async result => {
      console.log(URL + '/Exit/Member team findOne Success');

      //팀 리더한테 보냄
      client.hgetall(String(result.LeaderID), async function(err, obj) {
        if(err) throw err;
        if(obj == null) return;

        var data = JSON.stringify({
            userID : req.body.userID,
            inviteID : result.LeaderID,
            title : "팀 프로필",
            type : "TEAM_MEMBER_LEAVE",
            targetIndex : result.LeaderID,
            teamIndex : result.id,
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

      //팀원 들한테 보냄
      await models.TeamList.findAll({
        where : {
          TeamID : result.id,
          UserID : {
            [Op.ne]: req.body.userID
          }
        }
      }).then(async teamListResult => {
        console.log(URL + '/Exit/Member TeamList findAll Success');

        for(var j = 0 ; j < teamListResult.length; ++j){
          //팀원들한테 보냄
          var targetID = teamListResult[j].UserID;
          client.hgetall(String(targetID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID : req.body.userID,
                inviteID : targetID,
                title : "팀 프로필",
                type : "TEAM_MEMBER_LEAVE",
                targetIndex : targetID,
                teamIndex : result.id,
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
      }).catch(err => {
        globalRouter.logger.error(URL + '/Exit/Member TeamList findAll Failed' + err);
      })
    }).catch(err => {
      globalRouter.logger.error(URL + '/Exit/Member team findOne Failed' + err);
    })
  }

  //팀원목록 삭제
  await models.TeamList.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //채팅방 나가기
  var rooms = await models.RoomUser.findAll(
    {
      where : {UserID : req.body.userID}
    }
  )

  for(var i = 0 ; i < rooms.length; ++i){
    await models.RoomUser.findAll({
      where : {
        RoomID : rooms[i].RoomID,
        UserID : {
          [Op.ne]: req.body.userID
        }
      }
    }).then(roomUserResult => {
      console.log(URL + '/Exit/Member RoomUser findAll Success');

      for(var i = 0 ; i < roomUserResult.length; ++i) {
        var targetID = roomUserResult[i].UserID;
        client.hgetall(String(targetID), async function(err, obj) {
            if(err) throw err;
            if(obj == null) return;

            var data = JSON.stringify({
                userID : req.body.userID,
                inviteID : targetID,
                title : "채팅",
                type : "ROOM_LEAVE",
                targetIndex : roomUserResult.RoomID,
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
    })
  }

  //채팅방 나가기
  var rooms = await models.RoomUser.destroy(
    {
      where : {UserID : req.body.userID}
    }
  )

  //대댓글 신고 삭제
  await models.CommunityReplyReplyDeclare.destroy({
    where : {
      [Op.or] : {
        UserID : req.body.userID,
        TargetID : req.body.userID
      }
    }
  })

  //대댓글 좋아요 삭제
  await models.CommunityReplyReplyLike.destroy({
    where : {
      UserID : req.body.userID
    }
  })
  
  //대댓글 삭제
  await models.CommunityReplyReply.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //댓글 신고 삭제
  await models.CommunityReplyDeclare.destroy({
    where : {
      [Op.or] : {
        UserID : req.body.userID,
        TargetID : req.body.userID
      }
    }
  })

  //댓글 좋아요 삭제
  await models.CommunityReplyLike.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //댓글 구독자 삭제
  await models.CommunityReplySubscriber.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //댓글 삭제
  await models.CommunityReply.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //커뮤니티 신고 삭제
  await models.CommunityDeclare.destroy({
    where : {
      [Op.or] : {
        UserID : req.body.userID,
        TargetID : req.body.userID
      }
    }
  })

  //커뮤니티 좋아요 삭제
  await models.CommunityLike.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //커뮤니티 구독자 삭제
  await models.CommunitySubscriber.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //게시글 삭제
  await models.CommunityPost.destroy({
    where : {
      UserID : req.body.userID
    }
  })

  //회원 삭제
  await models.user.destroy(
    {
      where : { UserID: req.body.userID} 
    }
  ).then(result => {
    console.log(URL + 'Exit/Member UserID : userID ' );
    res.status(200).send(true);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Exit/Member error ' + err);
    res.status(404).send(err);
  })
});

//logout
router.post('/Logout', (req, res) => { //아직 안됨 //token 없애줘야함..

  models.FcmTokenList.update(
    {
      Token : null
    },
    {
      where : {
        UserID : req.body.userID
      },
    }
  ).then( async result => {
    console.log(URL + '/Logout success');

    res.status(200).send(true);
  }).catch( err => {
    globalRouter.logger.error(URL + 'logout [error] error ' + err);
    res.status(404).send(err);
  })
});

router.post('/Select/User', async function (req, res) {
  let userid = req.body.userID;
  await models.user.findOne({
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'ID', 'Name', 'Information', 
      'Job', 'Part', 'SubJob', 'SubPart', 'Location', 'SubLocation', 
      'Badge1', 'Badge2', 'Badge3',
      'PhoneAuth', 'PhoneNumber', 'Premium',
      'createdAt', 'updatedAt'
    ],
    where: {
      UserID: userid
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
      }
    ]
  }).then(result => {
    console.log(URL + 'Select/User user findOne Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/User user findOne Failed' + err);
    res.status(200).send(null);
  })
});

router.post('/Select/ModifyUser', async function (req, res) {

  let userid = req.body.userID;
  let updateAt = req.body.updatedAt;
  
  await models.user.findOne({
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'ID', 'Name', 'Information', 
      'Job', 'Part', 'SubJob', 'SubPart', 'Location', 'SubLocation', 
      'Badge1', 'Badge2', 'Badge3',
      'PhoneAuth', 'PhoneNumber', 'Premium',
      'createdAt', 'updatedAt', 
    ],
    where: {
      UserID: userid
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
      }
    ]
  }).then(result => {

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
    console.log(URL + 'Select/ModifyUser user findOne Success' + result);
    if(strDate == updateAt){//같을 때
      res.status(200).send(null);
    }else{//다를 때
      res.status(200).send(result);
    }
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/ModifyUser user findOne Failed' + err);
    res.status(200).send(null);
  })
});

//select 하는 부분
router.post('/Select/UserList', async function (req, res, next) {
  let userid = req.body.userID;
  await models.user.findAll({
    offset: 0, //새로운 리스트로 보여주는 부분이 없으 offset 다시 . . 
    limit: 30,
    order : [
      ['updatedAt', 'DESC']
    ],
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'ID', 'Name', 'Information', 
      'Job', 'Part', 'SubJob', 'SubPart', 'Location', 'SubLocation', 
      'Badge1', 'Badge2', 'Badge3',
      'PhoneAuth', 'PhoneNumber', 'Premium',
      'createdAt', 'updatedAt'
    ],
    where: {
      PhoneAuth: {
        [Op.ne]: null
      }
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
    console.log(URL + 'Select/UserList user findAll Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/UserList user findAll Failed' + err);
    res.status(400).send(null);
  })
})

//select 하는 부분
router.post('/Select/Offset/UserList', async function (req, res, next) {
  let userid = req.body.userID;
  let offset = req.body.index;
  await models.user.findAll({
    offset: offset, //새로운 리스트로 보여주는 부분이 없으 offset 다시 . . 
    limit: 30,
    order : [
      ['updatedAt', 'DESC']
    ],
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'ID', 'Name', 'Information', 
      'Job', 'Part', 'SubJob', 'SubPart', 'Location', 'SubLocation', 
      'Badge1', 'Badge2', 'Badge3',
      'PhoneAuth', 'PhoneNumber', 'Premium',
      'createdAt', 'updatedAt'
    ],
    where: {
      PhoneAuth: {
        [Op.ne]: null
      }
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
    console.log(URL + 'Select/Offset/UserList user findAll Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Offset/UserList user findAll Failed' + err);
    res.status(400).send(null);
  })
})
 
router.post('/Insert/Like', async (req, res) => {
  let body = req.body;

  globalRouter.CreateOrDestroy( models.PersonalLike,
      {
          UserID : body.userID,
          TargetID : body.targetID
      }
  ).then( async result => {

    if(result['created'] == true){
      res.status(200).send(result);
      
      // //자기자신이면 건너뜀
      // if(body.userID == body.targetID) {
      //   res.status(200).send(result);
      //   return;
      // }

      // client.hgetall(String(body.targetID), async function(err, obj) {
      //   if(err) throw err;
      //   if(obj == null) return;

      //   var user = await models.user.findOne({where: {UserID: body.userID}});
  
      //   var data = JSON.stringify({
      //       userID : body.userID,
      //       inviteID : body.targetID,
      //       title : "개인 프로필",
      //       type : "PROFILE_LIKE",
      //       tableIndex : result['item'].id,
      //       body : user.Name + "님이 당신의 프로필에 좋아요 를 눌렀습니다.",
      //       isSend : obj.isOnline,
      //       topic : "PROFILE_LIKE",
      //   })  
  
      //   if(fcmFuncRouter.SendFcmEvent( data )){
      //     //client.rpush('notiLogs', data );
      //     res.status(200).send(result);
      //     return;
      //   }else{
      //     res.status(200).send(result);
      //     return;
      //   }
      // });
    }else{
      res.status(200).send(result);
      return;
    }
  }).catch( err =>{
      globalRouter.logger.error(URL + 'Insert/Like CreateOrDestroy Failed' + err);
      res.status(400).send(null);
  })
});

router.post('/Select/Like', async (req, res) => {
  let data = req.body;

  await models.PersonalLike.findAll({
      where : {
          UserID : data.userID,
      }
  }).then(result => {
    console.log(URL + 'Select/Like PersonalLike findAll Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Like PersonalLike findAll Failed' + err);
    res.status(400).send(null);
  })
});

router.post('/Select/FindID', async (req, res) => {
  await models.user.findOne({
    attributes: ["ID"],
    where: {
      PhoneNumber : req.body.phoneNumber
    }
  }).then(result => {
    console.log(URL + 'Select/FindID user findOne Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/FindID user findOne Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Select/CheckAndChangePassword', async (req, res) => {

  let body = req.body;

  await models.user.findOne({
    where: {
      ID: body.id, //좌측에 있는 부분이 ..models/user.js 에 있는 변수명과 (테이블의 변수명과) 일치해야하는 부분이다.
    },
  }).then(async result => {

    if(globalRouter.IsEmpty(result)){
      console.log(result);
      globalRouter.logger.error(URL + 'Select/CheckAndChangePassword is Empty');
      res.json(null);
    }else{
      const newhashedPwd = passwordController.getHashedPassword(body.password);

      let value = {
        Password : newhashedPwd,
      }

      await result.update(value).then(result => {
        console.log(URL + 'Select/CheckAndChangePassword Success' + result);
        res.json(true);
      }).catch(err => {
        console.log(URL + 'Select/CheckAndChangePassword Failed' + err);
        res.json(null);
      })
    }
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/CheckAndChangePassword is Failed' + err);
    res.json(null);
  })
})

router.post('/Select/FindIDForPassword', async (req, res) => {
  await models.user.findOne({
    where: {
      ID : req.body.id
    },
  }).then(result => {
    console.log(URL + 'Select/FindIDForPassword user findOne Success' + result);
    res.status(200).send(true);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/FindIDForPassword user findOne Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Search/Name', async (req, res) => {
  let searchWord = req.body.searchWord;

  await models.user.findAll({
    where: {
      Name : {
          [Op.like] : '%' + searchWord + '%'
      },
      PhoneAuth: {
        [Op.ne]: null
      }
    },
    offset : req.body.index * 1,
    order : [
      ['updatedAt', 'DESC']
    ],
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'ID', 'Name', 'Information', 
      'Job', 'Part', 'SubJob', 'SubPart', 'Location', 'SubLocation', 
      'Badge1', 'Badge2', 'Badge3',
      'PhoneAuth', 'PhoneNumber', 'Premium',
      'createdAt', 'updatedAt'
    ],
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
      }
    ]
  }).then(result => {
    console.log(URL + 'Search/Name user findAll Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Search/Name user findAll Failed' + err);
    res.status(400).send(null);
  })
})

router.get('/Select/NewUser', async (req, res) => {
  await models.user.findAll({
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'UserID', 'Name','Part','Location'
    ],
    include : [
      {
        model : models.PersonalPhoto,
        required: true , 
        limit: 1,
        order : [
          ['Index', 'ASC']
        ],
      },
    ],
    order : [
      ['createdAt', 'DESC']
    ],
    limit : 10,
    where : {
      PhoneAuth: {
        [Op.ne]: null
      }
    }
  }).then(result => {
    console.log(URL + 'Select/NewUser user findAll Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/NewUser user findAll Failed' + err);
    res.status(400).send(null);
  })
});

router.post('/Update/Marketing', async (req, res) => {
  const marketingAgreeTime = req.body.marketingAgree == true ? moment().format('YYYY-MM-DD HH:mm:ss') : null;
  await models.user.update(
    {
      MarketingAgree : req.body.marketingAgree,
      MarketingAgreeTime: marketingAgreeTime
    }
    , { where: { ID: req.body.id} },
  ).then(result => {
    console.log(URL + 'Update/Marketing user update Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Update/Marketing user update Failed' + err);
    res.status(400).send(null);
  })
});

router.post('/Select/Univ', async(req, res) => {
  await models.profileuniv.findOne({
    where : {
      PfUnivID: req.body.id
    }
  }).then(result => {
    console.log(URL + 'Select/Univ user Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Univ user Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Select/Career', async(req, res) => {
  await models.profilecareer.findOne({
    where : {
      PfCareerID: req.body.id
    }
  }).then(result => {
    console.log(URL + 'Select/Career user Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Career user Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Select/License', async(req, res) => {
  await models.profilelicense.findOne({
    where : {
      PfLincenseID: req.body.id
    }
  }).then(result => {
    console.log(URL + 'Select/License user Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/License user Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Select/Win', async(req, res) => {
  await models.profilewin.findOne({
    where : {
      PfWinID: req.body.id
    }
  }).then(result => {
    console.log(URL + 'Select/Win user Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Win user Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/InsertOrUpdate/Links', async(req, res) => {
  var personalLinks = await models.PersonalLinks.findOne({
    where : {
      UserID : req.body.userID
    }
  });

  if(globalRouter.IsEmpty(personalLinks)){
    await models.PersonalLinks.create({
      UserID : req.body.userID,
      Portfolio : req.body.portfolio,
      Resume : req.body.resume,
      Site : req.body.site,
      LinkedIn : req.body.linkedin,
      Instagram : req.body.instagram,
      Facebook : req.body.facebook,
      Github : req.body.github,
      Notion : req.body.notion
    }).then(result => {
      console.log(URL + 'InsertOrUpdate/Links PersonalLinks create Success' + result);
      res.status(200).send(result);
    }).catch(err => {
      globalRouter.logger.error(URL + 'InsertOrUpdate/Links PersonalLinks create Failed' + err);
      res.status(400).send(null);
    })
  }else{
    await models.PersonalLinks.update(
      {
        Portfolio : req.body.portfolio,
        Resume : req.body.resume,
        Site : req.body.site,
        LinkedIn : req.body.linkedin,
        Instagram : req.body.instagram,
        Facebook : req.body.facebook,
        Github : req.body.github,
        Notion : req.body.notion
      },
      {
        where : {
          UserID : req.body.userID,
        }
      }
    ).then(result => {
      console.log(URL + 'InsertOrUpdate/Links PersonalLinks update Success' + result);
      res.status(200).send(result);
    }).catch(err => {
      globalRouter.logger.error(URL + 'InsertOrUpdate/Links PersonalLinks update Failed' + err);
      res.status(400).send(null);
    })
  }
})

router.post('/Insert/Coupon', async(req, res) => {

  let basicCoupon = await models.BasicCoupon.findOne({where : {id : req.body.couponID}});

  if(basicCoupon.RemainedCount == 0){
    console.log(URL + '/Insert/Coupon we dont have remained ' + basicCoupon.id + ' coupon');

    let resData = {
      res : 'LIMIT'
    };    

    res.status(200).send(resData);
  }else{
    await models.PersonalCoupon.findOrCreate({
      where: {
          UserID : req.body.userID,
          Type : req.body.type,
          CouponID : req.body.couponID
      },
      defaults: {
        UserID : req.body.userID,
        Type : req.body.type,
        CouponID : req.body.couponID,
      }
    }).then(async result => {
      if(result[1]){
        console.log(URL + 'Insert/Coupon findOrCreate Success');
  
        //쿠폰 갯수 줄이기
        basicCoupon.update({
          RemainedCount : basicCoupon.RemainedCount - 1
        });
  
        let resData = {
          res : 'SUCCESS'
        };    
  
        res.status(200).send(resData);
      }else{
        //limit coupon 사용처, coupon title로  이미 발급 받았는지 확인해야함.
        console.log(URL + 'Insert/Coupon findOrCreate Already Have');
  
        let resData = {
          res : 'ALREADY'
        };    
  
        res.status(200).send(resData);
      }
    }).catch(err => {
      globalRouter.logger.error(URL + 'Insert/Coupon findOrCreate Failed' + err);
      res.status(400).send(null);
    })
  }
})

router.post('/Select/Coupon', async(req, res) => {

  let resData = [];
  await models.PersonalCoupon.findAll({
    where : {
      UserID : req.body.userID
    },
    order : [
      ['createdAt', 'DESC']
    ],
  }).then(async result => {
    console.log(URL + 'Select/Coupon findAll Success');

    //데이터가 없으면
    if(globalRouter.IsEmpty(result)){
      console.log(URL + 'Select/Coupon is empty');
      res.status(200).send(null);
    }else{
      for(var i = 0 ; i < result.length; ++i){
         //Basic

         var coupon;
        if(result[i].Type == 0){
          coupon = await models.BasicCoupon.findAll({where : {id : result[i].CouponID}});
        }else{
          coupon = await models.LimitCoupon.findAll({where : {id : result[i].CouponID}});
        }

        var id = result[i].id;
        var state = result[i].State;

        var temp = {
          id,
          state,
          coupon
        }

        resData.push(temp);
      }

      res.status(200).send(resData);
    }
  }).catch(err => {
    globalRouter.logger.error(URL + 'Select/Coupon PersonalCoupon findAll Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Check/Coupon/Remained', async(req, res) => {
  await models.BasicCoupon.findOne({
    where : {
      id : req.body.id
    }
  }).then(result => {
    console.log(URL + '/Check/Coupon/Remained BasicCoupon findOne Success');

    if(result.RemainedCount == 0){
      res.status(200).send(false);
    }else{
      res.status(200).send(true);
    }
  }).catch(err => {
    globalRouter.logger.error(URL + '/Check/Coupon/Remained BasicCoupon findOne Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Update/Coupon/State', async(req, res) => {
  await models.PersonalCoupon.update(
    {
      State : req.body.state
    },
    {
      where : { 
        id : req.body.id,
        UserID : req.body.userID
      }
    }
  ).then(result => {
    console.log(URL + '/Update/Coupon/State update is success');
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + '/Update/Coupon/State PersonalCoupon update Failed' + err);
    res.status(400).send(null);
  })
})

router.post('/Select/ContentsURL', async(req, res) => {
  await models.BasicCoupon.findOne({
    attributes: [ //여기없는데 필요한 부분 추가해야함
      'ContentsURL'
    ],
    where : {
      id : req.body.id
    }
  }).then(result => {
    console.log(URL + '/Select/ContentsURL BasicCoupon findOne success');
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + '/Select/ContentsURL BasicCoupon findOne Failed' + err);
    res.status(400).send(null);
  })
})

module.exports = router;