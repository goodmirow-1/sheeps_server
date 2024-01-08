/*global require*/

const express = require('express');
const methodOverride = require('method-override');		//Post,Delete,Update 관련 Module
const bodyParser = require('body-parser');			//Json으로 데이터 통신 Module
const helmet = require('helmet');				//http 보안관련 Module
const cookieParser = require('cookie-parser');			//Cookie Module
const path = require('path');
const dateutil = require('date-utils');


const { promisify } = require('util');          //동기화 module
const imageSize = promisify(require('image-size'));        //이미지 사이즈 가져오는 Module

const formidable = require('formidable');
const fs_extra = require('fs-extra');
const fs = require('fs');

// const session = require('express-session');
// const connectRedis = require('connect-redis');

const sudo = require('sudo-js');
sudo.setPassword('tnlqwldksgdms1!');

const routerindex = require('./routes/index');
const models = require("./models/index.js");

process.setMaxListeners(15);

//Restful API Controller
const RoomRouter = require('./routes/room/roomRouter'),
		TeamRouter = require('./routes/team/teamRouter'),
		FcmRouter = require('./routes/fcm/fcmRouter'),
		ChatLogRouter = require('./routes/chatLog/chatLogRouter'),
		NotificationRouter = require('./routes/notification/notificationRouter'),
		CommunityPostRouter = require('./routes/communitypost/communityPostRouter'),
		SearchRouter = require('./routes/search/searchRouter'),
		BadgeRouter = require('./routes/badge/badgeRouter'),
		bannerRouter = require('./routes/banner/banner'),
		matchingRouter = require('./routes/matching/matchingRouter'),
		globalRouter = require('./routes/global');

const badgeFuncRouter = require('./routes/badge/badgeFuncRouter'),
	roomFuncRouter = require('./routes/room/roomFuncRouter'),
	teamFuncRouter = require('./routes/team/teamFuncRouter'),
	communityFuncRouter = require('./routes/communitypost/communityPostFuncRouter'),
	verify = require('./controllers/parameterToken');

let isDisableKeepAlive = false;

const app = express();

app.use(methodOverride('_method'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/ProfilePhotos/'));

app.use(helmet());					
app.use(cookieParser('tnlqwldksgdms1!'));
//app.use(rateCheck);
app.use('/Personal', routerindex);
app.use('/Team', TeamRouter);
app.use('/Fcm', FcmRouter);
app.use('/Notification', NotificationRouter);
app.use('/CommunityPost', CommunityPostRouter);
app.use('/Search', SearchRouter);
app.use('/Room', RoomRouter);
app.use('/ChatLog', ChatLogRouter);
app.use('/Badge', BadgeRouter);
app.use('/Banner', bannerRouter);
app.use('/Matching', matchingRouter);

var route, routes = [];

// configuration =========================
app.set('port', process.argv[2] || process.env.PORT || 50001);

const server = app.listen(app.get('port'), () => {
	globalRouter.logger.info('Express server listening on port ' + app.get('port'));
	
	var nowDate = new Date();
	var time = nowDate.toFormat('YYYY-MM-DD');
});

// sequelize 연동
models.sequelize.sync().then( () => {
	globalRouter.logger.info("Write DB Connect Success");
}).catch( err => {
    globalRouter.logger.error("DB Connect Faield");
    globalRouter.logger.error(err);
})

// -- -- --
//정 전역 플래그값에 따라 응답 헤더에 ‘Connection: close’를 설정해 
//클라이언트 요청을 종료하는 방법을 활용, 타임아웃으로 서비스가 중단되는 문제를 해결

app.use(function(req,res,next){
	if(isDisableKeepAlive){
		res.set('Connection', 'close');
	}
	next();
});

process.on('SIGTERM', shutDown); //정상종료 
process.on('SIGINT', shutDown); //비정상종료

function shutDown() {

	globalRouter.logger.info('Received kill signal, shutting down gracefully');
	server.close(() => {
		globalRouter.logger.info('Closed out rmaining connections');
		process.exit(0);
	});

	setTimeout(() => {
		globalRouter.logger.error('Could not close connections in time, forcefully shutting down');
		process.exit(1);
	}, 10000);
}

app.get('/VERSION/CHECK', async(req, res) => {

	let data = {
		VERSION : 1
	}

	res.status(200).send(data);
})

app.use('/Sharp/ProfilePhotos', async(req, res) => {
    await models.user.findAll({}).then(async result => {

        for(var i = 0 ; i < result.length; ++i){
            if(result[i].PfImgUrl1 != null){
                var fileName = '.' + result[i].PfImgUrl1;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 0, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 0, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].PfImgUrl2 != null){
                var fileName = '.' + result[i].PfImgUrl2;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 1, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 1, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].PfImgUrl3 != null){
                var fileName = '.' + result[i].PfImgUrl3;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 2, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 2, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].PfImgUrl4 != null){
                var fileName = '.' + result[i].PfImgUrl4;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 3, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 3, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].PfImgUrl5 != null){
                var fileName = '.' + result[i].PfImgUrl5;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 4, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].UserID, '/../ProfilePhotos/', 4, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
        }

        res.json(true);
    }).catch(err => {
        console.log(err);
        res.json(null);
    })
});

app.use('/Sharp/TeamPhotos', async(req, res) => {
    await models.team.findAll({}).then(async result => {

        for(var i = 0 ; i < result.length; ++i){
            if(result[i].TImgUrl1 != null){
                var fileName = '.' + result[i].TImgUrl1;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 0, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 0, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].TImgUrl2 != null){
                var fileName = '.' + result[i].TImgUrl2;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 1, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 1, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].TImgUrl3 != null){
                var fileName = '.' + result[i].TImgUrl3;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 2, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 2, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].TImgUrl4 != null){
                var fileName = '.' + result[i].TImgUrl4;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 3, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 3, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
            if(result[i].TImgUrl5 != null){
                var fileName = '.' + result[i].TImgUrl5;
                var fileNameOrg = fileName.substring(fileName.lastIndexOf("/"), fileName.length);
                var dimensions = await imageSize(fileName);
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 4, fileNameOrg, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(fileNameOrg));
                globalRouter.realSharping(result[i].id, '/../TeamPhotos/', 4, fileNameOrg, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(fileNameOrg));
            }
        }

        res.json(true);
    }).catch(err => {
        console.log(err);
        res.json(null);
    })
});

