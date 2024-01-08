const router = require('express').Router(),
     { Op } = require('sequelize'),
     badgeFuncRouter = require('../badge/badgeFuncRouter'),
     moment = require('moment'),
    models = require('../../models');

const communityFuncRouter = require('../communitypost/communityPostFuncRouter');
const globalRouter = require('../global');

var badgeURL = '/Badge/';

router.get('/SelectTable', async (req, res) => {
    await models.PersonalBadgeTable.findAll({
    }).then(result => {
        console.log(badgeURL + "SelectTable Success " + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error("SelectTable Failed " + err);
        res.status(400).send(null);
    });
});

router.get('/SelectTeamTable', async (req, res) => {
    await models.TeamBadgeTable.findAll({
    }).then(result => {
        console.log(badgeURL + "SelectTeamTable Success " + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error("SelectTeamTable Failed " + err);
        res.status(400).send(null);
    });
});

router.post('/SelectTeamID', async ( req, res) => {
    await models.TeamBadgeList.findAll({
        where : {
            TeamID : req.body.teamID
        }
    }).then(result => {
        console.log(badgeURL + "SelectTeamID Success " + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(badgeURL + "SelectTeamID Failed " + err);
        res.status(400).send(null);
    });
});

router.post('/TEST', async (req, res) => {
    let body = req.body;

    models.user.findOne({
      where: {
        ID: body.id, //좌측에 있는 부분이 ..models/user.js 에 있는 변수명과 (테이블의 변수명과) 일치해야하는 부분이다.
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
          //attributes: [[models.sequelize.fn('COUNT', 'id'), 'ReplyCounts']],
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
        {
          model : models.PersonalSeekTeam,
          required: true,
          limit: 99
        },
        {
          model : models.team,
          required: true,
          limit: 99
        }
      ]
    }).then(async result => {
  
      //로그인 정보가 없을 때
      if(globalRouter.IsEmpty(result)){
        res.status(200).send(null);
        return;
      }

      for(var i = 0 ; i < result['teams'].length; ++i){
        console.log(result['teams'][i].id);
          await models.team.update(
              {
                "updatedAt" : moment()
              },
              {
                  where : {
                      id : result['teams'][i].id
                  }
              }
          ).then(result => {
              console.log('team login update success' + result);
          }).catch(err => {
              globalRouter.logger.err('team login update failed' + err);
          })
      }

      res.status(200).send(result);
    }).catch(err => {
      console.log(err);
      res.send(null);
    });
})

router.post('/Get/EventBadge', async(req, res) => {
  let badgedata = {
    id : req.body.id,
    userID : req.body.userID,
  }

  var InsertEventBadgeRes = await badgeFuncRouter.InsertEventBadge(badgedata);

  if(globalRouter.IsEmpty(InsertEventBadgeRes)){
    res.status(200).send(null);
  }else{
    res.status(200).send(InsertEventBadgeRes);
  }
})

module.exports = router;