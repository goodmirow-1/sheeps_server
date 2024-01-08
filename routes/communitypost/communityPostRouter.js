const { defaults } = require('underscore');

const router = require('express').Router(),
    models = require('../../models'),
    globalRouter = require('../global'),
    op = require('sequelize').Op,
    formidable = require('formidable'),
    fs_extra = require('fs-extra'),
    fcmFuncRouter = require('../fcm/fcmFuncRouter'),
    communityFuncRouter = require('./communityPostFuncRouter'),
    moment = require('moment'),
    badgeFuncRouter = require('../badge/badgeFuncRouter');
    
    const client = globalRouter.client;

var URL = '/CommunityPost/';

const LIKES_LIMIT = 100;
const POPULAR_BASE = 5;//인기글 최소 기준

router.get('/Select', async(req, res) => {
  await models.CommunityPost.findAll({
    limit : 30,
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    where: {
      IsShow : 1,
    }
  }).then(async result => {

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error("Select/JobGroupPost find Faield " + err);
    res.status(400).send(null);
  })
})

// 공지 게시글
router.get('/Select/Notice', async(req, res) => {
  await models.CommunityPost.findAll({
    limit : 2,
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    where: {
      IsShow : 1,
      Category : '공지',
    }
  }).then(async result => {

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error("Select/JobGroupPost find Faield " + err);
    res.status(400).send(null);
  })
})

router.get('/Select/Hot', async(req, res) => {
  await models.CommunityPost.findAll({
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    //24시간 검색
    where: {
      IsShow : 1,
      createdAt : {
        [op.gte] : moment().subtract(24, 'H').toDate()
      },
    }
  }).then(async result => {

    var haveLikeCommunityList = [];

    var nowToMin = ((parseInt(moment().format("H")) * 60) + parseInt(moment().format("mm")));

    for(var i = 0 ; i < result.length ; i++){
      if(result[i]['CommunityLikes'].length > 0){
        var replies = await models.CommunityReply.findAll({where : {PostID : result[i].id}});
        var repliesLength = replies.length;
        var declares = await models.CommunityDeclare.findAll({where : {TargetID : result[i].id}});
        var declareLength = declares.length;
        var create = result[i].createdAt.toString();
        var minDiff = nowToMin - ((parseInt(create.substring(16,18)) * 60) + parseInt(create.substring(19,21)));
        if(minDiff < 0) minDiff = minDiff + (24 * 60);
        var score = ((result[i]['CommunityLikes'].length - declareLength) * 3) + repliesLength - (minDiff * 0.05);

        if(score > 0){
          result[i].score = score;
          haveLikeCommunityList.push(result[i]);
        }
      }
    }

    haveLikeCommunityList.sort(function (a,b) {
      return b.score - a.score;
    });

    var resData = [];
    //핫 게시글 5개
    var max = 5;

    if(max > haveLikeCommunityList.length) max = haveLikeCommunityList.length;

    for(var i = 0 ; i < max; ++i){
      resData.push(haveLikeCommunityList[i]);
    }

    let communityData = {
      community : resData
    }

    console.log(URL + "Select/Hot find Success " + resData);
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/Hot find Faield" + err);
    res.status(400).send(null);
  })
});

router.get('/Select/Popular', async(req, res) => {
  let resData = [];
  var popularBase = POPULAR_BASE;
  await models.CommunityPost.findAll({
    limit : 100,//100개 검색해서 기준 통과 글들만 보내줌
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    where: {
      IsShow : 1,
    }
  }).then(async result => {
    for(var i = 0 ; i < result.length; ++i){
      var replies = await models.CommunityReply.findAll({where : {PostID : result[i].id}});
      var repliesLength = replies.length;
      var likes = await models.CommunityLike.findAll({where : {PostID : result[i].id}});
      var likesLength = likes.length;
      var declares = await models.CommunityDeclare.findAll({where : {TargetID : result[i].id}});
      var declareLength = declares.length;
      if((likesLength - declareLength) >= popularBase){
        var community = result[i];

        var temp = {
          community,
          repliesLength,
          declareLength
        }
        resData.push(temp);
      }
    }

    console.log(URL + "/Select/Popular find Success " + resData);

    if(globalRouter.IsEmpty(resData))
      resData = null;

    res.status(200).send(resData);
  }).catch( err => {
    globalRouter.logger.error("/Select/Popular find Faield " + err);
    res.status(400).send(null);
  })
})

router.post('/Select/Category', async(req, res) => {
  await models.CommunityPost.findAll({
    limit : 30,
    order : [
      ['createdAt', 'DESC']
    ],
    where: {
      Category : req.body.category,
      IsShow : 1
    },
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
  }).then(async result => {
    console.log(URL + "Select/Category find Success " + result);

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/Category find Faield " + err);
    res.status(200).send(null);
  })
})