var communityPostInsertURL = '/CommunityPost/Insert';
app.use(communityPostInsertURL, async (req, res) => {
	console.log(communityPostInsertURL + 'do');
	
    var fields = new Map();
    var fields_array = []; //배열에 저장해서 넘기기
    // 텍스트 값
    var files = [];
    var files_array = []; //배열에 저장해서 넘기기
    // 이미지 파일
  
    var form = new formidable.IncomingForm();
  
    form.encoding = 'utf-8';
    form.uploadDir = __dirname + "/AllPhotos/temp/";
    form.multiples = true;
    form.keepExtensions = true;
  
    form.on('field', function (field, value) { //값 하나당 한번씩 돌아가므로,
      console.log(field);
      fields.set(field, value);
      fields_array.push(value); //값 순서대로 배열에 쌓아준다.
	});

	//토큰 검사
	if(false == verify.verifyToken(fields.get('accessToken'))){
		console.log(communityPostInsertURL + 'verify failed');
		res.json(null);
		return;
	}else{
		form.on('file', function (field, file) {
			files.push([field, file.name]);
			console.log("what is file name in form.on file", file.name);
			files_array.push(file);
		
		  }).on('end', async function () { //파일이 다 넘어오면 그 때 "이건 한 번 실행됨"
			await models.CommunityPost.create({ //테이블 '하나' 생성
			  UserID: fields.get('userid'),
			  Category: fields.get('category'),
			  Title: fields.get('title'),
			  Contents: fields.get('contents'),
			  Type : fields.get('type')
			}).then(result => {
			  console.log("CommunityPost Insert Success");
			  globalRouter.makeFolder('CommunityPhotos/' + result.id); //생성된 커뮤니티 글 id 값으로 폴더 생성 //한번만 만들어짐 !
			  for (var i = 1; i <= 3; ++i) {
				globalRouter.makeFolder('CommunityPhotos/' + result.id + "/" + i.toString());
			  }
			  return result; // result 값 다음 then 으로 넘김
			}).then(async result => {
			  for (var i = 0; i < 3; ++i) {
				if (i < files_array.length) {
				  fs_extra.rename(files_array[i].path, './CommunityPhotos/' + result.id + "/" + (i + 1) + "/" + files_array[i].name); //파일 앞서 만든 폴더에 저장
				} else {
				  console.log("file array length is", files_array.length, ", so don't have to insert right folder after folder");
				}
			  }
			  console.log('files array length', files_array.length);
		
			  let MAX_CNT = 3; //사진 최대 개수
			  let column_base_name = 'ImageUrl';
			  for (var i = 0; i < MAX_CNT; ++i) {
				let column = column_base_name + (i + 1).toString();
		
				if (i < files_array.length) { //어레이에 값 차있으면 ( 이미지 파일 있으면 )
				  //sharping(result_id, Destination, i, files_array_name, size, qualityNum, mimetype)
				  //커뮤니티는 60*60 크기의 사진만 필요
				  //globalRouter.sharping(result.id, '/../CommunityPhotos/', i, files_array[i].name, 120, 100,  globalRouter.getImgMime(files_array[i].name));
				  // globalRouter.sharping(result.id, '/../CommunityPhotos/', i, files_array[i].name, 60, 100,  globalRouter.getImgMime(files_array[i].name));
	  
				  console.log(files_array[i].name);
				  var dimensions = await imageSize('./CommunityPhotos/' + result.id + "/" + (i + 1) + "/" + files_array[i].name);
				  globalRouter.realSharping(result.id, '/../CommunityPhotos/', i, files_array[i].name, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(files_array[i].name));
	  
				  await models.CommunityPost.update(
					{
					  [column]: '/CommunityPhotos/' + result.id + "/" + (i + 1) + "/" + files_array[i].name//우선 이게 맞는건 아니고 잘 들어가는지만 확인
					},
					{
					  where:
					  {
						id: result.id
					  }
					}).then(updateResult => {
					  console.log('File uploaded! and url updated Success' + updateResult);
					}).catch(err => {
					  console.log('File uploaded! and url updated Faield' + err);
					})
				} else {
				  await models.CommunityPost.update(
					{
					  [column]: null
					}, {
					where: {
					  id: result.id
					}
				  }).then(updateResult => {
					console.log('File uploaded! and url NULL Success' + updateResult);
				  }).catch(err => {
					console.log('File uploaded! and url NULL Faield' + err);
				  })
				}
			  }

			  let communityID = {
				id : result.id
			  }

			  //작성자 구독 등록
			  await models.CommunitySubscriber.create({
				  PostID : result.id,
				  UserID : fields.get('userid')
			  }).then(subResult => {
				  console.log(communityPostInsertURL + 'CommunitySubscriber create success');
			  }).catch(err => {
				globalRouter.logger.error(communityPostInsertURL + "CommunitySubscriber create Faield" + err);	  
			  })
		
			  res.json(await communityFuncRouter.GetPostByID(communityID));
			}).catch(err => {
			  globalRouter.logger.error("CommunityPost Insert Faield" + err);
			  globalRouter.removefiles( __dirname + "/AllPhotos/temp/");
			  res.json(null);
			})
		
			let userData = {
			  userID : fields.get('userid')
			}
		
			let communityCount = await communityFuncRouter.PostCount(userData);
		
			let badgedata = {
			  category : 1,
			  part : '커뮤니티',
			  value : communityCount
			}
		
			let badgeTable = await badgeFuncRouter.SelectlevelBadge(badgedata);
		
			if(badgeTable != null && communityCount > badgeTable.Condition){
			  let badgeIdData = {
				badgeID : badgeTable.id,
				userID : fields.get('userid')
			  }
			  await badgeFuncRouter.Insert(badgeIdData);
			}
		
			//res.json(trans_object);
			//res.json(true);
		
			//마지막에 초기화!
			//JavaScript의 GC를 호출하기 위해서는 null로 초기화해야함.
			fileds = null;
			files = null;
			fields_array = null;
			files_array = null;
		
		  }).on('error', function (err) { //에러나면, 파일저장 진행된 id 값의 폴더 하위부분을 날려버릴까?
			  globalRouter.logger.error('[error] error ' + err);
			  globalRouter.removefiles( __dirname + "/AllPhotos/temp/");
			  res.json(null);
		  });
	}
  
    form.parse(req, function (error, field, file) { //이건 모지...
      console.log('[parse()] error : ' + error + ', field : ' + field + ', file : ' + file);
      console.log(communityPostInsertURL + 'upload success');
    });
});

var communityPostModifyURL = '/CommunityPost/Modify';
app.use(communityPostModifyURL, async (req, res) => {
    console.log(communityPostModifyURL + 'do');

    var fields = new Map();
    var fields_array = []; //배열에 저장해서 넘기기
    // 텍스트 값
    var files = [];
    var files_array = []; //배열에 저장해서 넘기기
    // 이미지 파일
  
    var form = new formidable.IncomingForm();
    var pathss = [];
  
    form.encoding = 'utf-8';
    form.uploadDir = __dirname + "/AllPhotos/temp/";
    form.multiples = true;
    form.keepExtensions = true;
  
    form.on('field', function (field, value) { //값 하나당 한번씩 돌아가므로,
      console.log(field);
      fields.set(field, value);
      fields_array.push(value); //값 순서대로 배열에 쌓아준다.
	});
	
	//토큰 검사
	if(false == verify.verifyToken(fields.get('accessToken'))){
		console.log(communityPostModifyURL + 'verify failed');
		res.json(null);
		return;
	}else{
		form.on('file', function (field, file) {
			files.push([field, file.name]);
			console.log("what is file name in form.on file", file.name);
			files_array.push(file);
		
		  }).on('end', async function () { //파일이 다 넘어오면 그 때 "이건 한 번 실행됨"
			await models.CommunityPost.update(
			  {
				  Category: fields.get('category'),
				  Title: fields.get('title'),
				  Contents: fields.get('contents'),
			  },
			  {
				  where : {id : fields.get('id')}
			  }
			).then(result => {
			  console.log(communityPostModifyURL + "Success");
			  globalRouter.makeFolder('CommunityPhotos/' + fields.get('id')); //생성된 커뮤니티 글 id 값으로 폴더 생성 //한번만 만들어짐 !
			  for (var i = 1; i <= 3; ++i) {
				globalRouter.makeFolder('CommunityPhotos/' + fields.get('id') + "/" + i.toString());
			  }
	  
			  for (var i = 0; i < 3; i++) { //path에 경로 저장
				  pathss[i] = __dirname + "/CommunityPhotos/" + fields.get('id') + "/" + (i + 1) + "/";
			  }
	  
			  return result; // result 값 다음 then 으로 넘김
		  }).then(async result2 => { //프로필 사진 폴더내 파일들 모두 삭제
			  const res = await globalRouter.removefiles(pathss);
			  console.log('file remove part done AND result', res);
			  return result2;
		  }).then(async result3 => {
	  
			  await globalRouter.sleep(1000); //for delay not to make twist
			  
			  for (var i = 0; i < 3; ++i) {
				if (i < files_array.length) {
				  fs_extra.rename(files_array[i].path, './CommunityPhotos/' + fields.get('id') + "/" + (i + 1) + "/" + files_array[i].name); //파일 앞서 만든 폴더에 저장
				} else {
				  console.log("file array length is", files_array.length, ", so don't have to insert right folder after folder");
				}
			  }
			  console.log('files array length', files_array.length);
		
			  let MAX_CNT = 3; //사진 최대 개수
			  let column_base_name = 'ImageUrl';
			  for (var i = 0; i < MAX_CNT; ++i) {
				let column = column_base_name + (i + 1).toString();
		
				if (i < files_array.length) { //어레이에 값 차있으면 ( 이미지 파일 있으면 )
				  //sharping(result_id, Destination, i, files_array_name, size, qualityNum, mimetype)
				  //커뮤니티는 60*60 크기의 사진만 필요
				  //globalRouter.sharping(fields.get('id'), '/../CommunityPhotos/', i, files_array[i].name, 120, 100,  globalRouter.getImgMime(files_array[i].name));
				  // globalRouter.sharping(result.id, '/../CommunityPhotos/', i, files_array[i].name, 60, 100,  globalRouter.getImgMime(files_array[i].name));
	  
				  var dimensions = await imageSize('./CommunityPhotos/' + fields.get('id') + "/" + (i + 1) + "/" + files_array[i].name);
				  globalRouter.realSharping(fields.get('id'), '/../CommunityPhotos/', i, files_array[i].name, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(files_array[i].name));
		
				  await models.CommunityPost.update(
					{
					  [column]: '/CommunityPhotos/' + fields.get('id') + "/" + (i + 1) + "/" + files_array[i].name//우선 이게 맞는건 아니고 잘 들어가는지만 확인
					},
					{
					  where:
					  {
						id: fields.get('id')
					  }
					}).then(updateResult => {
					  console.log('File uploaded! and url updated Success' + updateResult);
					}).catch(err => {
					  console.log('File uploaded! and url updated Faield' + err);
					})
				} else {
				  await models.CommunityPost.update(
					{
					  [column]: null
					}, {
					where: {
					  id: fields.get('id')
					}
				  }).then(updateResult => {
					console.log('File uploaded! and url NULL Success' + updateResult);
				  }).catch(err => {
					console.log('File uploaded! and url NULL Faield' + err);
				  })
				}
			  }

			  let communityID = {
				id : fields.get('id')
			  }
		
			  res.json(await communityFuncRouter.GetPostByID(communityID));
			}).catch(err => {
			  globalRouter.logger.error(communityPostModifyURL + " Faield " + err);
			  globalRouter.removefiles( __dirname + "/AllPhotos/temp/");
			  res.json(null);
			})

			//마지막에 초기화!
			fileds = null;
			files = null;
			fields_array = null;
			files_array = null;
			pathss = null;
		
		  }).on('error', function (err) { //에러나면, 파일저장 진행된 id 값의 폴더 하위부분을 날려버릴까?
			  globalRouter.logger.error('[error] error ' + err);
			  globalRouter.removefiles( __dirname + "/AllPhotos/temp/");
			  res.json(null);
		  });
	}
  
    form.parse(req, function (error, field, file) { //이건 모지...
      console.log('[parse()] error : ' + error + ', field : ' + field + ', file : ' + file);
      console.log(communityPostModifyURL + 'upload success');
    });
});

