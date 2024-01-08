const router = require('express').Router(),
    admin = require('firebase-admin'),
    models = require('../../models'),
    globalRouter = require('../global'),
    notificationFuncRouter = require('../notification/notificationFuncRouter');

module.exports = {
    SendFcmEvent : async function SendFcmEvent( body ) {
        var data = JSON.parse(body);

        await models.FcmTokenList.findOne({
            where : {
                UserID : data.inviteID
            },
            order : [
                ['id', 'DESC']
            ]
        }).then( async result => {

            if (globalRouter.IsEmpty(result) || globalRouter.IsEmpty(result.Token)) {
                data.isSend == 0;
                await notificationFuncRouter.Insert(data);
                globalRouter.logger.error('fcmFuncRouter UserID' + data.inviteID + ' Token is worng');
                return false;
            }

            var fcmData = data;
            var page = 'NOTIFICATION';

            if(data.type != 'CHATTING'){
                fcmData = await notificationFuncRouter.Insert(data);
            }

            switch(data.type){
                case "POST_LIKE":
                case "POST_REPLY":
                case "POST_REPLY_LIKE":
                    page = "COMMUNITY";
                    break;
                case "POST_REPLY_REPLY":
                case "POST_REPLY_REPLY_LIKE":
                    page = "COMMUNITY_REPLY";
                    break;
                case "CHATTING":
                    page = "CHATROOM";
                    break;
                default:
                    page = "NOTIFICATION";
                    break;
            }


            var isBanType = false;
            //마케팅 알람 차단
            if(result.Marketting == false){
                if(data.type == 'MARKETING'){
                    isBanType = true;
                }
            }

            //채팅 알람 차단
            if(result.Chatting == false){
                if(data.type == 'CHATTING' || data.type == 'INVITE' || data.type == 'INVITE_ACCEPT' || data.type == 'INVITE_REFUSE' 
                || data.type == 'PROFILE_LIKE' || data.type == 'ROOM_LEAVE' || data.type == 'PERSONAL_UNIV_AUTH_UPDATE' || data.type == 'PERSONAL_GRADUATE_AUTH_UPDATE' 
                || data.type == 'PERSONAL_CAREER_AUTH_UPDATE' || data.type == 'PERSONAL_WIN_AUTH_UPDATE' || data.type == 'LICENSE_AUTH_UPDATE' || data.type == 'PERSONAL_GET_BADGE') {
                    isBanType = true;
                }
            }

            //팀 알림 차단
            if(result.Team == false){
                if( data.type == 'TEAM_INVITE' || data.type == 'TEAM_INVITE_ACCEPT' || data.type == 'TEAM_INVITE_REFUSE' 
                    || data.type == 'TEAM_REQUEST' || data.type == 'TEAM_REQUEST_ACCEPT' || data.type == 'TEAM_REQUEST_REFUSE'
                    || data.type == 'TEAM_MEMBER_KICKED_OUT' || data.type == 'TEAM_MEMBER_LEAVE' || data.type == 'TEAM_LIKE' || data.type == 'TEAM_MEMBER_ADD'
                    || data.type == 'INVITE_PERSONALSEEKTEAM' || data.type == 'INVITE_PERSONALSEEKTEAM_ACCEPT' || data.type == 'INVITE_PERSONALSEEKTEAM_REFUSE'
                    || data.type == 'INVITE_TEAMMEMBERRECRUIT' || data.type == 'INVITE_TEAMMEMBERRECRUIT_ACCEPT' || data.type == 'INVITE_TEAMMEMBERRECRUIT_REFUSE'
                    || data.type == 'TEAM_AUTH_AUTH_UPDATE' || data.type == 'TEAM_PERFORMANCE_AUTH_UPDATE' || data.type == 'TEAM_WIN_AUTH_UPDATE' || data.type == 'TEAM_GET_BADGE') {
                        isBanType = true;
                }
            }

            //커뮤니티 알림 차단
            if(result.Community == false){
                if(data.type == "POST_LIKE" || data.type == 'POST_REPLY' || data.type == 'POST_REPLY_LIKE' 
                || data.type == 'POST_REPLY_REPLY' || data.type == "POST_REPLY_REPLY_LIKE"){
                    isBanType = true;
                }
            }

            var bodyMessage = data.body;

            if(data.isImage == 1) bodyMessage = "사진을 보냈습니다.";

            bodyMessage = data.title + " : " + bodyMessage;

            var res = '';
            
            if(data.type == 'CHATTING'){
                res = data.roomName;
            }else{
                var tableStr = globalRouter.IsEmpty(fcmData.TableIndex) ? 0 : fcmData.TableIndex;
                var targetStr = globalRouter.IsEmpty(fcmData.TargetIndex) ? 0 : fcmData.TargetIndex;
                var teamStr = globalRouter.IsEmpty(fcmData.TeamIndex) ? 0 : fcmData.TeamIndex;

                if(globalRouter.IsEmpty(fcmData) == false)
                   res = fcmData.id + "|" + fcmData.UserID + '|' + fcmData.TargetID + '|' + fcmData.Type + '|' + tableStr + '|' + targetStr + '|' + teamStr + "|" + fcmData.Time;
    
                if(data.type == 'TEAM_INVITE' || data.type == "TEAM_INVITE_ACCEPT" 
                    || data.type == "TEAM_REQUEST" || data.type == "TEAM_REQUEST_ACCEPT" 
                    || data.type == "TEAM_REQUEST_REFUSE" || data.type == "TEAM_MEMBER_ADD"){
                        res = res + "|" + data.roomName;
                    }
            }

            let message;
            var badgeCount = Number(result.BadgeCount + 1);
            if(data.isSend == 1 || isBanType == true){
                message = {
                    data : {
                        title : "Sheeps",
                        notibody : bodyMessage,
                        body : res,
                        click_action : "FLUTTER_NOTIFICATION_CLICK",
                        screen: page
                    },
                    token : result.Token,
                }
            }else{
                message = {
                    notification : {
                        title : "Sheeps",
                        body : bodyMessage,
                    },
                    data : {
                        body : res,
                        click_action : "FLUTTER_NOTIFICATION_CLICK",
                        screen: page
                    },
                    apns: {
                        payload: {
                          aps: {
                            badge: badgeCount,
                            sound: 'default',
                          },
                        },
                    },
                    token : result.Token,
                }
            }

           admin.messaging().send(message)
            .then( fcmResult => {
                result.update({BadgeCount : badgeCount});
                console.log('fcm send is success' + fcmResult);
                return true;
            })
            .catch( e => {
                globalRouter.logger.error(e);
                return false; 
            })
            
        }).catch( err => {
            globalRouter.logger.error('FcmTokenList Select Faield ' + err);
            return false;
        })
    },
    SendFcmSubscribeEvent : async function SendFcmSubscribeEvent( body ) {
        var data =JSON.parse(body);

        var fcmData = data;
        var page = 'NOTIFICATION';

        fcmData = await notificationFuncRouter.Insert(data);

        switch(data.type){
            case "POST_LIKE":
            case "POST_REPLY":
            case "POST_REPLY_LIKE":
            case "POST_REPLY_REPLY":
            case "POST_REPLY_REPLY_LIKE":
                page = "COMMUNITY";
                break;
            default:
                page = "NOTIFICATION";
                break;
        }

        const options = {
            priority: "normal",     //메시지 중요도 설정 
            timeToLive: 60 * 60 * 2 ////메시지 Live Time 설정
        }; 

        var tableStr = globalRouter.IsEmpty(fcmData.TableIndex) ? 0 : fcmData.TableIndex;
        var targetStr = globalRouter.IsEmpty(fcmData.TargetIndex) ? 0 : fcmData.TargetIndex;
        var teamStr = globalRouter.IsEmpty(fcmData.TeamIndex) ? 0 : fcmData.TeamIndex;

        var res = '';

        if(globalRouter.IsEmpty(fcmData) == false)
            res = fcmData.id + "|" + fcmData.UserID + '|' + fcmData.TargetID + '|' + fcmData.Type + '|' + tableStr + '|' + targetStr + '|' + teamStr + "|" + fcmData.Time;
        
        var message = {
            notification : {
                title : data.title,
                body : data.body,
            },
            data : {
                title : data.title,
                notibody : data.body,
                body : res,
                click_action : "FLUTTER_NOTIFICATION_CLICK",
                screen: page
            },
        }
            
        admin.messaging().sendToTopic(String(data.topic), message, options).then(function(response) {
                console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
                console.log("Error sending message:", error);
        });

    },
    SendFcmChatEvent : async function SendFcmChatEvent( body ) {
        var data = JSON.parse(body);

        const options = {
            priority: "high",     //메시지 중요도 설정 
            timeToLive: 60 * 60 * 2 ////메시지 Live Time 설정
        }; 

        console.log(data);
        
        var message = {
                notification : {
                    title : "Sheeps",
                    body : data.message,
                },
        };
            
        admin.messaging().sendToTopic(String(data.roomName), message, options).then(function(response) {
                console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
                console.log("Error sending message:", error);
        });

    },
};