router.post('/Select/Category/Hot', async(req, res) => {
  await models.CommunityPost.findAll({
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    //24시간 검색
    where: {
      IsShow : 1,
      Category : req.body.category,
      createdAt : {
        [op.gte] : moment().subtract(24, 'H').toDate()
      },
    }
  }).then(async result => {
    var haveLikeCommunityList = [];

    var nowToMin = ((parseInt(moment().format("H")) * 60) + parseInt(moment().format("mm")));

    for(var i = 0 ; i < result.length ; i++){
      if(result[i]['CommunityLikes'].length > 0){
        var replies = await models.CommunityReply.findAll({where : {PostID : result[i].id}});
        var repliesLength = replies.length;
        var declares = await models.CommunityDeclare.findAll({where : {TargetID : result[i].id}});
        var declareLength = declares.length;
        var create = result[i].createdAt.toString();
        var minDiff = nowToMin - ((parseInt(create.substring(16,18)) * 60) + parseInt(create.substring(19,21)));
        if(minDiff < 0) minDiff = minDiff + (24 * 60);
        var score = ((result[i]['CommunityLikes'].length - declareLength) * 3) + repliesLength - (minDiff * 0.05);

        if(score > 0){
          result[i].score = score;
          haveLikeCommunityList.push(result[i]);
        }
      }
    }

    haveLikeCommunityList.sort(function (a,b) {
      return b.score - a.score;
    });

    var resData = [];
    //핫 게시글 2개
    var max = 2;

    if(max > haveLikeCommunityList.length) max = haveLikeCommunityList.length;

    for(var i = 0 ; i < max; ++i){
      resData.push(haveLikeCommunityList[i]);
    }

    let communityData = {
      community : resData
    }

    console.log(URL + "Select/Categoty/Hot find Success " + resData);
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/Category/Hot find Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/Select/Reply', async(req, res) => {
  await models.CommunityReplyReply.findAll({
    where : {
      ReplyID : req.body.replyID
    },
    include:[
      { 
        model : models.CommunityReplyReplyLike , 
        required: true , 
        limit: LIKES_LIMIT
      },
      {
        attributes : ['id'],
        model : models.CommunityReplyReplyDeclare, 
        required: true , 
        limit: LIKES_LIMIT
      }
    ]
  }).then(async result => {
    console.log(URL + '/Select/Reply find Success' + result);
    res.status(200).send(result);
  }).catch(err => {
    globalRouter.logger.error(URL + "Select/Reply find Faield" + err);
    res.status(400).send(null);
  })
})

router.get('/Select/BasicPost', async(req, res) => {
  await models.CommunityPost.findAll({
    limit : 30,
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
      { 
        model : models.CommunityReply , 
        required: true , 
        limit: LIKES_LIMIT
      },
    ],
    where: {
      IsShow : 1,
    }
  }).then( result => {
    console.log(URL + "Select/BasicPost find Success " + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/BasicPost find Faield " + err);
    res.status(200).send(null);
  })
})

router.get('/Select/JobGroupPost', async(req, res) => {
  await models.CommunityPost.findAll({
    limit : 30,
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
      { 
        model : models.CommunityReply , 
        required: true , 
        limit: LIKES_LIMIT
      },
    ],
    where: {
      IsShow : 1,
      //[op.or] : [{Category: "개발"}, {Category: "경영"}, {Category: "디자인"}, {Category: "마케팅"}, {Category: "자영업"}]
    }
  }).then( result => {
    console.log(URL + "Select/JobGroupPost find Success " + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error("Select/JobGroupPost find Faield " + err);
    res.status(400).send(null);
  })
})

router.post('/SelectID', async(req, res) => {

  let communityID = {
    id : req.body.id
    }

  res.json(await communityFuncRouter.GetPostByID(communityID));
})

router.post('/SelectUser', async(req, res) => {
  let userID = {
    userID : req.body.userID
  }

  res.json(await communityFuncRouter.GetPostByUserID(userID));
})

router.post('/Reply/SelectUser', async(req, res) => {

  let reply = await models.CommunityReply.findAll(
    {
      where: {
        UserID: req.body.userID,
        IsShow : 1
      },
      order: [
        ['id', 'DESC']
      ],
    }
  );

  if(globalRouter.IsEmpty(reply)){
    console.log(URL + '/Reply/SelectUser is Empty');
    res.status(200).send(null);
    return;
  }

  var resData = [];
  for(let i = 0 ; i < reply.length; ++i){
    await models.CommunityPost.findOne({
      where: {
        id : reply[i].PostID,
        IsShow : 1
      },
      order: [
        ['id', 'DESC']
      ],
      include: [
        { 
          model : models.CommunityLike , 
          required: true, 
          limit: LIKES_LIMIT,
        },
      ],
    }).then( async result => {
      console.log('/Reply/SelectUser second Succesced' + result);
      if (false == globalRouter.IsEmpty(result)) {
        if(resData.length > 0){
          var isHave = false;
          for(let j = 0; j < resData.length; ++j){
            if(resData[j]['community'].id == result.id){
              isHave = true;
              break;
            }
          }

          if(false == isHave) {
            let communityData = {
              community : result
            }

            resData.push(await communityFuncRouter.GetCommunityData(communityData));
          }
        }else{
          //처음데이터 push
          let communityData = {
            community : result
          }

          resData.push(await communityFuncRouter.GetCommunityData(communityData));
        }
    }

      if (i == (reply.length - 1)) {

          if (globalRouter.IsEmpty(resData))
              resData = null;

          res.status(200).send(resData);
          return;
      }
    }).catch( err => {
      globalRouter.logger.error(URL + "Reply/SelectUser find Faield " + err);
      res.status(404).send(null);
    })
  }
})

router.post('/SelectOffset', async ( req, res ) => {
  let offset = req.body.index * 1;
  let limit = 30;

  await models.CommunityPost.findAll({
    offset: offset,
    limit: limit,
    order: [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    where : {
      IsShow : 1
    }
  }).then(async result => {
    console.log(URL + "SelectOffset find Success" + result);

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "SelectOffset find Faield " + err);
    res.status(404).send(null);
  })
})

router.post('/Select/NewOffset', async ( req, res ) => {
  await models.CommunityPost.findAll({
    offset: req.body.index * 1,
    limit: req.body.limit * 1,
    order: [
      ['id', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
      { 
        model : models.CommunityReply , 
        required: true , 
        limit: LIKES_LIMIT
      },
    ],
    where: {
      IsShow : 1,
      [op.or] : [{Category: "스타트업"}, {Category: "비밀"}, {Category: "홍보"}, {Category: "자유"}, {Category: "소모임"}]
    }
  }).then( result => {
    console.log(URL + "SelectBasicOffset find Success " + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "SelectBasicOffset find Faield " + err);
    res.status(404).send(null);
  })
})

router.post('/Select/PopularOffset', async ( req, res ) => {
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
        limit: LIKES_LIMIT,
      },
      { 
        model : models.CommunityReply , 
        required: true , 
        limit: LIKES_LIMIT
      },
    ],
    where: {
      IsShow : 1,
      [op.or] : [{Category: "개발"}, {Category: "경영"}, {Category: "디자인"}, {Category: "마케팅"}, {Category: "자영업"}]
    }
  }).then( result => {
    console.log(URL + "SelectJobGroupOffset find Success " + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error("SelectJobGroupOffset find Faield " + err);
    res.status(404).send(null);
  })
})

