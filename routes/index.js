// express 라우터를 받아서 reouter에다가 함수들을 설정해준 것
// express, router들은 r것outer를 파일로 뺄때 필요한
// 하나의 라우터가 여러개의 통신을 가질 수 있다.
// router를 통해서 req, res 함수를 받아서 두번째 인자인 함수가 처리를 하는 것이다.
const express = require('express');
const router = express.Router(); // app.user로 이 router를 달아주면 미들웨어로 설정이 된다. 이 라우터로 get이나 post로 달아주면, 요청이


const indexController = require('../controllers/indexController')

// promise-mysql 모듈 객체
// sql 데이터베이스에연결하기 위해서 가져오는 모듈
const mysql = require('promise-mysql');

// DBconfig.json 파일 만들어야함
// require 반환값 = json 데이터가 넘어옴
const DBConfig = require("../config/DBConfig.json");

// mysql.createPool = DB랑 접속하는 pool을 만듬 = "DB에 연결함"
// poolPromise를 통해 DB의 데이터를 다룸
const poolPromise = mysql.createPool(DBConfig);

router.get('/index', function (req, res) {
    return res.status(200).json({title: "주세환 바보"}) // res.status = 통신을 보낸다는 의미ㅣㅇ다.
    // res.send()도 통신을 보낸다는 의미이므로, 통신을 두번보내게 된 것이라서 에러를 일으킨것
    // return 문뒤에 res.status를 작성하면 이런 에러를 막을 수 있다!
    // 오류가 나는 이유: 응답을 보내도 함수는 계속 실행되기 때문에.
    // + 하나의 통신에 응답은 하나만 보내야한다. 그런데 응답을 두번 보내서 에러가 난다.
    res.send();
});

// mvc 패턴 = 컨트롤러에서 함수를 가져다가 설정
router.post('/login', indexController.login)

router.post('/signup', indexController.signUp)



// 이 라우터를 반환하는 것이다.
// module.exports = require라는 함수를 통해 index.js 를 들고 왔을 때 무엇을 반환할지를 module.export를 통해 지정
module.exports = router;
