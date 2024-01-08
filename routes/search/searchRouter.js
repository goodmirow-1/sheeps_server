//main
const router = require('express').Router(),
    models = require('../../models'),
    globalRouter = require('../global');

const { Op } = require('sequelize');

var URL = '/Search/';

router.post("/ProfileFilter", function (req, res, next) {
  let PartSearch = req.body.partSearch
  let LocationSearch = req.body.locationSearch
  let PartCheckall = req.body.partcheckall
  let LocationCheckall = req.body.locationcheckall
  let OrderRule = req.body.orderrule

  var order = 'updatedAt';

  if(OrderRule == 2) order = 'createdAt';

  var rule = {};

  if(PartCheckall == 0){
    rule = {
      [Op.or]: [
        {
            Job: {
                [Op.regexp]: '^' + PartSearch
            }
        }
        ,
        {
            SubJob: {
                [Op.regexp]: '^' + PartSearch
            }
        }
      ]
    }
  }

  if(LocationCheckall == 0){
    rule.Location = {
      [Op.regexp]: '^' + LocationSearch
    }
  }

  rule.PhoneAuth = {
    [Op.ne] : null
  }

  //보유 뱃지 순이 아닐 때
  if(OrderRule != 1){
    models.user.findAll({
      limit: 30,
      offset : req.body.index * 1,
      order: [[order, 'DESC']],
      where: rule,
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
        console.log(URL + 'ProfileFilter Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'ProfileFilter Failed' + err);
        res.status(400).send(null);
    })
  }else{
    models.user.findAll({
      attributes: [
        "UserID",
        "ID",
        "Name",
        "Information",
        "Job",
        "Part",
        "SubJob",
        "SubPart",
        "Location",
        "SubLocation",
        "Badge1",
        "Badge2",
        "Badge3",
        "createdAt",
        "updatedAt",
        [
          models.Sequelize.literal('(SELECT COUNT(*) FROM PersonalBadgeLists WHERE user.UserID = PersonalBadgeLists.UserID)'), 'BadgeCount'
        ]
      ],
      limit: 30,
      offset : req.body.index * 1,
      order: [[models.Sequelize.literal('BadgeCount'), 'DESC']],
      where: rule,
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
        console.log(URL + 'ProfileFilter Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'ProfileFilter Failed' + err);
        res.status(400).send(null);
    })
  }
})

router.post("/TeamFilter", function (req, res, next) {
    let PartSearch = req.body.partSearch
    let PartCheckall = req.body.partcheckall
    let LocationSearch = req.body.locationSearch
    let LocationCheckall = req.body.locationcheckall
    let TeamSearch = req.body.teamSearch
    let TeamCategoryCheckall = req.body.teamcategorycheckall
    let OrderRule = req.body.orderrule

    var order = 'updatedAt';

    if(OrderRule == 2) order = 'createdAt';
  
    var rule = {};
    
    rule.Category = {
      [Op.regexp]: '^' + TeamSearch
    }

    if(TeamCategoryCheckall == 0){
      rule.Category = {
        [Op.regexp]: '^' + TeamSearch
      }
    }

    if(PartCheckall == 0){
      rule.Part = {
        [Op.regexp]: '^' + PartSearch
      }
    }

    if(LocationCheckall == 0){
      rule.Location = {
        [Op.regexp]: '^' + LocationSearch
      }
    }

    rule.IsShow = 1

    if(OrderRule != 1){
      models.team.findAll({
        limit: 30,
        offset : req.body.index * 1,
        order: [[order, 'DESC']],
        where : rule,
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
          console.log(URL + 'TeamFilter Success' + result);
          res.status(200).send(result);
      }).catch(err => {
          globalRouter.logger.error(URL + 'TeamFilter Failed ' + err);
          res.status(400).send(null);
      });
    }else {
      models.team.findAll({
        attributes: [
          "id",
          "LeaderID",
          "Name",
          "Information",
          "Category",
          "Part",
          "Location",
          "SubLocation",
          "PossibleJoin",
          "Badge1",
          "Badge2",
          "Badge3",
          "createdAt",
          "updatedAt",
          [
            models.Sequelize.literal('(SELECT COUNT(*) FROM TeamBadgeLists WHERE team.id = TeamBadgeLists.TeamID)'), 'BadgeCount'
          ]
        ],
        limit: 30,
        offset : req.body.index * 1,
        order: [[models.Sequelize.literal('BadgeCount'), 'DESC']],
        where : rule,
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
        console.log(URL + 'TeamFilter Success' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(URL + 'TeamFilter Failed ' + err);
        res.status(400).send(null);
    });
  }
})

router.post("/ProfileSearch", function (req, res, next) {
    let NameSearch = req.body.name

    models.user.findAll({
        limit: 30,
        offset : req.body.index * 1,
        where: {
            Name: {
                [Op.like]: "%" + NameSearch + "%"
            }
        },
        order : [
            ['updatedAt', 'DESC']
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
            },
          ]
    }).then(result => {
        console.log(URL + 'ProfileSearch Success' + result);
        res.status(200).send(result)
    }).catch(err => {
        globalRouter.logger.error(URL + 'PrfoileSearch Failed' + err);
        res.status(400).send(null);
    })
})

router.post("/TeamSearch", function (req, res, next) {
    let NameSearch = req.body.name

    models.team.findAll({
        limit: 30,
        offset : req.body.index * 1,
        where: {
            Name: {
                [Op.like]: "%" + NameSearch + "%"
            }
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
        console.log(URL + 'TeamSearch Success' + result);
        res.status(200).send(result)
    }).catch(err => {
        globalRouter.logger.error(URL + 'TeamSearch Failed' + err);
        res.status(400).send(null);
    })
})


module.exports = router;
