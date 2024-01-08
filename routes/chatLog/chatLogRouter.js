const router = require('express').Router(),
    models = require('../../models');

const { Op } = require('sequelize');
const globalRouter = require('../global');

var chatLogURL = "/Chat/"

router.post('/UnSendSelect', async (req, res) => {
    if(req.body.roomName == null){
        await models.ChatLog.findAll({
            where : {
                to : req.body.userID,
                isSend : 0
            },
        }).then(result => {
    
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(chatLogURL + "UnSendSelect Success " + result2);
                })
            }
    
            res.status(200).send(result);
        }).catch(err => {
            globalRouter.logger.error(chatLogURL + "UnSendSelect error " + err);
            res.status(400).send(null);
        });
    }else{
        await models.ChatLog.findAll({
            where : {
                to : req.body.userID,
                roomName : req.body.roomName,
                isSend : 0
            },
        }).then(result => {
    
            let value = {
                isSend : 1,
            }
    
            for(let i = 0 ; i < result.length; ++i){
                result[i].update(value).then(result2 => {
                    console.log(chatLogURL + "UnSendSelect Success " + result2);
                })
            }
    
            res.status(200).send(result);
        }).catch(err => {
            globalRouter.logger.error(chatLogURL + "UnSendSelect error " + err);
            res.status(400).send(null);
        });
    }
});

router.post('/SelectImageData', async (req, res) => {

    await models.ChatImageLog.findOne({
        where : {
            id : req.body.id
        }
    }).then(result => {
        console.log(chatLogURL + 'Select/ImageData ChatImageLog Success');
        res.status(200).send(result);    
    }).catch(err => {
        globalRouter.logger.error(chatLogURL + "Select/ImageData ChatImageLog error " + err);
        res.status(200).send(null);
    })
});

router.get('/Count', async(req, res) => {

    await models.ChatLog.findOne({
        order : [
            ['id', 'DESC']
        ]
    }).then( result => {
        console.log(chatLogURL + 'Count Succesced ' + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(chatLogURL + 'Count Failed ' + err);
        res.status(200).send(null);
    })
});

router.get('/Count/Image', async(req, res) => {
    await models.ChatImageLog.findOne({
        order : [
            ['id', 'DESC']
        ]
    }).then( result => {
        console.log(chatLogURL + 'Count/Image Succesced ' + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(chatLogURL + 'Count/Image Failed ' + err);
        res.status(200).send(null);
    })
});

router.post('/SelectOffset', async (req, res) => {
    let data = req.body;

    await models.ChatLog.findAll({
        where: {
            [Op.or] : [{to : data.userID}, {from: data.userID}]
        },
        order: [
            ['id', 'DESC']
        ],
        limit: 20,
        offset: data.index * 1
    }).then(result => {
        console.log(chatLogURL + 'SelectOffset ' + result);
        res.status(200).send(result);
    }).catch(err => {
        globalRouter.logger.error(chatLogURL + "SelectOffset error " + err);
        res.status(200).send(null);
    });
});

module.exports = router;