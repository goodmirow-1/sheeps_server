var express = require('express');
var models = require('../../models');
var router = express.Router();
const { Op } = require('sequelize');
const globalRouter = require('../global');

module.exports = {
    selectTeamByID : async function selectTeamByID(TeamID){
        return new Promise((resolv, reject) => {
            models.team.findOne({
                where: {
                    id: TeamID
                },
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
                resolv(result);
            }).catch(err => {
                globalRouter.logger.error("func selectTeamByID error" + err);
                reject(err);
            });
        });

    },
};