var express = require('express');
var https = require('https')
var fs = require('fs');
var router = express.Router();

var userDAO = require('../dao/userDao');

var authIs = false;     //初始化鉴权结果为:false

// 初始化已注册在Apikey.json中的Apikey
var Apikey={}; 
fs.readFile('./Apikey/Apikey.json', function (err, data, callback) {
    if (err) {
        console.error(err);
    };
    callback = data;
    Apikey = JSON.parse(data.toString());  //Buffer转换成字符串再转换成json
    callback = Apikey;
});

//服务器控制台反馈：Api to use for all requests
router.use(function (req, res, next) {
    //鉴权。鉴权结果authIs=trun时将用于实现GET PUT POST DELETE PACTH
    var auth = req.headers.authorization;
    //console.log(auth);   //根据运行需要决定，服务器是否打开此监控
    for (var i = 0; i < Apikey.length; i++) {
        if (Apikey[i].Apikey == auth) {
            authIs = true;
        };
    };
    //监控客户端ip地址
    var get_client_ip = function (req) {
        var ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress || '';
        if (ip.split(',').length > 0) {
            ip = ip.split(',')[0]
        }
        return ip;
    };
    let ip = get_client_ip(req).match(/\d+.\d+.\d+.\d+/);
    console.log(ip);
    next(); // make sure we go to the next routes and don't stop here
});

//服务器控制台反馈：GET home page
router.get('/', function (req, res, next) {
    res.json({ message: 'Hello! welcome to our api!' });
});

// 接口方法 GET users?
router.get('/users?', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.GET = 'Auth false';
        res.json(result);
        return next();
    };
    if (req.query.page == undefined | req.query.pageSize == undefined) {
        var result = {};
        result.GET = 'page|pageSize is undefined.';
        res.json(result);
        return next();
    };
    var page = Number(req.query.page);
    var pageSize = Number(req.query.pageSize);
    var pageStart = (page - 1) * pageSize;
    userDAO.totalRecord(function (val) {
        var totalRecord = val;
        console.log('GET users called');
        var totalPage = Math.floor((totalRecord + pageSize - 1) / pageSize);
        userDAO.list(pageStart, pageSize, function (users) {
            var result = {};
            result.page = page;
            result.pageSize = pageSize;
            result.totalRecord = totalRecord;
            result.totalPage = totalPage;
            result.data = users;
            res.json(result);
        });
    });
});

// 接口方法 GET users/id
router.get('/users/:id', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.GET = 'Auth false';
        res.json(result);
        return next();
    };
    var id = req.params.id;
    console.log('GET users/id called, id: ' + id);
    userDAO.getById(id, function (user) {
        if (user == undefined) {
            var result = {};
            result.GET = 'No record with ID ' + id;
            res.json(result);
            //return next();   由于异步的特点，即使运行此行，后面的res.json(user)照样先于执行。
        };
        res.json(user);
    });
});

// 接口方法 DELETE users/id
router.delete('/users/:id', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.POST = 'Auth false';
        res.json(result);
        return next();
    };
    var id = req.params.id;
    console.log('DELETE users/id called, id=' + id);
    userDAO.deleteById(id, function (success) {
        var result = {};
        result.DELETE = success
        res.json(result);
    });
});

// 接口方法 POST users     return next()前提是第73行（本行后有next参数）
router.post('/users', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.POST = 'Auth false';
        res.json(result);
        return next();
    };
    console.log('addUser called');
    var user = req.body;
    if (user == undefined | user.username == undefined | user.password == undefined) {
        var result = {};
        result.post = 'post.JSON include undefined.';
        res.json(result);
        return next();
    };
    console.log(user);
    userDAO.add(user, function (success) {
        var result = {};
        result.POST = success;
        res.json(result);
    });
});

// 接口方法 PUT users 
router.put('/users/:id', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.PUT = 'Auth false';
        res.json(result);
        return next();
    };
    console.log('updateUser called');
    var user = req.body;
    user.id = req.params.id;
    console.log(user);
    userDAO.update(user, function (success) {
        var result = {};
        result.PUT = success
        res.json(result);
    });
});

// 接口方法 PATCH users
router.patch('/users/:id', function (req, res, next) {
    if (authIs == false) {
        console.log('Auth false.');
        var result = {};
        result.PATCH = 'Auth false';
        res.json(result);
        return next();
    };
    console.log('patchUser called');
    userDAO.getById(req.params.id, function (user) {
        if (user == undefined) {
            var id = req.params.id;
            var result = {};
            result.PATCH = 'No record with this ID ' + id;
            res.json(result);
            return next();
        };
        var username = req.body.username;
        if (username) {
            user.username = username;
        };
        var password = req.body.password;
        if (password) {
            user.password = password;
        };
        console.log(user);
        userDAO.update(user, function (success) {
            var result = {};
            result.PATH = success
            res.json(result);
        });
    });
});

module.exports = router;