router.post('/Select/Offset/Popular', async(req, res) => {
  let offset = req.body.index * 100;//100개씩 건너뛰며 검색 index로 offset 호출한 횟수 받음.
  let resData = [];
  var popularBase = POPULAR_BASE;
  await models.CommunityPost.findAll({
    offset: offset,
    limit : 100,
    order : [
      ['createdAt', 'DESC']
    ],
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
    where: {
      IsShow : 1,
    }
  }).then(async result => {
    for(var i = 0 ; i < result.length; ++i){
      var replies = await models.CommunityReply.findAll({where : {PostID : result[i].id}});
      var repliesLength = replies.length;
      var likes = await models.CommunityLike.findAll({where : {PostID : result[i].id}});
      var likesLength = likes.length;
      var declares = await models.CommunityDeclare.findAll({where : {TargetID : result[i].id}});
      var declareLength = declares.length;
      if((likesLength - declareLength) >= popularBase){
        var community = result[i];

        var temp = {
          community,
          repliesLength,
          declareLength
        }
        resData.push(temp);
      }
    }

    console.log(URL + "/Select/Offset/Popular find Success " + resData);

    if(globalRouter.IsEmpty(resData))
      resData = null;

    res.status(200).send(resData);
  }).catch( err => {
    globalRouter.logger.error("/Select/Offset/Popular find Faield " + err);
    res.status(400).send(null);
  })
})

router.post('/Select/Offset/Category', async ( req, res ) => {
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
        limit: LIKES_LIMIT,
      },
    ],
    where : {
      IsShow : 1,
      Category : req.body.category,
    }
  }).then(async result => {
    console.log(URL + "/Select/Offset/Category find Success " + result);

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/Offset/Category find Faield" + err);
    res.status(404).send(null);
  })
})

router.post('/PostSelect', async(req, res) => {
  let body = req.body;

  await models.CommunityPost.findOne({
    where: {
      id : body.id
    }
  }).then(async result => {
    if(globalRouter.IsEmpty(result) || result.IsShow == 0){
      console.log("is Empty or Delete Post");
      res.json(null);
    }else{
      await models.CommunityReply.findAll({
        where: {
          PostID : body.id,
        },
        include: [
          { 
            model : models.CommunityReplyLike , 
            required: true, 
            limit: LIKES_LIMIT
          },
          {
            attributes : ['id'],
            model : models.CommunityReplyDeclare , 
            required: true, 
            limit: LIKES_LIMIT
          },
          { 
            model : models.CommunityReplyReply , 
            required: true , 
            limit: LIKES_LIMIT,
            include:[
              { 
                model : models.CommunityReplyReplyLike , 
                required: true , 
                limit: LIKES_LIMIT
              },
              {
                attributes : ['id'],
                model : models.CommunityReplyReplyDeclare, 
                required: true , 
                limit: LIKES_LIMIT
              }
            ]
          },
        ],
      }).then( result => {
        console.log(URL + "PostSelect CommunityReply findAll Success " + result);
        res.status(200).send(result);
      }).catch( err => {
        globalRouter.logger.error(URL + "PostSelect CommunityReply findAll Faield" + err);
        res.status(404).send(null);
      })
    }
  }).catch(err => {
    globalRouter.logger.error(URL + "PostSelect find Faield" + err);
    res.status(404).send(null);
  })
})

