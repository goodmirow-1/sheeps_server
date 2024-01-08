var express = require('express');
var models = require('../../models');
var router = express.Router();
const { Op } = require('sequelize');
const globalRouter = require('../global');

module.exports = {
    selectRoomUserToRoomInfo : async function selectRoomUserToRoomInfo(roomUserResult, socket){
        for(let i = 0 ; i < roomUserResult.length; ++i){
            await models.RoomInfo.findAll({
                attributes: ['RoomName'],
                where : {
                    RoomID : roomUserResult[i].RoomID
                },
                raw : true
            }).then( result => {
                console.log('RoomUser -> RoomInfo Success');
                socket.join(result[0]['RoomName']);
            }).catch( err => {
                globalRouter.logger.error('RoomUser -> RoomInfo Failed') + err;
            })
        }
    },
    insertRoomInfoAndUserCall : async function insertRoomInfoAndUserCall( body ){
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.RoomInfo.findOrCreate({
                where : {
                    RoomName : data.roomName,
                    Type : data.type,
                    MAX : data.max
                },
            }).then( result => {
                if(result[1]){
                    console.log("roominfoinsertcall success");
        
                    var roomInfoUserData = JSON.stringify({
                        UserID : data.userID,
                        RoomID : result[0].RoomID,
                    })
                    
                    var res = this.insertRoomUserCall(roomInfoUserData);
                    res.then(result => {
                        resolv(true);
                    }).catch(err => {
                        console.log(err);
                        reject(false);
                    })
                }else{
                    console.log('already roominfo data');
                    resolv(false);
                }
            }).catch( err => {
                globalRouter.logger.error("roominfoinsertcall faield " + err);
                resolv(false);
            })
        })
    },
    selectRoomInfo : async function selectRoomInfo( body, socket ){
        var data = JSON.parse(body);
        await models.RoomUser.findAll({
            attributes : ["RoomID"],
            where : {
                UserID : data.userID
            }
        }).then( roomUserResult =>{
            this.selectRoomUserToRoomInfo(roomUserResult, socket);
        }).catch( err => {
            globalRouter.logger.error("selectRoomInfo faield " + err);
        })
    },
    insertRoomInfo : async function insertRoomInfo( body ) {
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.RoomInfo.findOrCreate({
                where : {
                    RoomName : data.roomName,
                    MAX : data.max
                },
            }).then(function(result)  {
                if(result[1]){
                    console.log("roominfoinsertcall success");
                    resolv(true);
                }else{
                    console.log('already roominfo data');
                    resolv(false);
                }
            }).catch( err => {
                globalRouter.logger.error("roominfoinsertcall faield " + err);
                resolv(false);
            })
        });
    },
    insertRoomUser : async function insertRoomUser( body ) {
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.RoomUser.findOrCreate({
                where : {
                    UserID : data.UserID,
                    RoomID : data.RoomID,
                    Alarm : 1,
                },
            }).then( result => {
                console.log("roomuserinsertcall success");
                resolv(true);
            }).catch( err => {
                globalRouter.logger.error("roomuserinsertcall faield " + err);
                reject(false);
            })
        });
    },
    insertRoomInfoAndUser : async function insertRoomInfoAndUser( body ) {
        var data = JSON.parse(body);

        return new Promise((resolv, reject) => {
            models.RoomInfo.findOrCreate({
                where : {
                    RoomName : data.roomName,
                    Type : data.type,
                    MAX : data.max
                },
            }).then( result => {
                console.log("roominfoinsertcall success");
    
                var roomInfoUserData = JSON.stringify({
                    UserID : data.userID,
                    RoomID : result[0].RoomID,
                })
                
                var res = this.insertRoomUser(roomInfoUserData);
                res.then(result => {
                    resolv(true);
                }).catch(err => {
                    console.log(err);
                    reject(false);
                })
            }).catch( err => {
                globalRouter.logger.error("roominfoinsertcall faield " + err);
                resolv(false);
            })
        })
    },
    deleteInviteRoom : async function deleteInviteRoom( body ) {
        var data = JSON.parse(body);
        await models.InvitingRoomUser.destroy({
            where: {
                UserID : data.userID,
                InviteID : data.inviteID
            }
        }).then( result => {
            console.log('deleteInviteRoomCall success');
        }).catch( err => {
            globalRouter.logger.error('deleteInviteRoomCall failed' + err);
        });
    },
    isPossibleInviteRoom : async function isPossibleInviteRoom( body ) {
        var data = JSON.parse(body);
        var res;

        await models.RoomInfo.findAndCountAll({
            where : { 
                UserID : data.UserID,
                InviteID : data.InviteID,
            },
        }).then( result => {
            console.log("isPossibleJoinRoom true " + result.count);
            res = result.count;
        }).catch( err => {
            globalRouter.logger.error("isPossibleJoinRoom false " + err);
        })

        return res;
    },
    isPossibleJoinRoom : async function isPossibleJoinRoom( body ) {
        var data = JSON.parse(body);
        var res = false;

        await models.RoomInfo.findAndCountAll({
            where : { 
                RoomID : data.id
            },
        }).then( result => {
            console.log("isPossibleJoinRoom true " + result.count);
            if(result.count == 0){
                res = true;
            }
            else{
                if(result.count < result.rows['MAX']){
                    res = true;
                }
            }
        }).catch( err => {
            globalRouter.logger.error("isPossibleJoinRoom false " + err);
        })

        return res;
    },
    updateByRoomName : async function updateByRoomName( param ){
        await models.RoomInfo.update(
            {
                MAX : 30
            },
            {where:{ RoomName : param },
        }).then( result => {
            console.log("updateByRoomName Successed" + result);
        }).catch( err => {
            globalRouter.logger.error("updateByRoomName Failed" + err);
        })
    },
    findRoomMember : async function findRoomMember( body ) {
        var resData = [];

        return new Promise((resolv, reject) => {
            models.RoomUser.findAll({
                where : {
                    UserID : body.userID,
                },
            }).then( async result => {
                console.log("roomuserinsertcall success");

                if(globalRouter.IsEmpty(result)){
                    resolv(null);
                }else{
                    for(var i = 0 ; i < result.length; ++i){
                        await models.RoomUser.findOne({
                            where : {
                                RoomID : result[i].id,
                                UserID : {
                                    [ Op.ne ] : body.userID
                                }
                            }
                        }).then(result2 => {
                            resData.push(resData);
                        })
                    }
                    resolv(resData);
                }
            }).catch( err => {
                globalRouter.logger.error("roomuserinsertcall faield " + err);
                reject(false);
            })
        });
    },
    leaveRoomMember : async function leaveRoomMember( body ) {
        var data = JSON.parse(body);

        await models.RoomInfo.findOne({
            where : {
                RoomName : data.roomName
            }
        }).then(async roomInfoResult => {
            console.log(URL + 'Leave RoomInfo findOne Success' + roomInfoResult);

            await models.RoomUser.destroy({
                where : {
                    UserID : data.userID,
                    RoomID : roomInfoResult.RoomID
                }
            }).then(async roomUserResult => {
                console.log(URL + 'Leave RoomUser findOne Success' + roomInfoResult);
                
                //하나가 사라지므로 1이되면 자기만 남음 (기존 데이터는 2)
                //채팅 방 폭파
                if(roomInfoResult.length == 2){
                    await models.RoomInfo.destroy({
                        where : {
                            RoomName : data.roomName
                        }
                    }).then(roomInfoResult2 => {
                        console.log(URL + 'Leave RoomInfo2 destroy Success' + roomInfoResult2);
                    }).catch(err => {
                        globalRouter.logger.error(URL + 'Leave RoomInfo 2destroy Failed' + err);
                    })

                    await models.RoomUser.destroy({
                        where : {
                            RoomID : roomInfoResult.RoomID
                        }
                    }).then(roomUserResult2 => {
                        console.log(URL + 'Leave RoomUser2 destroy Success' + roomInfoResult2);
                    }).catch(err => {
                        globalRouter.logger.error(URL + 'Leave RoomUser2 destroy Failed' + err);
                    })
                }
            }).catch(err => {
                globalRouter.logger.error(URL + 'Leave RoomUser destroy Failed' + err);
            });
        }).catch(err => {
            globalRouter.logger.error(URL + 'Leave RoomInfo findOne Failed' + err);
        })
    },
    destroyRoom : async function destroyRoom( body ) {
        var data = JSON.parse(body);

        await models.RoomInfo.findAll({
            where : {
                RoomName :{
                    [Op.like] : data.roomName + '%'
                }
            }
        }).then( async roomInfoResult => {
            console.log(URL + 'destroyRoom RoomInfo findOne Success' + roomInfoResult);

            if(globalRouter.IsEmpty(roomInfoResult)) return;
            else{
                for(var i = 0 ; i < roomInfoResult.length; ++i){
                    await models.RoomUser.destroy({
                        where : {
                            RoomID : roomInfoResult[i].RoomID
                        }
                    }).then(async roomUserResult => {
                        console.log(URL + 'destroyRoom RoomUser destroy Success' + roomUserResult);
        
                        roomInfoResult[i].destroy({}).then(result => {
                            console.log(URL + 'destroyRoom RoomInfo destroy Success' + roomInfoResult);
                        })
                    })
                }
            }
        })
    }
};