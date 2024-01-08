const router = require('express').Router(),
    models = require('../../models'),
    moment = require('moment'),
    roomFuncRouter = require('../room/roomFuncRouter');

require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const globalRouter = require('../global');

module.exports = {
    InsertLog : function InsertLog( body ) {
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.ChatLog.create({
                roomName : data.roomName,
                to : data.to,
                from : data.from,
                message : data.message,
                isSend : data.isSend,
                isImage : data.isImage,
                date : data.date,
            }).then( result => {
                console.log("Insert Chat Logs Success " + result);
                resolv( result );
            }).catch( err => {
                globalRouter.logger.error("Insert Chat Logs Faield " + err);
                resolv( false );
            })
        });
    },
    FindOrInsertLog : function FindOrInsertLog( body ) {
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.ChatLog.findOrCreate({
                where: {
                    roomName : data.roomName,
                    to : data.to,
                    from : data.from,
                    message : data.message,
                    isImage : data.isImage,
                    date : data.date,
                },
                defaults: {
                    roomName : data.roomName,
                    to : data.to,
                    from : data.from,
                    message : data.message,
                    isSend : data.isSend,
                    isImage : data.isImage,
                    date : data.date,
                }, 
            }).then( result => {
                console.log("Insert Chat Logs Success " + result);

                if(result[1]){
                    resolv( true );
                }else{
                    resolv( false );
                }
            }).catch( err => {
                globalRouter.logger.error("Insert Chat Logs Faield " + err);
                resolv( undefined );
            })
        });
    },
};