router.post('/InsertReply', async(req, res) => {
  let body = req.body;

  let post = await models.CommunityPost.findOne({
    where: {
      id : body.postID
    }
  });

  if(!post){
    res.status(200).send(result);
    return;
  }

  //삭제된 게시물
  if(post.IsShow == 0){
    globalRouter.logger.error(URL + "InsertReply is Empty or Delete Post");
    res.status(404).send(null);
    return;
  }

  await models.CommunityReply.create({
    UserID : body.userID,
    PostID : body.postID,
    Contents : body.contents
  }).then( async result => {
    let userData = {
      userID : body.userID
    }

    let communityCount = await communityFuncRouter.PostCount(userData);

    let badgedata = {
      category : 1,
      part : '커뮤니티',
      value : communityCount
    }

    let badgeTable = await badgeFuncRouter.SelectlevelBadge(badgedata);

    if(badgeTable != null && communityCount > badgeTable.Condition){
      let badgeIdData = {
        badgeID : badgeTable.id,
        userID : body.userID
      }
      await badgeFuncRouter.Insert(badgeIdData);
    }

    //작성한 댓글에 대한 알림 구독
    await models.CommunityReplySubscriber.findOrCreate({
      where : {
        ReplyID : result.id,
        UserID : req.body.userID,
      },
      defaults : {
        ReplyID : result.id,
        UserID : req.body.userID,
      }
    }).then(result => {
      console.log(URL + 'CommunityReplySubscriber findOrCreate Success');
    }).catch(err => {
      globalRouter.logger.error(URL + "CommunityReplySubscriber findOrCreate Faield" + err);
    })

    await models.CommunitySubscriber.findAll({
      where : {
        PostID : body.postID
      }
    }).then(async subResult => {
      console.log(URL + 'CommunitySubscriber findAll Success');

      for(var i = 0 ; i < subResult.length; ++i){
        if(subResult[i].UserID == body.userID) continue;

        var tempData = subResult[i];
        client.hgetall(String(subResult[i].UserID), async function(err, obj) {
          if(err) throw err;
          if(obj == null) return;
  
          var user = await models.user.findOne({where: {UserID: body.userID}});
  
          var name = post.Category == '비밀' ? '익명' : user.Name;
  
          var data = JSON.stringify({
              userID : body.userID,
              inviteID : tempData.UserID,
              title : "새로운 댓글",
              type : "POST_REPLY",
              tableIndex : body.postID,
              body : name + "님이 댓글을 달았습니다.",
              isSend : obj.isOnline,
              topic : 'CommunityID' + post.id,
              postID : post.Category,
          })
  
          if(fcmFuncRouter.SendFcmEvent( data )){
            console.log(URL + 'InsertReply fcm is true');
            return;
          }else{
            console.log(URL + 'InsertReply fcm is false');
            return;
          }
        });
      }

      res.status(200).send(result);
    }).catch(err => {
      console.log(URL + 'CommunitySubscriber findAll Failed' +  err);
      res.status(400).send(null);
    })
  }).catch( err => {
    globalRouter.logger.error(URL + "InsertReply Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/InsertReplyReply', async(req, res) => {
  let body = req.body;

  let reply = await models.CommunityReply.findOne({
    where: {
      id : body.replyID
    }
  });

  if(globalRouter.IsEmpty(reply)){
    res.status(200).send(result);
    return;
  }

  let replyPost = await models.CommunityPost.findOne({
    where: {
      id : reply.PostID
    }
  });

  if(replyPost.IsShow == 0){
    globalRouter.logger.error( URL + "InsertReplyReply is Empty or Delete Post");
    res.status(400).send(null);
    return;
  }

  await models.CommunityReplyReply.create({
    UserID : body.userID,
    ReplyID : body.replyID,
    Contents : body.contents
  }).then(async result => {
    let userData = {
      userID : body.userID
    }

    let communityCount = await communityFuncRouter.PostCount(userData);

    let badgedata = {
      category : 1,
      part : '커뮤니티',
      value : communityCount
    }

    let badgeTable = await badgeFuncRouter.SelectlevelBadge(badgedata);

    if(badgeTable != null && communityCount > badgeTable.Condition){
      let badgeIdData = {
        badgeID : badgeTable.id,
        userID : body.userID
      }
      await badgeFuncRouter.Insert(badgeIdData);
    }

    var post = await models.CommunityReply.findOne({where : {id : body.replyID}});

    await models.CommunityReplySubscriber.findAll({
      where : {
        ReplyID : body.replyID
      }
    }).then(async subResult => {
      console.log(URL + 'CommunityReplySubscriber findAll Success');

      for(var i = 0 ; i < subResult.length; ++i){
        if(subResult[i].UserID == body.userID) continue;

        var tempData = subResult[i];
        client.hgetall(String(subResult[i].UserID), async function(err, obj) {
          if(err) throw err;
          if(obj == null) return;
  
          var user = await models.user.findOne({where: {UserID: body.userID}});
  
          var name = replyPost.Category == '비밀' ? '익명' : user.Name;
  
            var data = JSON.stringify({
              userID : body.userID,
              inviteID : tempData.UserID,
              title : "대댓글",
              type : "POST_REPLY_REPLY",
              tableIndex : reply.PostID,
              targetIndex : reply.id,
              body : name + "님이 대댓글을 달았습니다.",
              isSend : obj.isOnline,
              topic : 'CommunityID' + post.id,
              postID : reply.Category,
          })
  
          if(fcmFuncRouter.SendFcmEvent( data )){
            console.log(URL + 'InsertReply fcm is true');
            return;
          }else{
            console.log(URL + 'InsertReply fcm is false');
            return;
          }
        });
      }

      res.status(200).send(result);
    }).catch(err => {
      console.log(URL + 'CommunityReplySubscriber findAll Failed' +  err);
      res.status(400).send(null);
    })
  }).catch( err => {
    globalRouter.logger.error(URL + "InsertReplyReply Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/InsertLike', async(req, res) => {
  let body = req.body;

  globalRouter.CreateOrDestroy(models.CommunityLike,
    {
      UserID : body.userID,
      PostID : body.postID,
    }, 
  ).then(async function(result) {
    if(result['created'] == true){

      // var post = await models.CommunityPost.findOne({where : {id : body.postID}})

      // if(globalRouter.IsEmpty(post)){
      //   res.status(200).send(result);
      //   return;
      // }

      // //자기자신이면 건너뜀
      // if(post.UserID == body.userID){
      //   res.status(200).send(result);
      //   return;
      // }

      // client.hgetall(String(post.UserID), async function(err, obj) {
      //   if(err) throw err;
      //   if(obj == null) return;

      //   var user = await models.user.findOne({where: {UserID: body.userID}});

      //   var name = post.Category == '비밀' ? '익명' : user.Name;
   
      //   var data = JSON.stringify({
      //       userID : body.userID,
      //       inviteID : post.UserID,
      //       title : "게시글",
      //       type : "POST_LIKE",
      //       tableIndex : body.postID,
      //       body : name + "님이 좋아요 를 눌렀습니다.",
      //       isSend : obj.isOnline,
      //       topic : 'COMMUNITY',
      //       postID : post.Category,
      //   })  
  
      //   if(fcmFuncRouter.SendFcmEvent( data )){
      //     console.log(URL + 'InsertLike fcm is true');
      //     res.status(200).send(result);
      //     return;
      //   }else{
      //     console.log(URL + 'InsertLike fcm is false');
      //     res.status(400).send(result);
      //     return;
      //   }
      // });
    }

    res.status(200).send(result);
  }).catch(function (err){
    globalRouter.logger.error(URL + "InsertLike Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/SelectUserLike', async(req, res) => {
  await models.CommunityLike.findAll({
    where :{
      UserID : req.body.userID,
    },
    order: [
      ['id', 'DESC']
    ],
  }).then( async result =>  {
    console.log('/CommunityPosts/SelectUserLike succesced');
    if(globalRouter.IsEmpty(result)){
      console.log('DATA EMPTY');
      res.status(400).send(null);
      return;
    }

    var resData = [];
    for (let i = 0; i < result.length; ++i) {
      await models.CommunityPost.findOne({
          where: {
            id: result[i].PostID,
          },
          order: [
              ['id', 'DESC']
          ],
          include: [
            { 
              model : models.CommunityLike , 
              required: true, 
              limit: LIKES_LIMIT,
            },
          ],
      }).then(async result2 => {
          if (false == globalRouter.IsEmpty(result2)) {

            var replies = await models.CommunityReply.findAll({where : {PostID : result2.id}});
            var declares = await models.CommunityDeclare.findAll({where : {TargetID : result2.id}});
            var repliesLength = replies.length;
            var declareLength = declares.length;
            var community = result2;

            var data = {
              community,
              repliesLength,
              declareLength
            }

            resData.push(data);
          }

          if (i == (result.length - 1)) {
              if (globalRouter.IsEmpty(resData))
                  resData = null;

              res.status(200).send(resData);
              return;
          }
      }).catch(err => {
        globalRouter.logger.error(URL + 'SelectUserLike second Failed' + err);
        res.status(400).send(null);
      });
    }

  }).catch( err => {
    globalRouter.logger.error(URL + 'SelectUserLike Failed ' + err);
    res.status(400).send(null);
  })
})

router.post('/InsertReplyLike', async(req, res) => {
  let body = req.body;

  globalRouter.CreateOrDestroy(models.CommunityReplyLike,
    {
      UserID : body.userID,
      ReplyID : body.replyID,
    }, 
  ).then(async function(result) {
    if(result['created'] == true){
      // var post = await models.CommunityReply.findOne({where : {id : body.replyID}})

      // if(globalRouter.IsEmpty(post)){
      //   res.status(400).send(result);
      //   return;
      // }

      // //자기자신이면 건너뜀
      // if(post.UserID == body.userID){
      //   res.status(200).send(result);
      //   return;
      // }

      // client.hgetall(String(post.UserID), async function(err, obj) {
      //   if(err) throw err;
      //   if(obj == null) return;

      //   var user = await models.user.findOne({where: {UserID: body.userID}});

      //   var name = post.Category == '비밀' ? '익명' : user.Name;

      //   var data = JSON.stringify({
      //     userID : body.userID,
      //     inviteID : post.UserID,
      //     title : "댓글",
      //     type : "POST_REPLY_LIKE",
      //     tableIndex : post.PostID,
      //     body : name + "님이 좋아요 를 눌렀습니다.",
      //     isSend : obj.isOnline,
      //     topic : 'COMMUNITY',
      //     postID : post.Category
      //   })  

      //   if(fcmFuncRouter.SendFcmEvent( data )){
      //     console.log(URL + 'InsertReplyLike fcm is true');
      //     res.status(200).send(result);
      //     return;
      //   }else{
      //     console.log(URL + 'InsertReplyLike fcm is false');
      //     res.status(400).send(result);
      //     return;
      //   }
      // });
    }

    res.status(200).send(result);
  }).catch(function (err){
    globalRouter.logger.error(URL + "InsertReplyLike Faield" + err);
    res.status(400).send(null);
  })
});

//예전에 만들어둔 댓글 좋아요 리스트
router.post('/Reply/SelectUserLike', async(req, res) => {
  await models.CommunityReplyLike.findAll({
    where : {
      UserID : req.body.userID,
    },
    order: [
      ['id', 'DESC']
    ],
  }).then( async result =>  {
    if(globalRouter.IsEmpty(result)){
      globalRouter.logger.error(URL + 'Reply/SelectUserLike CommunityReplyLike is Empty');
      res.status(400).send(null);
      return;
    }

    var resData = [];
    for (let i = 0; i < result.length; ++i) {

      let reply = await models.CommunityReply.findOne({
        where: {
          id : result[i].ReplyID
        }
      })

      if(globalRouter.IsEmpty(reply)){
        globalRouter.logger.error(URL + 'Reply/SelectUserLike CommunityReply is empty');
        continue;
      }

      await models.CommunityPost.findOne({
          where: {
            id: reply.PostID,
          },
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
          ],
      }).then(result2 => {
          if (false == globalRouter.IsEmpty(result2)) {
              if(resData.length > 0){
                var isHave = false;
                for(let j = 0; j < resData.length; ++j){
                  var id = resData[j].id;
                  if(id == result2.id){
                    isHave = true;
                  }
                }

                if(false == isHave) resData.push(result2);

              }else{
                resData.push(result2);
              }
          }

          if (i == (result.length - 1)) {

              if (globalRouter.IsEmpty(resData))
                  resData = null;

              res.status(200).send(resData);
              return;
          }
      }).catch(err => {
        globalRouter.logger.error(URL + 'Reply/SelectUserLike second Failed' + err);
        res.status(400).send(null);
      });
  }

  }).catch( err => {
    globalRouter.logger.error(URL + 'Reply/SelectUserLike Failed ' + err);
    res.status(400).send(null);
  })
})

router.post('/InsertReplyReplyLike', async(req, res) => {
  let body = req.body;

  globalRouter.CreateOrDestroy(models.CommunityReplyReplyLike,
    {
      UserID : body.userID,
      ReplyReplyID : body.replyreplyID,
    }, 
  ).then(async function(result) {
    if(result['created'] == true){
      // var post = await models.CommunityReplyReply.findOne({where : {id : body.replyreplyID}})

      // if(globalRouter.IsEmpty(post)){
      //   globalRouter.logger.error(URL + 'InsertReplyReplyLike is empty');
      //   res.status(400).send(result);
      //   return;
      // }

      // //자기자신이면 건너뜀
      // if(post.UserID == body.userID){
      //   res.status(200).send(result);
      //   return;
      // }

      // client.hgetall(String(post.UserID), async function(err, obj) {
      //   if(err) throw err;
      //   if(obj == null) return;

      //   var user = await models.user.findOne({where: {id: body.userID}});

      //   var name = post.Category == '비밀' ? '익명' : user.Name;
    
      //   if(globalRouter.IsEmpty(user) == false){
      //       var data = JSON.stringify({
      //         userID : body.userID,
      //         inviteID : post.UserID,
      //         title : "대댓글",
      //         type : "POST_REPLY_REPLY_LIKE",
      //         tableIndex : post.PostID,
      //         body : name + "님이 좋아요를 눌렀습니다.",
      //         isSend : obj.isOnline,
      //         topic : 'COMMUNITY',
      //         postID : post.Category
      //     })  

      //     if(fcmFuncRouter.SendFcmEvent( data )){
      //       console.log(URL + 'InsertReplyReplyLike fcm is true');
      //       res.status(200).send(result);
      //       return;
      //     }else{
      //       console.log(URL + 'InsertReplyReplyLike fcm is false');
      //       res.status(400).send(result);
      //       return;
      //     }
      //   }
      // });
    }

    res.status(200).send(result);
  }).catch(function (err){
    globalRouter.logger.error(URL + "InsertReplyReplyLike Faield" + err);
    res.status(400).send(null);
  })

});

router.post('/SearchWord', async(req, res) => {
  let searchWord = req.body.searchWord;
  let offset = req.body.index * 1;
  let limit = 30;

  await models.CommunityPost.findAll({
    where: {
      [op.or] : [
        {
          Title :  {[op.like] : '%' + searchWord + '%'}
        },
        {
          Contents : {[op.like] : '%' + searchWord + '%'}
        }
      ],
      IsShow : 1
    },
    order : [
      ['updatedAt', 'DESC']
    ],
    limit: limit,
    offset: offset,
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
  }).then(async result => {
    console.log(URL + "SearchWord find Success");

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "SearchWord find Faield" + err);
    res.status(400).send(null);
  })
})

router.post('/SearchCategory', async(req, res) => {
  let category = req.body.category;
  let offset = req.body.index * 1;
  let limit = 30;

  await models.CommunityPost.findAll({
    where: {
      Category : category,
      IsShow : 1,
    },
    order : [
      ['updatedAt', 'DESC']
    ],
    limit: limit,
    offset: offset,
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
  }).then(async result => {
    console.log(URL + "SearchCategory find Success");

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "SearchCategory find Faield" + err);
    res.status(400).send(null);
  })
})

router.post('/SearchCategoryWithWord', async(req, res) => {
  let category = req.body.category;
  let searchWord = req.body.searchWord;
  let offset = req.body.index * 1;
  let limit = 30;

  await models.CommunityPost.findAll({
    where: {
      Category : category,
      Title : {
        [op.like] : '%' + searchWord + '%'
      },
      IsShow : 1
    },
    order : [
      ['updatedAt', 'DESC']
    ],
    limit: limit,
    offset: offset,
    include: [
      { 
        model : models.CommunityLike , 
        required: true, 
        limit: LIKES_LIMIT,
      },
    ],
  }).then(async result => {
    console.log(URL + "SearchCategoryWithWord find Success");

    let communityData = {
      community : result
    }
    
    res.status(200).send(await communityFuncRouter.GetCommunityDataList(communityData));
  }).catch( err => {
    globalRouter.logger.error(URL + "SearchCategoryWithWord find Faield" + err);
    res.status(400).send(null);
  })
})

router.get('/PopularPostSelect', async(req, res) => {

  await models.CommunityPost.findAll({
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
    ],
    //2주간 검색
    where: {
      IsShow : 1,
      createdAt : {
        [op.gte] : moment().subtract(14, 'days').toDate()
      },
    }
  }).then( result => {
    result.sort(function (a,b) {
      return (b['CommunityLikes'].length + b['CommunityReplies'].length) - (a['CommunityLikes'].length + a['CommunityReplies'].length);
    });

    // var data = [];
    // //인기 게시글 3개
    // var max = 3;

    // if(max > result.length) max = result.length;
    // for(var i = 0 ; i < max; ++i){
    //   data.push(result[i]);
    // }

    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "PopularPostSelect find Faield" + err);
    res.status(400).send(null);
  })
});

router.get('/Select/PopularBasicPost', async(req, res) => {

  await models.CommunityPost.findAll({
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
    ],
    //2주간 검색
    where: {
      IsShow : 1,
      createdAt : {
        [op.gte] : moment().subtract(14, 'days').toDate()
      },
      //[op.or] : [{Category: "스타트업"}, {Category: "비밀"}, {Category: "홍보"}, {Category: "자유"}, {Category: "소모임"}]
    }
  }).then( result => {
    result.sort(function (a,b) {
      return (b['CommunityLikes'].length + b['CommunityReplies'].length) - (a['CommunityLikes'].length + a['CommunityReplies'].length);
    });

    // var data = [];
    // //인기 게시글 3개
    // var max = 3;

    // if(max > result.length) max = result.length;
    // for(var i = 0 ; i < max; ++i){
    //   data.push(result[i]);
    // }

    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/PopularBasicPost find Faield" + err);
    res.status(400).send(null);
  })
});

router.get('/Select/PopularJobGroupPost', async(req, res) => {

  await models.CommunityPost.findAll({
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
    ],
    //2주간 검색
    where: {
      IsShow : 1,
      createdAt : {
        [op.gte] : moment().subtract(14, 'days').toDate()
      },
      //[op.or] : [{Category: "개발"}, {Category: "경영"}, {Category: "디자인"}, {Category: "마케팅"}, {Category: "자영업"}]
    }
  }).then( result => {
    result.sort(function (a,b) {
      return (b['CommunityLikes'].length + b['CommunityReplies'].length) - (a['CommunityLikes'].length + a['CommunityReplies'].length);
    });

    // var data = [];
    // //인기 게시글 3개
    // var max = 3;

    // if(max > result.length) max = result.length;
    // for(var i = 0 ; i < max; ++i){
    //   data.push(result[i]);
    // }

    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "Select/PopularJobGroupPost find Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/Delete', async (req, res) => {
  await models.CommunityPost.update(
    {
      IsShow : 0
    },{
      where: {
        id : req.body.id
      },
    }
  ).then( async result => {
    console.log(URL + 'Delete Success' + result);

    //구독중인 목록 삭제
    await models.CommunitySubscriber.destroy({
      where : {
        PostID : req.body.id
      }
    }).then(subResult => {
      console.log(URL + 'CommunitySubscriber destroy success');
    }).catch(err=> {
      globalRouter.logger.error(URL + 'CommunitySubscriber destroy Failed' + err);  
    })

    res.status(400).send(true);
  }).catch( err => {
    globalRouter.logger.error(URL + 'Delete Failed' + err);
    res.status(200).send(null);
  })
});

router.post('/Declare', async (req, res) => {

  switch(req.body.postType){
    case 0:
      {
        await models.CommunityDeclare.findOrCreate({
          where: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
          },
          defaults: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
            Contents : req.body.contents,
            Type : req.body.type
          }
        }).then( result => {
          console.log(URL + "/Declare findOrCreate Success" + result);
          res.status(200).send(result);
        }).catch( err => {
          globalRouter.logger.error(URL + "/Declare findOrCreate Faield" + err);
          res.status(400).send(null);
        })
      }
      break;
    case 1:
      {
        await models.CommunityReplyDeclare.findOrCreate({
          where: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
          },
          defaults: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
            Contents : req.body.contents,
            Type : req.body.type
          }
        }).then( result => {
          console.log(URL + "/Declare CommunityReplyDeclare findOrCreate Success" + result);
          res.status(200).send(result);
        }).catch( err => {
          globalRouter.logger.error(URL + "/Declare CommunityReplyDeclare findOrCreate Faield" + err);
          res.status(400).send(null);
        })
      }
      break;
    case 2:
      {
        await models.CommunityReplyReplyDeclare.findOrCreate({
          where: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
          },
          defaults: {
            UserID : req.body.userID,
            TargetID : req.body.targetID,
            Contents : req.body.contents,
            Type : req.body.type
          }
        }).then( result => {
          console.log(URL + "/Declare CommunityReplyReplyDeclare findOrCreate Success" + result);
          res.status(200).send(result);
        }).catch( err => {
          globalRouter.logger.error(URL + "/Declare CommunityReplyReplyDeclare findOrCreate Faield" + err);
          res.status(400).send(null);
        })
      }
      break;
  }
});

