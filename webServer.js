const express = require('express');
const methodOverride = require('method-override');		//Post,Delete,Update 관련 Module
const bodyParser = require('body-parser');			//Json으로 데이터 통신 Module
const helmet = require('helmet');				//http 보안관련 Module
const cors = require('cors');
const cookieParser = require('cookie-parser');			//Cookie Module
const path = require('path');

const models = require("./models/index.js");

const WebRouter = require('./routes/web/webRouter');
const fcmFuncRouter = require('./routes/fcm/fcmFuncRouter');
const fcmRouter = require('./routes/fcm/fcmRouter');

const app = express();
const https = require('https');
const sslConfig = require('./config/ssl-config');

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/ProfilePhotos/'));

app.use(helmet());
app.use(cors());
app.use('/Web', WebRouter);

// configuration =========================
app.set('port', process.argv[2] || process.env.PORT || 50003);

const options = {
    key: sslConfig.privateKey,
    cert: sslConfig.certificate,
    passphrase: 'tnlqwldksgdms1!' // certificate을 생성하면서 입력하였던 passphrase 값
};

// const server = https.createServer(options, app);
// server.listen(app.get('port'), () => {
// 	console.log('Express server listening on port ' + app.get('port'));
// });

const server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
});

// sequelize 연동
models.sequelize.sync().then( () => {
	console.log("DB Connect Success");
}).catch( err => {
    console.log("DB Connect Faield");
    console.log(err);
})

var nodeXlsx = require('node-xlsx');
const fs = require('fs');

app.get('/Extract/Excel', async(req, res) => {
        var resultData = [];


        await models.ProfileInfo.findAll({}).then(result => {

                resultData.push(['id','Name','PhoneNumber','Sex','Location','Age','DoTreatement','Stomach','LargeIntestine','Thyroidgland','Epigastrium','Liver','Kidney','Pancreas','Spleen','Gallbaldder','PrecisionBlood','PrecisionUrine','ETC','GuaranteeAnalysis','Collecting','createdAt']);

                for(var i = 0 ; i < result.length; ++i){
                        resultData.push([result[i].id,result[i].Name,result[i].Sex,result[i].Location,result[i].Age,result[i].DoTreatment,result[i].Stomach,result[i].LargeIntestine,result[i].Throidgland,result[i].Epigastrium,result[i].Liver,result[i].Kidney,result[i].Pancreas,result[i].Spleen,result[i].Gallbaldder,result[i].PrecisionBlood,result[i].PrecisionUrine,result[i].ETC,result[i].GuaranteeAnalysis,result[i].Collectiong,result[i].createdAt]);
                }

                var buffer = nodeXlsx.build([{name: "List User", data : resultData}]);
                fs.writeFile('./data.xlsx',buffer,function(err){
                        if(err) {
                                res.status(500).send(err);
                        }else{
                                res.status(200).send(true);
                        }
                })
        })
});