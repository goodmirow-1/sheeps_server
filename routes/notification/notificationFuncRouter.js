const router = require('express').Router(),
        models = require('../../models'),
        moment = require('moment'),
        globalRouter = require('../global');

    require('moment-timezone');

    moment.tz.setDefault("Asia/Seoul");

module.exports = {
    Insert : async function InsertNotification( data ) {
        var date = moment().format('yyyy-MM-DD HH:mm:ss');

        var targetIndex = data.targetIndex;
        var teamIndex = data.teamIndex;

        if(globalRouter.IsEmpty(targetIndex)){
            targetIndex = 0
        }

        if(globalRouter.IsEmpty(teamIndex)){
            teamIndex = 0
        }

        return new Promise((resolv, reject) => {
            models.NotificationList.create({
                UserID: data.userID,
                TargetID : data.inviteID,
                Type : data.type,
                TableIndex : data.tableIndex,
                TargetIndex : data.targetIndex,
                TeamIndex : data.teamIndex,
                Time : date,
                isSend : data.isSend
            }).then( result => {
                console.log('InsertNotification create Success ' + result);
                resolv(result);
            }).catch( err => {
                globalRouter.logger.error('InsertNotification create Faield ' + err);
                resolv(null);
            })
        });
    }
};