//게시글 알림
router.post('/Update/Subscribe', async(req, res)=>{
  globalRouter.CreateOrDestroy(models.CommunitySubscriber,
    {
      PostID : req.body.postID,
      UserID : req.body.userID,
    }
  ).then( result => {
    console.log(URL + "/Update/Subscribe CommunitySubscriber findOrCreate Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Update/Subscribe CommunitySubscriber findOrCreate Faield" + err);
    res.status(400).send(null);
  })
})

router.post('/Select/Subscribe', async(req, res) => {
  await models.CommunitySubscriber.findOne({
    where : {
      PostID : req.body.postID,
      UserID : req.body.userID,
    }
  }).then( result => {
    console.log(URL + "/Select/Subscribe CommunitySubscriber findOne Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Select/Subscribe CommunitySubscriber findOne Faield" + err);
    res.status(400).send(null);
  })
})

//게시글 댓글 알림
router.post('/Update/ReplySubscribe', async(req, res)=>{
  globalRouter.CreateOrDestroy(models.CommunityReplySubscriber,
    {
      ReplyID : req.body.replyID,
      UserID : req.body.userID,
    }
  ).then( result => {
    console.log(URL + "/Update/Subscribe CommunitySubscriber findOrCreate Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Update/Subscribe CommunitySubscriber findOrCreate Faield" + err);
    res.status(400).send(null);
  })
})

