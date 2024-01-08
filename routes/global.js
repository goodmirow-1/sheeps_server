
const fs = require('fs'),
moment = require('moment'),
sharp = require('sharp'),
path = require('path');

var socketio = null;

const { isEmpty } = require('underscore');
const logger = require('../libs/myWinston');

const redis = require('redis');
const client = redis.createClient(6379, "127.0.0.1");

require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");

function makeFolder(dir) { //폴더 만드는 로직
if (!fs.existsSync(dir)) { //만약 폴더 경로가 없다면
	fs.mkdirSync(dir); //폴더를 만들어주시오
} else {
	console.log('already folder exist!');
}
}

function print(txt) {
	console.log(txt);
}

function stringifyToJson(data) {
	return JSON.stringify(data);
}

async function CreateOrUpdate(model, where, newItem) {
	const foundItem = await model.findOne({ where });

	if (!foundItem) {
		const item = await model.create(newItem);
		return { item, created: true };
	}

	await model.update(newItem, { where });

	const item = foundItem;

	return { item, created: false };
}

async function CreateOrDestroy(model, where) {
	const foundItem = await model.findOne({ where });
	if (!foundItem) {
		const item = await model.create(where);
		return { item, created: true };
	}

	const item = await model.destroy({ where });
	return { item, created: false };
}

function getfilename(x) {
	var splitFileName = x.split(".");
	var name = splitFileName[0];
	return name;
}

function getImgMime(x) {
	var splitFileName = x.split(".");
	var mime = splitFileName[1];
	return mime;
}

function sharping(result_id, Destination, i, files_array_name, size, qualityNum, mimetype) { //Destination ; '/../원하는폴더명/' ex) '/../CommunityPhotos/'
sharp(__dirname + Destination + result_id + "/" + (i + 1) + "/" + files_array_name).rotate().resize(size, size)
	.jpeg({ quality: qualityNum }).toFile(__dirname + Destination + result_id + "/" + (i + 1) + "/" + getfilename(files_array_name) + "_" + size + "." + mimetype);
}

function realSharping(result_id, Destination, i, files_array_name, size, pWidth, pHeight, qualityNum, mimetype) { //Destination ; '/../원하는폴더명/' ex) '/../CommunityPhotos/'

sharp(__dirname + Destination + result_id + "/" + (i + 1) + "/" + files_array_name).rotate().
resize({
	fit : sharp.fit.contain,
	width : Math.round(pWidth),
	height : Math.round(pHeight)
}).jpeg({ quality: qualityNum }).toFile(__dirname + Destination + result_id + "/" + (i + 1) + "/" + getfilename(files_array_name) + "_" + size + "." + mimetype);
}


//디렉토리랑 mime type 까지 싹다 인자로 받기

function removefiles(p) {
	try { // D
		const files = fs.readdirSync(p);  
		if (files.length) 
		  files.forEach(f => removePath(path.join(p, f), printResult)); 
	  } catch (err) {
		if (err) return console.log(err);
	  }	  
}

const removePath = (p, callback) => { // A 
	fs.stat(p, (err, stats) => { 
	  if (err) return callback(err);
  
	  if (!stats.isDirectory()) { // B 
		console.log('이 경로는 파일');
		return fs.unlink(p, err => err ? callback(err) : callback(null, p));
	  }
  
	  console.log('이 경로는 폴더');  // C 
	  fs.rmdir(p, (err) => {  
		if (err) return callback(err);
  
		return callback(null, p);
	  });
	});
  };

const printResult = (err, result) => {
	if (err) return console.log(err);

	console.log(`${result} 를 정상적으로 삭제했습니다`);
};

function IsEmpty(value) {
if (value == "" ||
	value == null ||
	value == undefined ||
	(Array.isArray(value) && value.length < 1) ||
	(value != null && typeof value == "object" && !Object.keys(value).length)
) {
	return true //비어있는 거임
}
else {
	return false
}
};

function getWordLen(x) { //검색 필터 단어 나누는 용
var splitFileName = x.split("|");
var len = splitFileName.length;
return len;
}

function getWords(x) { //검색 필터 단어 나누는 용
var splitFileName = x.split("|");
return splitFileName;
}


function sleep(ms) {
return new Promise((resolve) => {
  setTimeout(resolve, ms);
});
}   

//전역변수
module.exports.logger = logger;
module.exports.client = client;

//전역함수
module.exports.makeFolder = makeFolder;
module.exports.print = print;
module.exports.stringifyToJson = stringifyToJson;
module.exports.CreateOrUpdate = CreateOrUpdate;
module.exports.CreateOrDestroy = CreateOrDestroy;

module.exports.getfilename = getfilename;
module.exports.getImgMime = getImgMime;
module.exports.sharping = sharping;
module.exports.realSharping = realSharping;
module.exports.removefiles = removefiles;
module.exports.IsEmpty = IsEmpty;

module.exports.getWordLen = getWordLen;
module.exports.getWords = getWords;

module.exports.sleep = sleep;