var teamProfileModifyURL = '/Team/ProfileModify';
app.use(teamProfileModifyURL, async (req, response) => {
    console.log(teamProfileModifyURL + 'do');
    // 텍스트 값 (사진이 아닌 값들)
    var fields = new Map(); var team_auth_values = []; var team_performance_values = []; var team_remove_id_values = []; var team_file_id_values = [];
    var team_win_values = [];
    // 이미지 파일
    var team_photo_files = [];
    var team_auth_files = []; var team_performance_files = []; var team_win_files = [];
    var pathss = new Array(); //for 5개의 폴더 path 저장
    var TEAMID;

    var form = new formidable.IncomingForm();

    form.encoding = 'utf-8';
    form.uploadDir = __dirname + "/AllPhotos/temp/"; //여기에 우선 저장하고 넘기기
    form.multiples = true;
    form.keepExtensions = true;

    form.on('field', function (field, value) {
		fields.set(field, value);
		if(field == 'removeidlist') team_remove_id_values.push(value);
		else if(field == 'fileidlist') team_file_id_values.push(value);
        else if (field == 'tauthcontents') team_auth_values.push(value);
        else if (field == 'tperformancecontents') team_performance_values.push(value);
        else if (field == 'twincontents') team_win_values.push(value);
        else console.log('this file has no fieldname');
	});
	
	//토큰 검사
	if(false == verify.verifyToken(fields.get('accessToken'))){
		console.log(teamProfileModifyURL + 'verify failed');
		response.json(null);
		return;
	}else{
		form.on('file', function (field, file) {
			if (field == 'TeamPhoto') team_photo_files.push(file);
			else if (field == 'TAuthAuthImg') team_auth_files.push(file);
			else if (field == 'TPerformanceAuthImg') team_performance_files.push(file);
			else if (field == 'TWinAuthImg') team_win_files.push(file);
			else console.log('this file has no fieldname');
	
		}).on('end', async function () { //파일이 다 넘어오면 그 때 "이건 한 번 실행됨"
	
			await models.team.update( //팀 테이블 수정
				{
					Name: fields.get('name'),
					Information: fields.get('information'),
					Category: fields.get('category'),
					Part: fields.get('part'),
					Location: fields.get('location'),
					SubLocation: fields.get('sublocation'),
					PossibleJoin: fields.get('possiblejoin'),
					Badge1: fields.get('badge1'),
					Badge2: fields.get('badge2'),
					Badge3: fields.get('badge3'),
				}, {
				where: { id: fields.get('teamid') }
			}).then(async result1 => { //result1 = user 테이블에서 현재 UserID 값이 id 값과 같은 row 값
				console.log("user data Insert Success");
	
				TEAMID = fields.get('teamid'); //team 테이블에서 PK값이 rtn 되어야함

				globalRouter.makeFolder('TeamPhotos/' + fields.get('teamid')); // teamid 값으로 프로필사진 폴더 생성
				for (var i = 1; i <= 5; ++i) { //그안에 1~5개의 폴더 순서대로 생성
					globalRouter.makeFolder('TeamPhotos/' + fields.get('teamid') + "/" + i.toString());
				}

				globalRouter.makeFolder('TeamAuth/TAuthAuth/' +  fields.get('teamid')); // team row PK 값으로 기업 증명사진 폴더 생성
				globalRouter.makeFolder('TeamAuth/TPerformanceAuth/' +  fields.get('teamid')); // team row PK 값으로 수행증명사진 폴더 생성
				globalRouter.makeFolder('TeamAuth/TWinAuth/' +  fields.get('teamid')); // team row PK 값으로 수상증명사진 폴더 생성
	
				if(fields.get('isChangePhotos') == 1){
					for (var i = 0; i < team_remove_id_values.length; i++) { //path에 경로 저장

						await models.TeamPhoto.findOne({
							where : {
								id : team_remove_id_values[i]
							}
						}).then(result => {
							console.log('team remove photo list add success' + result);
							pathss[i] = __dirname + (result.ImgUrl).substring(0, (result.ImgUrl.lastIndexOf("/")));
	
							result.destroy({}).then(result => {
								console.log("team photo table destroy");
							})
						}).catch(err => {
							globalRouter.logger.error('team remove photo list add error' + err);
						})
					}
				}

				return result1;
	
			}).then(async result2 => { //프로필 사진 폴더내 파일들 모두 삭제
				if(fields.get('isChangePhotos') == 1){
					if(team_remove_id_values.length > 0){
						const result = await globalRouter.removefiles(pathss);
						console.log('file remove part done AND result', result);
					}
				}
				return result2;
			}).then(async result3 => { //result1 = teamid 테이블에서 현재 teamid 값이 id 값과 같은 row 값

				if(fields.get('isChangePhotos') == 1){
					for(var i = 0 ; i < team_file_id_values.length ; ++i){
						if(team_file_id_values[i] != "-1"){
							await models.TeamPhoto.update(
								{
									Index : i
								},
								{
									where : { id : team_file_id_values[i]}
								}
							).then(result => {
								console.log('teamphoto update is success' + result);
							}).catch(err => {
								console.log('teamphoto update is error' + err);
							})
						}else {
							fs_extra.rename(team_photo_files[i].path, './TeamPhotos/' + fields.get('teamid') + "/" + (i + 1) + "/" + team_photo_files[i].name); //파일 앞서 만든 폴더에 저장

							var dimensions = await imageSize('./TeamPhotos/' + fields.get('teamid') + "/" + (i + 1) + "/" + team_photo_files[i].name);
							globalRouter.realSharping(fields.get('teamid'), '/../TeamPhotos/', i, team_photo_files[i].name, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(team_photo_files[i].name));
							globalRouter.realSharping(fields.get('teamid'), '/../TeamPhotos/', i, team_photo_files[i].name, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(team_photo_files[i].name));

							await models.TeamPhoto.create({
								TeamID : fields.get('teamid'),
								ImgUrl : '/TeamPhotos/' + fields.get('teamid') + "/" + (i + 1) + "/" + team_photo_files[i].name,
								Index : i
							}).then(result => {
								console.log("teamphoto create is Success" + result);
							}).catch(err => {
								globalRouter.logger.error("teamphoto create is error" + err);
							})
						}
					}
				}
				
				return result3;
	
			}).then(async result6 => { //Team auth 차있으면

				console.log('result6 part and team auth value len :', team_auth_values.length);
		
				if (team_auth_values.length > 0) { //들어오는 career 값 있으면
				
					await models.teamauth.findAll({
						where: { TATeamID: fields.get('teamid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < team_auth_values.length; ++i){								
									fs_extra.rename(team_auth_files[i].path, './TeamAuth/TAuthAuth/' + fields.get('teamid') + "/"  + i + '_' + team_auth_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.teamauth.create({
										TATeamID: fields.get('teamid'),
										TAuthContents: team_auth_values[i],
										TAuthImgUrl: '/TeamAuth/TAuthAuth/' + fields.get('teamid') + "/"  + i + '_' + team_auth_files[i].name,
										TAuthAuth: '2'
									}).then(result => {
										console.log('team auth add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < team_auth_values.length ? res.length : team_auth_values.length;
								var maxLength = res.length > team_auth_values.length ? res.length : team_auth_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].TAuthContents != team_auth_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].TAuthImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].TAuthImgUrl); //있던 이미지 삭제
												console.log('team auth Img delete success', res[i].TAuthImgUrl);
											}else{
												console.log('team auth Img is not exists', res[i].TAuthImgUrl);
											}
										});

										await models.teamauth.destroy({ 
											where: { TAuthContents: res[i].TAuthContents }
										}).then(result => {
											console.log('team auth delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(team_auth_files[i].path, './TeamAuth/TAuthAuth/' + fields.get('teamid') + "/"  + i + '_' + team_auth_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.teamauth.create({
											TATeamID: fields.get('teamid'),
											TAuthContents: team_auth_values[i],
											TAuthImgUrl: '/TeamAuth/TAuthAuth/' + fields.get('teamid') + "/" + i + '_' + team_auth_files[i].name,
											TAuthAuth: '2'
										}).then(result => {
											console.log('team auth add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.teamauth.update(
											{
												TAuthAuth : res[i].TAuthAuth
											},
											{
												where : {TAuthContents: res[i].TAuthContents }
											}
										).then(result => {
											console.log('team auth update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(team_auth_files[i].path, './TeamAuth/TAuthAuth/' + fields.get('teamid') + "/" + i + '_' + team_auth_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.teamauth.create({
										TATeamID: fields.get('teamid'),
										TAuthContents: team_auth_values[i],
										TAuthImgUrl: '/TeamAuth/TAuthAuth/' + fields.get('teamid') + "/" + i + '_' +  team_auth_files[i].name,
										TAuthAuth: '2'
									}).then(result => {
										console.log('team auth add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
							console.log('error occured while finding from team auth ' + err);
						})
							console.log('team auth flow done');
						return result6;

					} else { //remove all files and DB rows
						console.log('no team auth value input, So delete all');
				
						await models.teamauth.findAll({
							where: { TATeamID: fields.get('teamid')}
						}).then(async res => {
							for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
							await models.teamauth.findOne({
								where: { TAuthContents: res[i].TAuthContents } //각 ImgUrl 값 찾아서 이미지 삭제
							}).then(AuthResult => {
								fs.exists(__dirname + AuthResult.TAuthImgUrl, function(exists) {
									if(exists){
										fs.unlinkSync(__dirname + AuthResult.TAuthImgUrl); //있던 이미지 삭제
										console.log('team auth Img delete success', AuthResult.TAuthImgUrl);
									}else{
										console.log('team auth Img is not exists', AuthResult.TAuthImgUrl);
									}
								});
								console.log('team auth Img delete success', AuthResult.TAuthImgUrl);
							})
							}
						}).then(async () => { //row 다 날려줌
							await models.teamauth.destroy({ 
								where: { TATeamID: fields.get('teamid') }
							}).then(result => {
								console.log('team auth delete success', result);
							}).catch(err => { //삭제에 문제가 생기면
								globalRouter.logger.error(err);
							})
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
	
						console.log('team auth flow done');
						return result6;
					}
			}).then(async result7 => { //team performance 차있으면

				console.log('result7 part and team performance value len :', team_performance_values.length);
		
				if (team_performance_values.length > 0) { //들어오는 career 값 있으면
				
					await models.teamperformance.findAll({
						where: { TPTeamID: fields.get('teamid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < team_performance_values.length; ++i){								
									fs_extra.rename(team_performance_files[i].path, './TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.teamperformance.create({
										TPTeamID: fields.get('teamid'),
										TPerformContents: team_performance_values[i],
										TPerformImgUrl: '/TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name,
										TPerformAuth: '2'
									}).then(result => {
										console.log('team performance add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < team_performance_values.length ? res.length : team_performance_values.length;
								var maxLength = res.length > team_performance_values.length ? res.length : team_performance_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].TPerformContents != team_performance_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].TPerformImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].TPerformImgUrl); //있던 이미지 삭제
												console.log('team performance Img delete success', res[i].TPerformImgUrl);
											}else{
												console.log('team performance Img is not exists', res[i].TPerformImgUrl);
											}
										});

										await models.teamperformance.destroy({ 
											where: { TPerformContents: res[i].TPerformContents }
										}).then(result => {
											console.log('team performance delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(team_performance_files[i].path, './TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.teamperformance.create({
											TPTeamID: fields.get('teamid'),
											TPerformContents: team_performance_values[i],
											TPerformImgUrl: '/TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name,
											TPerformAuth: '2'
										}).then(result => {
											console.log('team performance add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.teamperformance.update(
											{
												TPerformAuth : res[i].TPerformAuth
											},
											{
												where : {TPerformContents: res[i].TPerformContents }
											}
										).then(result => {
											console.log('team performance update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(team_performance_files[i].path, './TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.teamperformance.create({
										TPTeamID: fields.get('teamid'),
										TPerformContents: team_performance_values[i],
										TPerformImgUrl: '/TeamAuth/TPerformanceAuth/' + fields.get('teamid') + "/" + i + '_' + team_performance_files[i].name,
										TPerformAuth: '2'
									}).then(result => {
										console.log('team performance add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
							console.log('error occured while finding from team performance ' + err);
						})
							console.log('team performance flow done');
						return result7;

					} else { //remove all files and DB rows
						console.log('no team performance value input, So delete all');
				
						await models.teamperformance.findAll({
							where: { TPTeamID: fields.get('teamid')}
						}).then(async res => {
							for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
							await models.teamperformance.findOne({
								where: { TPerformContents: res[i].TPerformContents } //각 ImgUrl 값 찾아서 이미지 삭제
							}).then(PerformanceResult => {
								fs.exists(__dirname + PerformanceResult.TPerformImgUrl, function(exists) {
									if(exists){
										fs.unlinkSync(__dirname + PerformanceResult.TPerformImgUrl); //있던 이미지 삭제
										console.log('team performance Img delete success', PerformanceResult.TPerformImgUrl);
									}else{
										console.log('team performance Img is not exists', PerformanceResult.TPerformImgUrl);
									}
								});
								console.log('team performance Img delete success', PerformanceResult.TPerformImgUrl);
							})
							}
						}).then(async () => { //row 다 날려줌
							await models.teamperformance.destroy({ 
								where: { TPTeamID: fields.get('teamid') }
							}).then(result => {
								console.log('team performance delete success', result);
							}).catch(err => { //삭제에 문제가 생기면
								globalRouter.logger.error(err);
							})
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
	
						console.log('team performance flow done');
						return result7;
					}
			}).then(async result8 => { //WIN 차있으면

				console.log('result7 part and team win value len :', team_win_values.length);
		
				if (team_win_values.length > 0) { //들어오는 career 값 있으면
				
					await models.teamwin.findAll({
						where: { TWTeamID: fields.get('teamid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < team_win_values.length; ++i){								
									fs_extra.rename(team_win_files[i].path, './TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.teamwin.create({
										TWTeamID: fields.get('teamid'),
										TWinContents: team_win_values[i],
										TWinImgUrl: '/TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name,
										TWinAuth: '2'
									}).then(result => {
										console.log('team win add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < team_win_values.length ? res.length : team_win_values.length;
								var maxLength = res.length > team_win_values.length ? res.length : team_win_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].TWinContents != team_win_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].TWinImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].TWinImgUrl); //있던 이미지 삭제
												console.log('team win Img delete success', res[i].TWinImgUrl);
											}else{
												console.log('team win Img is not exists', res[i].TWinImgUrl);
											}
										});

										await models.teamwin.destroy({ 
											where: { TWinContents: res[i].TWinContents }
										}).then(result => {
											console.log('team win delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(team_win_files[i].path, './TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.teamwin.create({
											TWTeamID: fields.get('teamid'),
											TWinContents: team_win_values[i],
											TWinImgUrl: '/TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name,
											TWinAuth: '2'
										}).then(result => {
											console.log('team win add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.teamwin.update(
											{
												TWinAuth : res[i].TWinAuth
											},
											{
												where : {TWinContents: res[i].TWinContents }
											}
										).then(result => {
											console.log('team win update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(team_win_files[i].path, './TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.teamwin.create({
										TWTeamID: fields.get('teamid'),
										TWinContents: team_win_values[i],
										TWinImgUrl: '/TeamAuth/TWinAuth/' + fields.get('teamid') + "/" + i + '_' + team_win_files[i].name,
										TWinAuth: '2'
									}).then(result => {
										console.log('team win add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
							console.log('error occured while finding from team win ' + err);
						})
							console.log('team win flow done');
						return result8;

					} else { //remove all files and DB rows
						console.log('no team win value input, So delete all');
				
						await models.teamwin.findAll({
							where: { TWTeamID: fields.get('teamid')}
						}).then(async res => {
							for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
							await models.teamwin.findOne({
								where: { TWinImgUrl: res[i].TWinImgUrl } //각 ImgUrl 값 찾아서 이미지 삭제
							}).then(WinResult => {
								fs.exists(__dirname + WinResult.TWinImgUrl, function(exists) {
									if(exists){
										fs.unlinkSync(__dirname + WinResult.TWinImgUrl); //있던 이미지 삭제
										console.log('team win Img delete success', WinResult.TWinImgUrl);
									}else{
										console.log('team win Img is not exists', WinResult.TWinImgUrl);
									}
								});
								console.log('team win Img delete success', WinResult.TWinImgUrl);
							})
							}
						}).then(async () => { //row 다 날려줌
							await models.teamwin.destroy({ 
								where: { TWTeamID: fields.get('teamid') }
							}).then(result => {
								console.log('team win delete success', result);
							}).catch(err => { //삭제에 문제가 생기면
								globalRouter.logger.error(err);
							})
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
	
						console.log('team win flow done');
						return result8;
					}
			}).catch(err => {
				console.log("team Update Failed" + err);
				response.status(400).json(null);
				return;
			})
			console.log("team Update Success");
	
			await models.team.findOne({
				where : {
				  id: fields.get('teamid')
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
			  }).then(async result =>{
		  
				console.log(result);
		  
				let badgedata = {
				  category : 1,
				  part : '프로필',
				  value : globalRouter.IsEmpty(result.TeamPhotos) ? 70 : 100
				}
			
				let badgeTable = await badgeFuncRouter.SelectlevelTeamBadge(badgedata);
			
				if(badgeTable != null && globalRouter.IsEmpty(result.TeamPhotos) ? 70 : 100 >= badgeTable.Condition){
				  let badgeIdData = {
					badgeID : badgeTable.id,
					teamID : result.id
				  }
				  await badgeFuncRouter.InsertTeam(badgeIdData);
				}
			  })
	
			response.status(200).json(await teamFuncRouter.selectTeamByID(fields.get('teamid')));
		  
			//마지막에 초기화!
			fields = null; team_auth_values = null; team_performance_values = null; team_win_values = null;
			team_photo_files = null;
			team_auth_files = null; team_performance_files = null; team_win_files = null; pathss = null;
	
		}).on('error', function (err) { //에러나면, 파일저장 진행된 id 값의 폴더 하위부분을 날려버릴까?
			globalRouter.logger.error('[error] error ' + err);
			globalRouter.removefiles( __dirname + "/AllPhotos/temp/")
			response.status(400).json(null);
		});	
	}

    //end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
    form.parse(req, function (error, field, file) {
        console.log('[parse()] error : ' + error + ', field : ' + field + ', file : ' + file);
        console.log(teamProfileModifyURL + 'upload success');
    });
});

var teamProfileInsertURL = '/Team/Insert';
app.use(teamProfileInsertURL, async (req, response) => {
    console.log(teamProfileInsertURL + 'do');
    let data = req.body;

    //텍스트 값 (사진이 아닌 값들)
    var fields = new Map(); var team_auth_values = []; var team_performance_values = [];
    var team_win_values = [];  
    var TEAMID; //for get PK from team row
    // 이미지 파일
    var team_photo_files = [];
    var team_auth_files = []; var team_performance_files = []; var team_win_files = [];
    var pathss = new Array(); //for 5개의 폴더 path 저장
    var teamID = 0;
    var form = new formidable.IncomingForm();

    form.encoding = 'utf-8';
    form.uploadDir = __dirname + "/AllPhotos/temp/"; //여기에 우선 저장하고 넘기기
    form.multiples = true;
    form.keepExtensions = true;

    form.on('field', function (field, value) {
        fields.set(field, value);
        if (field == 'tauthcontents') team_auth_values.push(value);
        else if (field == 'tperformancecontents') team_performance_values.push(value);
        else if (field == 'twincontents') team_win_values.push(value);
        else console.log('this file has no fieldname');
    });

	console.log('what is leaderid', fields.get('leaderid'));
	
	//토큰 검사
	if(false == verify.verifyToken(fields.get('accessToken'))){
		console.log(teamProfileInsertURL + 'verify failed');
		response.json(null);
		return;
	}else{
		form.on('file', function (field, file) {
			if (field == 'TeamPhoto') team_photo_files.push(file);
			else if (field == 'TAuthAuthImg') team_auth_files.push(file);
			else if (field == 'TPerformanceAuthImg') team_performance_files.push(file);
			else if (field == 'TWinAuthImg') team_win_files.push(file);
			else console.log('this file has no fieldname');
	
		}).on('end', async function () { //파일이 다 넘어오면 그 때 "이건 한 번 실행됨"
	
			await models.team.create( //팀 테이블 생성
				{
					LeaderID: fields.get('leaderid'),
					Name: fields.get('name'),
					Information: fields.get('information'),
					Category: fields.get('category'),
					Part: fields.get('part'),
					Location: fields.get('location'),
					SubLocation: fields.get('sublocation'),
					PossibleJoin: fields.get('possiblejoin'),
					Badge1 : 0,
					Badge2 : 0,
					Badge3 : 0
				}).then(result => { //이거 새로 넣었는데 이해를 제대로 하고 적용해야 할 
					if (globalRouter.IsEmpty(result) == false) {
						teamID = result.id;
	
						var roomInfoData = JSON.stringify({
							roomName: 'teamID' + result.id + 'userID' + fields.get('leaderid'),
							userID: fields.get('leaderid'),
							type : 2,
							max: 30,
						})
			
						var roomInsertResult = roomFuncRouter.insertRoomInfoAndUser(roomInfoData);
						
						return result; //? 맞나?
					}
					else {
						console.log("already data team info");
						return error
					}
	
				}).then(result1 => { //result1 = user 테이블에서 현재 UserID 값이 id 값과 같은 row 값
	
					TEAMID = result1.id; //team 테이블에서 PK값이 rtn 되어야함
					console.log("TEAMID = result.id\nTEAMID = ", TEAMID, "/ result1.id= ", result1.id, "\nuser data Insert Success");
	

					globalRouter.makeFolder('TeamPhotos/' + TEAMID); // teamid 값으로 프로필사진 폴더 생성
					for (var i = 1; i <= 5; ++i) { //그안에 1~5개의 폴더 순서대로 생성
						globalRouter.makeFolder('TeamPhotos/' + TEAMID + "/" + i.toString());
					}
					globalRouter.makeFolder('TeamAuth/TAuthAuth/' + TEAMID); // team row PK 값으로 기업 증명사진 폴더 생성
					globalRouter.makeFolder('TeamAuth/TPerformanceAuth/' + TEAMID); // team row PK 값으로 수행증명사진 폴더 생성
					globalRouter.makeFolder('TeamAuth/TWinAuth/' + TEAMID); // team row PK 값으로 수상증명사진 폴더 생성
	
					for (var i = 0; i < 5; i++) { //path에 경로 저장
						pathss[i] = __dirname + "/TeamPhotos/" + TEAMID + "/" + (i + 1) + "/";
					}
					return result1;
	
				}).then(async result3 => { //result1 = user 테이블에서 현재 UserID 값이 id 값과 같은 row 값
					console.log('team photo files array len: ', team_photo_files.length);

					for(var i = 0 ; i < team_photo_files.length ; ++i){
						fs_extra.rename(team_photo_files[i].path, './TeamPhotos/' + TEAMID + "/" + (i + 1) + "/" + team_photo_files[i].name); //파일 앞서 만든 폴더에 저장

						var dimensions = await imageSize('./TeamPhotos/' + TEAMID + "/" + (i + 1) + "/" + team_photo_files[i].name);
						globalRouter.realSharping(TEAMID, '/../TeamPhotos/', i, team_photo_files[i].name, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(team_photo_files[i].name));
						globalRouter.realSharping(TEAMID, '/../TeamPhotos/', i, team_photo_files[i].name, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(team_photo_files[i].name));

						await models.TeamPhoto.create({
							TeamID : TEAMID,
							ImgUrl : '/TeamPhotos/' + TEAMID + "/" + (i + 1) + "/" + team_photo_files[i].name,
							Index : i
						}).then(result => {
							console.log("teamphoto create is Success" + result);
						}).catch(err => {
							globalRouter.logger.error("teamphoto create is error" + err);
						})
					}

					return result3;
	
				}).then(async result6 => { //team auth 차있으면
					console.log('this result6 part and team_auth values len:', team_auth_values.length);
	
					if (team_auth_files.length == team_auth_values.length) { //문제없는 경우
						for (var i = 0; i < team_auth_values.length; ++i) { //들어온 값 만큼 row 만들어주기
							console.log('what is team auth file path:', team_auth_files[i].path);
							fs_extra.rename(team_auth_files[i].path, './TeamAuth/TAuthAuth/' + TEAMID + "/" + i + '_' + team_auth_files[i].name); //파일 앞서 만든 폴더에 저장
							await models.teamauth.create({
								TATeamID: TEAMID,
								TAuthContents: team_auth_values[i],
								TAuthImgUrl: '/TeamAuth/TAuthAuth/' + TEAMID + "/" + i + '_' + team_auth_files[i].name,
								TAuthAuth: '2'
							}).then(result => {
								console.log('team auth add success', result);
							}).catch(err => { //더하는데에 문제가 생기면
								console.error(err);
								return err;
							})
						}
						console.log('team auth flow done');
						return result6;
					} else {
						console.log('team auth flow done');
						return error;
					}
	
				}).then(async result7 => { //License 차있으면
					console.log('result7 part and team performance values.len :', team_performance_values.length);
	
					if (team_performance_files.length == team_performance_values.length) {
						for (var i = 0; i < team_performance_values.length; ++i) {
							console.log('what is team performance file path:', team_performance_files[i].path);
							fs_extra.rename(team_performance_files[i].path, './TeamAuth/TPerformanceAuth/' + TEAMID + "/" + i + '_' + team_performance_files[i].name); //파일 앞서 만든 폴더에 저장
							await models.teamperformance.create({
								TPTeamID: TEAMID,
								TPerformContents: team_performance_values[i],
								TPerformImgUrl: '/TeamAuth/TPerformanceAuth/' + TEAMID + "/" + i + '_' + team_performance_files[i].name,
								TPerformAuth: '2'
							}).then(result => {
								console.log('team performance add success', result);
							}).catch(err => { //더하는데에 문제가 생기면
								console.error(err);
								return err;
							})
						}
	
						console.log('team performance flow done');
						return result7;
					} else {
						console.log('team performance flow done');
						return error;
					}
				}).then(async result8 => { //WIN 차있으면
					console.log('result8 part and team win values.len :', team_win_values.length);
					if (team_win_files.length == team_win_values.length) {
						for (var i = 0; i < team_win_values.length; ++i) { //row에 있는 값 res[i].PfWinContents 가 들어온 twincontents(team_win_values[])값들과 같은지 확인
							console.log('what is team win file path:', team_win_files[i].path);
							fs_extra.rename(team_win_files[i].path, './TeamAuth/TWinAuth/' + TEAMID + "/" + i + '_' + team_win_files[i].name); //파일 앞서 만든 폴더에 저장
							await models.teamwin.create({
								TWTeamID: TEAMID,
								TWinContents: team_win_values[i],
								TWinImgUrl: '/TeamAuth/TWinAuth/' + TEAMID + "/" + i + '_' + team_win_files[i].name,
								TWinAuth: '2'
							}).then(result => {
								console.log('team win add success', result);
							}).catch(err => { //더하는데에 문제가 생기면
								console.error(err);
								return err;
							})
						}
						console.log('team win flow done');
						return result8;
					} else {
						console.log('team win flow done');
						return error;
					}
				}).catch(err => {
					globalRouter.logger.error(teamProfileInsertURL + "Insert Failed" + err);
					globalRouter.removefiles( __dirname + "/AllPhotos/temp/");
					return err
				})
			console.log("Insert Success");
			
			//res.json(await teamFuncRouter.selectTeamByID(teamID));
			response.status(200).send(await teamFuncRouter.selectTeamByID(teamID));
	
			//마지막에 초기화! //하하
			TEAMID = null;
			fields = null; team_auth_values = null; team_performance_values = null; team_win_values = null;
			team_photo_files = null;
			team_auth_files = null; team_performance_files = null; team_win_files = null; pathss = null;
	
		}).on('error', function (err) { //에러나면, 파일저장 진행된 id 값의 폴더 하위부분을 날려버릴까?
			globalRouter.logger.error('[error] error ' + err);
			globalRouter.removefiles( __dirname + "/AllPhotos/temp/")
			response.json(null);
		});
	}

    //end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
    form.parse(req, function (error, field, file) {
        console.log('[parse()] error : ' + error + ', field : ' + field + ', file : ' + file);
        console.log(teamProfileInsertURL + 'upload success');
    });
});

var personalProfileModifyURL = '/Personal/ProfileModify';
app.use(personalProfileModifyURL, async (req, res) => {
    console.log(personalProfileModifyURL + 'do');

    //텍스트 값 (사진이 아닌 값들)
    var fields = new Map(); var profile_career_values = []; var profile_univ_values = []; var profile_remove_photo_id_values = []; var profile_file_photo_id_values = [];
    var profile_license_values = []; var profile_win_values = []; var profile_
    // 이미지 파일
    var profile_photo_files = []; var profile_univ_files = [];  var profile_career_files = []; 
    var profile_license_files = []; var profile_win_files = []; var pathss = new Array(); //for 5개의 폴더 path 저장
    var form = new formidable.IncomingForm();

    form.encoding = 'utf-8';
    form.uploadDir = __dirname + "/AllPhotos/temp/"; //여기에 우선 저장하고 넘기기
    form.multiples = true;
    form.keepExtensions = true;

    form.on('field', function (field, value) {
		fields.set(field, value);

		if (field == 'removeidlist') profile_remove_photo_id_values.push(value);
		else if(field == 'fileidlist') profile_file_photo_id_values.push(value);
 		else if (field == 'pfcareercontents') profile_career_values.push(value);
		else if(field == 'pfunivnames') profile_univ_values.push(value);
		else if (field == 'pflicensecontents') profile_license_values.push(value);
		else if (field == 'pfwincontents') profile_win_values.push(value);
		else console.log('this file has no fieldname');
	});
	
	//토큰 검사
	if(false == verify.verifyToken(fields.get('accessToken'))){
		console.log(personalProfileModifyURL + 'verify failed');
		res.json(null);
		return;
	}else{
		form.on('file', function (field, file) {
			if (field == 'ProfilePhoto') profile_photo_files.push(file);
			else if (field == 'PfUnivAuthImg') profile_univ_files.push(file);
			else if (field == 'PfCareerAuthImg') profile_career_files.push(file);
			else if (field == 'PfLicenseAuthImg') profile_license_files.push(file);
			else if (field == 'PfWinAuthImg') profile_win_files.push(file);
			else console.log('this file has no fieldname');
		
			}).on('end', async function () { //파일이 다 넘어오면 그 때 "이건 한 번 실행됨"
		
			await models.user.update( //유저 테이블 수정
				{
					Name: fields.get('name'),
					Information: fields.get('information'),
					Job: fields.get('job'),
					Part: fields.get('part'),
					SubJob: fields.get('subjob'),
					SubPart: fields.get('subpart'),
					Location: fields.get('location'),
					SubLocation: fields.get('sublocation'),
					Badge1: fields.get('badge1'),
					Badge2: fields.get('badge2'),
					Badge3: fields.get('badge3'),
				}, {
				where: { UserID: fields.get('userid') }
			}).then(async result1 => { //result1 = user 테이블에서 현재 UserID 값이 id 값과 같은 row 값
				console.log("user data Insert Success");
		
				globalRouter.makeFolder('ProfilePhotos/' + fields.get('userid')); // UserID 값으로 프로필사진 폴더 생성
				for (var i = 1; i <= 5; ++i) { //그안에 1~5개의 폴더 순서대로 생성
					globalRouter.makeFolder('ProfilePhotos/' + fields.get('userid') + "/" + i.toString());
				}
		
				globalRouter.makeFolder('ProfileAuth/PfUnivAuth/' + fields.get('userid')); // UserID 값으로 대학증명사진 폴더 생성
				globalRouter.makeFolder('ProfileAuth/PfCareerAuth/' + fields.get('userid')); // UserID 값으로 경력증명사진 폴더 생성
				globalRouter.makeFolder('ProfileAuth/PfLicenseAuth/' + fields.get('userid')); // UserID 값으로 자격증증명사진 폴더 생성
				globalRouter.makeFolder('ProfileAuth/PfWinAuth/' + fields.get('userid')); // UserID 값으로 수상증명사진 폴더 생성
		
				if(fields.get('isChangePhotos') == 1){
					for (var i = 0; i < profile_remove_photo_id_values.length; i++) { //path에 경로 저장

						await models.PersonalPhoto.findOne({
							where : {
								id : profile_remove_photo_id_values[i]
							}
						}).then(result => {
							console.log('profile remove photo list add success' + result);
							pathss[i] = __dirname + (result.ImgUrl).substring(0, (result.ImgUrl.lastIndexOf("/")));
	
							result.destroy({}).then(result => {
								console.log("profile photo table destroy");
							})
						}).catch(err => {
							globalRouter.logger.error('profile remove photo list add error' + err);
						})
					}
				}

				return result1;
			}).then(async result2 => { //프로필 사진 폴더내 파일들 모두 삭제
				if(fields.get('isChangePhotos') == 1){
					if(profile_remove_photo_id_values.length > 0){
						const result = await globalRouter.removefiles(pathss);
						console.log('file remove part done AND result', result);
					}
				}

				return result2;
		
			}).then(async result3 => { //result1 = user 테이블에서 현재 UserID 값이 id 값과 같은 row 값
				if(fields.get('isChangePhotos') == 1){
					for(var i = 0 ; i < profile_file_photo_id_values.length ; ++i){
						if(profile_file_photo_id_values[i] != "-1"){
							await models.PersonalPhoto.update(
								{
									Index : i
								},
								{
									where : { id : profile_file_photo_id_values[i]}
								}
							).then(result => {
								console.log('profilephoto update is success' + result);
							}).catch(err => {
								console.log('profilephoto update is error' + err);
							})
						}else {
							fs_extra.rename(profile_photo_files[i].path, './ProfilePhotos/' + fields.get('userid') + "/" + (i + 1) + "/" + profile_photo_files[i].name); //파일 앞서 만든 폴더에 저장

							var dimensions = await imageSize('./ProfilePhotos/' + fields.get('userid') + "/" + (i + 1) + "/" + profile_photo_files[i].name);
							globalRouter.realSharping(fields.get('userid'), '/../ProfilePhotos/', i, profile_photo_files[i].name, 120, dimensions.width / 2, dimensions.height / 2, 100,  globalRouter.getImgMime(profile_photo_files[i].name));
							globalRouter.realSharping(fields.get('userid'), '/../ProfilePhotos/', i, profile_photo_files[i].name, 60, dimensions.width / 4, dimensions.height / 4, 100,  globalRouter.getImgMime(profile_photo_files[i].name));

							await models.PersonalPhoto.create({
								UserID : fields.get('userid'),
								ImgUrl : '/ProfilePhotos/' + fields.get('userid') + "/" + (i + 1) + "/" + profile_photo_files[i].name,
								Index : i
							}).then(result => {
								console.log("profilephoto create is Success" + result);
							}).catch(err => {
								globalRouter.logger.error("profilephoto create is error" + err);
							})
						}
					}
				}
				
				return result3;
		
			}).then(async result4 => { //대학이름 차있으면

				console.log('result4 part and profile univ value len :', profile_univ_values.length);
		
				if (profile_univ_values.length > 0) { //들어오는 career 값 있으면
				
					await models.profileuniv.findAll({
						where: { PfUUserID: fields.get('userid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < profile_univ_values.length; ++i){								
									fs_extra.rename(profile_univ_files[i].path, './ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.profileuniv.create({
										PfUUserID: fields.get('userid'),
										PfUnivName: profile_univ_values[i],
										PfUnivImgUrl: '/ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name,
										PfUnivAuth: '2'
									}).then(result => {
										console.log('profile univ add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < profile_univ_values.length ? res.length : profile_univ_values.length;
								var maxLength = res.length > profile_univ_values.length ? res.length : profile_univ_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].PfUnivName != profile_univ_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].PfUnivImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].PfUnivImgUrl); //있던 이미지 삭제
												console.log('profile univ Img delete success', res[i].PfUnivImgUrl);
											}else{
												console.log('profile univ Img is not exists', res[i].PfUnivImgUrl);
											}
										});

										await models.profileuniv.destroy({ 
											where: { PfUnivName: res[i].PfUnivName }
										}).then(result => {
											console.log('profile career delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(profile_univ_files[i].path, './ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.profileuniv.create({
											PfUUserID: fields.get('userid'),
											PfUnivName: profile_univ_values[i],
											PfUnivImgUrl: '/ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name,
											PfUnivAuth: '2'
										}).then(result => {
											console.log('profile univ add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.profileuniv.update(
											{
												PfUnivAuth : res[i].PfUnivAuth
											},
											{
												where : {PfUnivName: res[i].PfUnivName }
											}
										).then(result => {
											console.log('profile univ update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(profile_univ_files[i].path, './ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.profileuniv.create({
										PfUUserID: fields.get('userid'),
										PfUnivName: profile_univ_values[i],
										PfUnivImgUrl: '/ProfileAuth/PfUnivAuth/' + fields.get('userid') + "/" + i + '_' + profile_univ_files[i].name,
										PfUnivAuth: '2'
									}).then(result => {
										console.log('profile univ add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
							console.log('error occured while finding from profile ' + err);
						})
							console.log('profile univ flow done');
						return result4;
			
				} else { //remove all files and DB rows
					console.log('no profile univ auth value input, So delete all');
			
					await models.profileuniv.findAll({
						where: { PfUUserID: fields.get('userid') }
					}).then(async res => {
						for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
						await models.profileuniv.findOne({
							where: { PfUnivName: res[i].PfUnivName } //각 ImgUrl 값 찾아서 이미지 삭제
						}).then(UnivResult => {
							fs.exists(__dirname + UnivResult.PfUnivImgUrl, function(exists) {
								if(exists){
									fs.unlinkSync(__dirname + UnivResult.PfUnivImgUrl); //있던 이미지 삭제
									console.log('profile univ Img delete success', UnivResult.PfUnivImgUrl);
								}else{
									console.log('profile univ Img is not exists', UnivResult.PfUnivImgUrl);
								}
							});
							console.log('profile univ Img delete success', UnivResult.PfUnivImgUrl);
						})
						}
					}).then(async () => { //row 다 날려줌
						await models.profileuniv.destroy({ 
							where: { PfUUserID: fields.get('userid') }
						}).then(result => {
							console.log('profile univ delete success', result);
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
					}).catch(err => { //삭제에 문제가 생기면
						globalRouter.logger.error(err);
					})

					console.log('profile univ flow done');
					return result4;
				}
			
			}).then(async result6 => { //Career 차있으면
		
				console.log('result6 part and profile career value len :', profile_career_values.length);
		
				if (profile_career_values.length > 0) { //들어오는 career 값 있으면
				
					await models.profilecareer.findAll({
						where: { PfCUserID: fields.get('userid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < profile_career_values.length; ++i){								
									fs_extra.rename(profile_career_files[i].path, './ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.profilecareer.create({
										PfCUserID: fields.get('userid'),
										PfCareerContents: profile_career_values[i],
										PfCareerImgUrl: '/ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name,
										PfCareerAuth: '2'
									}).then(result => {
									console.log('profile career add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < profile_career_values.length ? res.length : profile_career_values.length;
								var maxLength = res.length > profile_career_values.length ? res.length : profile_career_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].PfCareerContents != profile_career_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].PfCareerImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].PfCareerImgUrl); //있던 이미지 삭제
												console.log('profile career Img delete success', res[i].PfCareerImgUrl);
											}else{
												console.log('profile career Img is not exists', res[i].PfCareerImgUrl);
											}
										});

										await models.profilecareer.destroy({ 
											where: { PfCareerContents: res[i].PfCareerContents }
										}).then(result => {
											console.log('profile career delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(profile_career_files[i].path, './ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.profilecareer.create({
											PfCUserID: fields.get('userid'),
											PfCareerContents: profile_career_values[i],
											PfCareerImgUrl: '/ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name,
											PfCareerAuth: '2'
										}).then(result => {
											console.log('profile career add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.profilecareer.update(
											{
												PfCareerAuth : res[i].PfCareerAuth
											},
											{
												where : {PfCareerContents: res[i].PfCareerContents }
											}
										).then(result => {
											console.log('profile career update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(profile_career_files[i].path, './ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.profilecareer.create({
										PfCUserID: fields.get('userid'),
										PfCareerContents: profile_career_values[i],
										PfCareerImgUrl: '/ProfileAuth/PfCareerAuth/' + fields.get('userid') + "/" + i + '_' + profile_career_files[i].name,
										PfCareerAuth: '2'
									}).then(result => {
										console.log('profile career add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
						console.log('error occured while finding from profile ' + err);
						})
						console.log('profile career auth flow done');
						return result6;
			
					} else { //remove all files and DB rows
					console.log('no profile career auth value input, So delete all');
			
					await models.profilecareer.findAll({
						where: { PfCUserID: fields.get('userid') }
					}).then(async res => {
						for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
						await models.profilecareer.findOne({
							where: { PfCareerContents: res[i].PfCareerContents } //각 ImgUrl 값 찾아서 이미지 삭제
						}).then(CareerResult => {
							fs.exists(__dirname + CareerResult.PfCareerImgUrl, function(exists) {
								if(exists){
									fs.unlinkSync(__dirname + CareerResult.PfCareerImgUrl); //있던 이미지 삭제
									console.log('profile career Img delete success', CareerResult.PfCareerImgUrl);
								}else{
									console.log('profile career Img is not exists', CareerResult.PfCareerImgUrl);
								}
							});
							console.log('profile career Img delete success', CareerResult.PfCareerImgUrl);
						})
						}
					}).then(async () => { //row 다 날려줌
						await models.profilecareer.destroy({ 
						where: { PfCUserID: fields.get('userid') }
						}).then(result => {
						console.log('profile career delete success', result);
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
					}).catch(err => { //삭제에 문제가 생기면
						globalRouter.logger.error(err);
					})
			
					return result6;
				}
			}).then(async result7 => { //License 차있으면

				console.log('result7 part and profile license value len :', profile_license_values.length);
		
				if (profile_license_values.length > 0) { //들어오는 career 값 있으면
				
					await models.profilelicense.findAll({
						where: { PfLUserID: fields.get('userid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < profile_license_values.length; ++i){								
									fs_extra.rename(profile_license_files[i].path, './ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.profilelicense.create({
										PfLUserID: fields.get('userid'),
										PfLicenseContents: profile_license_values[i],
										PfLicenseImgUrl: '/ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name,
										PfLicenseAuth: '2'
									}).then(result => {
										console.log('profile license add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < profile_license_values.length ? res.length : profile_license_values.length;
								var maxLength = res.length > profile_license_values.length ? res.length : profile_license_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].PfLicenseContents != profile_license_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].PfLicenseImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].PfLicenseImgUrl); //있던 이미지 삭제
												console.log('profile license Img delete success', res[i].PfLicenseImgUrl);
											}else{
												console.log('profile license Img is not exists', res[i].PfLicenseImgUrl);
											}
										});

										await models.profilelicense.destroy({ 
											where: { PfLicenseContents: res[i].PfLicenseContents }
										}).then(result => {
											console.log('profile license delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(profile_license_files[i].path, './ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.profilelicense.create({
											PfLUserID: fields.get('userid'),
											PfLicenseContents: profile_license_values[i],
											PfLicenseImgUrl: '/ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name,
											PfLicenseAuth: '2'
										}).then(result => {
											console.log('profile license add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.profilelicense.update(
											{
												PfLicenseAuth : res[i].PfLicenseAuth
											},
											{
												where : {PfLicenseContents: res[i].PfLicenseContents }
											}
										).then(result => {
											console.log('profile license update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(profile_license_files[i].path, './ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.profilelicense.create({
										PfLUserID: fields.get('userid'),
										PfLicenseContents: profile_license_values[i],
										PfLicenseImgUrl: '/ProfileAuth/PfLicenseAuth/' + fields.get('userid') + "/" + i + '_' + profile_license_files[i].name,
										PfLicenseAuth: '2'
									}).then(result => {
										console.log('profile license add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
						console.log('error occured while finding from profile ' + err);
						})
						console.log('profile license auth flow done');
						return result7;
			
					} else { //remove all files and DB rows
						console.log('no profile license auth value input, So delete all');
				
						await models.profilelicense.findAll({
							where: { PfLUserID: fields.get('userid') }
						}).then(async res => {
							for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
								await models.profilelicense.findOne({
									where: { PfLicenseContents: res[i].PfLicenseContents }//각 ImgUrl 값 찾아서 이미지 삭제
								}).then(LicenseResult => {
									fs.exists(__dirname + LicenseResult.PfLicenseImgUrl, function(exists) {
										if(exists){
											fs.unlinkSync(__dirname + LicenseResult.PfLicenseImgUrl); //있던 이미지 삭제
											console.log('profile license Img delete success', LicenseResult.PfLicenseImgUrl);
										}else{
											console.log('profile license Img is not exists', LicenseResult.PfLicenseImgUrl);
										}
									});
									console.log('profile license Img delete success', LicenseResult.PfLicenseImgUrl);
								})
							}
					}).then(async () => { //row 다 날려줌
						await models.profilelicense.destroy({ 
							where: { PfLUserID: fields.get('userid') }
						}).then(result => {
							console.log('profile license delete success', result);
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
					}).catch(err => { //삭제에 문제가 생기면
						globalRouter.logger.error(err);
					})
			
					return result7;
				}
			}).then(async result8 => { //WIN 차있으면

				console.log('result8 part and profile win value len :', profile_win_values.length);
		
				if (profile_win_values.length > 0) { //들어오는 career 값 있으면
				
					await models.profilewin.findAll({
						where: { PfWUserID: fields.get('userid') }
						}).then(async res => {

							//기존 데이터가 없으면 그냥 추가
							if(globalRouter.IsEmpty(res)){
								for(var i = 0 ; i < profile_win_values.length; ++i){								
									fs_extra.rename(profile_win_files[i].path, './ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name); //파일 앞서 만든 폴더에 저장
				
									await models.profilewin.create({
										PfWUserID: fields.get('userid'),
										PfWinContents: profile_win_values[i],
										PfWinImgUrl: '/ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name,
										PfWinAuth: '2'
									}).then(result => {
										console.log('profile win add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}else{
								var minLength = res.length < profile_win_values.length ? res.length : profile_win_values.length;
								var maxLength = res.length > profile_win_values.length ? res.length : profile_win_values.length;

								//기존 개수 체크
								var isDelete = minLength == maxLength ? false : true;

								if(false == isDelete){
									for(var i = 0 ; i < minLength; ++i){
										//기존 데이터와 다르면 삭제 
										if(res[i].PfWinContents != profile_win_values[i]){
											isDelete = true;
										}
									}
								}

								//기존 데이터와 다른게 있으면 삭제
								if(isDelete){
									//이미지 삭제
									for(var i = 0 ; i < res.length; ++i){
										fs.exists(__dirname + res[i].PfWinImgUrl, function(exists) {
											if(exists){
												fs.unlinkSync(__dirname + res[i].PfWinImgUrl); //있던 이미지 삭제
												console.log('profile win Img delete success', res[i].PfWinImgUrl);
											}else{
												console.log('profile win Img is not exists', res[i].PfWinImgUrl);
											}
										});

										await models.profilewin.destroy({ 
											where: { PfWinContents: res[i].PfWinContents }
										}).then(result => {
											console.log('profile win delete success', result);
										}).catch(err => { //삭제에 문제가 생기면
											globalRouter.logger.error(err);
										});
									}
									
									//후 재 생성
									for(var i = 0 ; i < minLength; ++i){
										fs_extra.rename(profile_win_files[i].path, './ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name); //파일 앞서 만든 폴더에 저장

										await models.profilewin.create({
											PfWUserID: fields.get('userid'),
											PfWinContents: profile_win_values[i],
											PfWinImgUrl: '/ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name,
											PfWinAuth: '2'
										}).then(result => {
											console.log('profile win add success', result);
										}).catch(err => { //더하는데에 문제가 생기면
											globalRouter.logger.error(err);
										})
									}

									//인증 정보 업데이트
									for(var i = 0 ; i < res.length; ++i){
										await models.profilewin.update(
											{
												PfWinAuth : res[i].PfWinAuth
											},
											{
												where : {PfWinContents: res[i].PfWinContents }
											}
										).then(result => {
											console.log('profile win update success', result);
										}).catch(err => {})
									}
								}

								//추가 데이터 처리
								for(var i = minLength ; i < maxLength ; ++i){
									fs_extra.rename(profile_win_files[i].path, './ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name); //파일 앞서 만든 폴더에 저장
									await models.profilewin.create({
										PfWUserID: fields.get('userid'),
										PfWinContents: profile_win_values[i],
										PfWinImgUrl: '/ProfileAuth/PfWinAuth/' + fields.get('userid') + "/" + i + '_' + profile_win_files[i].name,
										PfWinAuth: '2'
									}).then(result => {
										console.log('profile win add success', result);
									}).catch(err => { //더하는데에 문제가 생기면
										globalRouter.logger.error(err);
									})
								}
							}
						//추가하기
						}).catch(err => {
							console.log('error occured while finding from profile ' + err);
						})
							console.log('profile win auth flow done');
						return result8;
			
					} else { //remove all files and DB rows
						console.log('no profile win auth value input, So delete all');
				
						await models.profilewin.findAll({
							where: { PfWUserID: fields.get('userid') }
						}).then(async res => {
							for (var i = 0; i < res.length; ++i) { //같은 userid 값 가진 Row 개수만큼 반복
							await models.profilewin.findOne({
								where: { PfWinContents: res[i].PfWinContents }//각 ImgUrl 값 찾아서 이미지 삭제
							}).then(WinResult => {
								fs.exists(__dirname + WinResult.PfWinImgUrl, function(exists) {
									if(exists){
										fs.unlinkSync(__dirname + WinResult.PfWinImgUrl); //있던 이미지 삭제
										console.log('profile win Img delete success', WinResult.PfWinImgUrl);
									}else{
										console.log('profile win Img is not exists', WinResult.PfWinImgUrl);
									}
								});
								console.log('profile win Img delete success', WinResult.PfWinImgUrl);
							})
							}
						}).then(async () => { //row 다 날려줌
							await models.profilewin.destroy({ 
								where: { PfWUserID: fields.get('userid') }
							}).then(result => {
								console.log('profile win delete success', result);
							}).catch(err => { //삭제에 문제가 생기면
								globalRouter.logger.error(err);
							})
						}).catch(err => { //삭제에 문제가 생기면
							globalRouter.logger.error(err);
						})
			
					return result8;
				}
			}).catch(err => {
				globalRouter.logger.error("profile Update Insert Failed" + err);
				res.status(400).json(null);
				return;
			})
		
			console.log("User Profile Update Success");
		
			await models.user.findOne({
				where : {
				  UserID: fields.get('userid')
				},
				include : [
					{
						model : models.PersonalPhoto,
						required: true , 
						limit: 99,
						order : [
						  ['Index', 'ASC']
						],
					},
				]
			}).then(async result =>{
		
				console.log(result);
		
				let badgedata = {
					category : 1,
					part : '프로필',
					value : globalRouter.IsEmpty(result.PersonalPhotos) ? 70 : 100
				}
		
				let badgeTable = await badgeFuncRouter.SelectlevelBadge(badgedata);
		
				if(badgeTable != null && globalRouter.IsEmpty(result.PersonalPhotos) ? 70 : 100 >= badgeTable.Condition){
					let badgeIdData = {
					badgeID : badgeTable.id,
					userID : fields.get('userid')
					}
					await badgeFuncRouter.Insert(badgeIdData);
				}
			})
		
			res.status(200).json(true);
		
			//마지막에 초기화! 
			fields = null; profile_career_values = null; profile_license_values = null; profile_win_values = null;
			profile_photo_files = null; profile_univ_files = null; 
			profile_career_files = null; profile_license_files = null; profile_win_files = null; pathss = null;
		
			}).on('error', function (err) { //에러나면, 파일저장 진행된 id 값의 폴더 하위부분을 날려버릴까?
				globalRouter.logger.error('[error] error ' + err);
				globalRouter.removefiles( __dirname + "/AllPhotos/temp/")
				res.status(400).json(null);
			});
	}

    form.parse(req, function (error, field, file) { //이건 모지...
        console.log('[parse()] error : ' + error + ', field : ' + field + ', file : ' + file);
        console.log(personalProfileModifyURL + 'upload success');
    });
});