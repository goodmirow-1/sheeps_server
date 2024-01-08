const router = require('express').Router(),
        models = require('../../models');

const globalRouter = require('../global');
        
let URL = '/Banner';

router.get('/List', async(req, res) => {
    await models.Banner.findAll({
        order : [
            ['Index', 'DESC']
        ],
        limit : 10,
    }).then( result => {
        console.log(URL + '/List Succesced' + result);
        res.status(200).send(result);
    }).catch( err => {
        globalRouter.logger.error(URL + '/List Failed' + err);
        res.status(400).send(null);
    })
});

module.exports = router;