router.post('/Select/ReplySubscribe', async(req, res) => {
  await models.CommunityReplySubscriber.findOne({
    where : {
      ReplyID : req.body.replyID,
      UserID : req.body.userID,
    }
  }).then( result => {
    console.log(URL + "/Select/Subscribe CommunitySubscriber findOne Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Select/Subscribe CommunitySubscriber findOne Faield" + err);
    res.status(400).send(null);
  })
})

router.post('/Update/IsShow/Reply', async(req, res) => {
  await models.CommunityReply.update(
    {
      IsShow : req.body.isShow
    },
    {
      where : {
        id : req.body.id
      }
    }
  ).then(result => {
    console.log(URL + "/Update/IsShow/Reply update Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Update/IsShow/Reply update Faield" + err);
    res.status(400).send(null);
  })
});

router.post('/Update/IsShow/ReplyReply', async(req, res) => {
  await models.CommunityReplyReply.update(
    {
      IsShow : req.body.isShow
    },
    {
      where : {
        id : req.body.id
      }
    }
  ).then(result => {
    console.log(URL + "/Update/IsShow/Reply update Success" + result);
    res.status(200).send(result);
  }).catch( err => {
    globalRouter.logger.error(URL + "/Update/IsShow/Reply update Faield" + err);
    res.status(400).send(null);
  })
});

module.exports = router;