const router = require('express').Router(),
        models = require('../../models');

const { Op } = require('sequelize');
const globalRouter = require('../global');

module.exports = {
    Insert : async function InsertPersonalBadge( data ) {

        return new Promise((resolv, reject) => {
            models.PersonalBadgeList.findOrCreate({
                where : {
                    UserID: data.userID,
                    BadgeID : data.badgeID,
                },
                defaults: {
                    UserID: data.userID,
                    BadgeID : data.badgeID,
                }
            }).then( async result => {
                globalRouter.logger.info('InsertPersonalBadge create Success ' + result);

                let badgeCount = await models.PersonalBadgeList.count({
                    where :{
                        UserID : data.userID
                    },
                    distinct: true,
                    col: 'id'
                });

                let badgedata = {
                    category : 1,
                    part : '뱃지',
                    value : badgeCount
                }

                let badgeTable = await this.SelectlevelBadge( badgedata );

                if(null != badgeTable && badgeCount > badgeTable.Condition){
                    //뱃지 개수 등록이벤트
                    await models.PersonalBadgeList.findOrCreate({
                        where : {
                            UserID: data.userID,
                            BadgeID : badgeTable.id,
                        },
                        defaults: {
                            UserID: data.userID,
                            BadgeID : badgeTable.id,
                        }
                    });
                }

                resolv(result);
            }).catch( err => {
                globalRouter.logger.error('InsertPersonalBadge create Faield ' + err);
                resolv(null);
            })
        });
    },
    FindBadge : async function FindPersonalBadge( data ) {
        return new Promise((resolv, reject) => {
            models.PersonalBadgeList.findOne({
                where: {
                    BadgeID : data.badgeID
                }
            }).then( result => {
                console.log('FindPersonalBadge create Success ' + result);
                resolv(result);
            }).catch( err => {
                globalRouter.logger.error('FindPersonalBadge create Faield ' + err);
                resolv(null);
            })
        });
    },
    SelectlevelBadge : async function SelectLevelBadge( data ) {
        return new Promise((resolv, reject) => {
            models.PersonalBadgeTable.findOne({
                where: {
                    Category : data.category,
                    Part : data.part,
                    Condition : {
                        [Op.lte] : data.value * 1
                    }
                },
                order : [
                    ['id', 'DESC']
                ],
            }).then(result => {
                console.log('SelectLevelBadge ' +  result);
                resolv(result);
            }).catch(err => {
                globalRouter.logger.error('SelectLevelBadge ' +  err);
                reject(null);
            });
        });
    },
    InsertTeam : async function InsertTeamBadge( data ) {

        return new Promise((resolv, reject) => {
            models.TeamBadgeList.findOrCreate({
                where : {
                    TeamID: data.teamID,
                    BadgeID : data.badgeID,
                },
                defaults: {
                    TeamID: data.teamID,
                    BadgeID : data.badgeID,
                }
            }).then( async result => {
                globalRouter.logger.info('InsertTeamBadge create Success ' + result);

                let badgeCount = await models.TeamBadgeList.count({
                    where :{
                        TeamID: data.teamID,
                    },
                    distinct: true,
                    col: 'id'
                });

                let badgedata = {
                    category : 1,
                    part : '뱃지',
                    value : badgeCount
                }

                let badgeTable = await this.SelectlevelTeamBadge( badgedata );

                if(null != badgeTable && badgeCount > badgeTable.Condition){
                    //뱃지 개수 등록이벤트
                    await models.TeamBadgeList.findOrCreate({
                        where : {
                            TeamID: data.teamID,
                            BadgeID : badgeTable.id,
                        },
                        defaults: {
                            TeamID: data.teamID,
                            BadgeID : badgeTable.id,
                        }
                    });
                }

                resolv(result);
            }).catch( err => {
                globalRouter.logger.error('InsertTeamBadge create Faield ' + err);
                resolv(null);
            })
        });
    },
    FindTeamBadge : async function FindTeamBadge( data ) {
        return new Promise((resolv, reject) => {
            models.TeamBadgeList.findOne({
                where: {
                    BadgeID : data.badgeID
                }
            }).then( result => {
                console.log('FindTeamBadge create Success ' + result);
                resolv(result);
            }).catch( err => {
                globalRouter.logger.error('FindTeamBadge create Faield ' + err);
                resolv(null);
            })
        });
    },
    SelectlevelTeamBadge : async function SelectLevelTeamBadge( data ) {
        return new Promise((resolv, reject) => {
            models.TeamBadgeTable.findOne({
                where: {
                    Category : data.category,
                    Part : data.part,
                    Condition : {
                        [Op.lte] : data.value * 1
                    }
                },
                order : [
                    ['id', 'DESC']
                ],
            }).then(result => {
                console.log('SelectLeveSelectlevelTeamBadgelBadge ' +  result);
                resolv(result);
            }).catch(err => {
                globalRouter.logger.error('SelectlevelTeamBadge ' +  err);
                reject(null);
            });
        });
    },
    InsertEventBadge :  async function InsertEventBadge( data ) {
        return new Promise((resolv, reject) => {
            models.EventBadgeTable.findOne({
                where : {
                  id  : data.id
                },
              }).then(async result => {
                console.log('InsertEventBadge EventBadgeTable findOne Success');
                if(globalRouter.IsEmpty(result)){
                  console.log('InsertEventBadge EventBadgeTable IsEmpty Success');
                  resolv(null);
                }else{
            
                  await models.PersonalBadgeList.findOrCreate({
                    where : {
                      UserID : data.userID,
                      BadgeID : result.id,
                      Type : 1
                    },
                    defaults : {
                      UserID : data.userID,
                      BadgeID : result.id,
                      Type : 1
                    }
                  }).then(personalBadgeListResult => {
                    console.log('InsertEventBadge PersonalBadgeList findOrCreate Success');
                    if (personalBadgeListResult[1]) { 
                      console.log('InsertEventBadge PersonalBadgeList create Success');
                      resolv(personalBadgeListResult[0]);
                    }else{
                      console.log('InsertEventBadge PersonalBadgeList already have');
                      resolv(null);
                    }
                  })
                }
              }).catch(err => {
                console.log('InsertEventBadge EventBadgeTable findOne failed' + err);
                resolv(null);
              })
        })
    }
};
