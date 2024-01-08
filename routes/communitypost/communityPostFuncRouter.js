const router = require('express').Router(),
        models = require('../../models');

module.exports = {
    PostCount : async function CommunityPostCount( data ) {

        return new Promise(async (resolv, reject) => {
            let community = await models.CommunityPost.count({
                where :{
                    UserID : data.userID
                },
                distinct: true,
                col: 'id'
            });
        
            let reply = await models.CommunityReply.count({
                where :{
                    UserID : data.userID
                },
                distinct: true,
                col: 'id'
            });
        
            let replyreply = await models.CommunityReplyReply.count({
                where :{
                    UserID : data.userID
                },
                distinct: true,
                col: 'id'
            });
        
            resolv(community + reply + replyreply);
        });
    },
    GetPostByID : async function GetPostByID( data ) {
        return new Promise(async (resolv, reject) => {
            await models.CommunityPost.findOne({
                include: [
                    { 
                        model : models.CommunityLike , 
                        required: true, 
                        limit: 99,
                    },
                ],
                where : {
                    id : data.id
                }
            }).then(async result => {

                var replies = await models.CommunityReply.findAll({where : {PostID : result.id}});
                var repliesLength = replies.length;
                var community = result;

                var data = {
                    community,
                    repliesLength,
                }

                resolv(data);
            }).catch(err => {
                console.log('CommunityPost GetPostByID Failed' + err);
                resolv(null);
            })
        }); 
    },
    GetPostByUserID : async function GetPostByUserID( data ) {
        return new Promise(async (resolv, reject) => {
            console.log(data);
            let resData = [];
            await models.CommunityPost.findAll({
                include: [
                    { 
                        model : models.CommunityLike , 
                        required: true, 
                        limit: 99,
                    },
                ],
                where : {
                    UserID : data.userID,
                    IsShow : 1
                },
                order: [
                    ['id', 'DESC']
                ],
            }).then(async result => {
                for(var i = 0 ; i < result.length; ++i){
                    var replies = await models.CommunityReply.findAll({where : {PostID : result[i].id}});
                    var repliesLength = replies.length;
                    var community = result[i];
    
                    var data = {
                        community,
                        repliesLength,
                    }

                    resData.push(data);
                }

                resolv(resData);
            }).catch(err => {
                console.log('CommunityPost GetPostByUserID Failed' + err);
                resolv(null);
            })
        }); 
    },
    GetCommunityData : async function GetCommunityData( data ) {
        return new Promise(async (resolv, reject) => {
            var replies = await models.CommunityReply.findAll({where : {PostID : data.community.id}});
            var declares = await models.CommunityDeclare.findAll({where : {TargetID : data.community.id}});
            var community = data.community;
            var repliesLength = replies.length;
            var declareLength = declares.length;
    
            var resData = {
              community,
              repliesLength,
              declareLength
            }

            resolv(resData);
        }); 
    },
    GetCommunityDataList : async function GetCommunityDataList( data ) {
        return new Promise(async (resolv, reject) => {
            var communitys = data.community;

            var resData = [];
            for(var i = 0 ; i < communitys.length; ++i){

                var replies = await models.CommunityReply.findAll({where : {PostID : communitys[i].id}});
                var declares = await models.CommunityDeclare.findAll({where : {TargetID : communitys[i].id}});
                var community = communitys[i];
                var repliesLength = replies.length;
                var declareLength = declares.length;
        
                var temp = {
                  community,
                  repliesLength,
                  declareLength
                }
        
                resData.push(temp);
            }

            resolv(resData);
        }); 
    },
};
