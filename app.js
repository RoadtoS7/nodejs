// httpㅇㅔ서 error를 생성해주는 라이브러리
var createError = require('http-errors');

// express 라이브러리
var express = require('express');
// var대신에 let을 사용하는 것을 지향

// path 라이브러리 = 템플릿이 뷰도 같이 만들어줌, 뷰에 접근하기 위해서 path를 사용한다.
// view가 어디에 존재하는지 바로 접근하기 위해서 사용
// 그런데 우리는 view를 사용하지 않으니 필요하지 않다.
var path = require('path');

// cookieParser = cookie를 파싱하는 아이
// cookieParser를 설정해야하는 이유: cookie값을 다루기 위해서(cookie를 가져오기 위해서 필요함)
// 우리는 cookie를 사용하지 않으므로 필요하지 않다.
// 요청에서 cookie값을 불러오지 못함, cookie를 생성할 때도 이것을 이용해서 생성함
// cookie대신에 토큰을 사용함!
var cookieParser = require('cookie-parser');

// 디벨롭 모드에서 로그찍을 대 쓴다.
// console.log쓰면 되서 이것을 쓰지 않는다.
var logger = require('morgan');

// 여기서 require함수를 통해서 리턴되는 것 = index.js있는 moudel.export에 지정한 router를 불러오는 것이다.
// 이 router에 get 통신이 설정이 되어있음.
// require 란? path나 쿠키 파서처럼 노드 모듈 폴더에있는 모듈을 가져오는
// 우리가 만든 모듈을 가져올 때는 경로를 입력해서 require를 통해 가져오는
// 파일로 따로 빼고, 그 파일안에서 module.export라는 걸 호출하는 것이 모듈화작업이다.

var indexRouter = require('./routes/index'); // get통신에 대한 파일 하나를 들고 온것.
var usersRouter = require('./routes/users'); // get통신 하나를 파일로 따로 빼고 변수로 들고 온 것

var app = express();

// view engine setup = 뷰 엔진 설
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// logger 설정
app.use(logger('dev')); // dev 모드에서만 사용한다고 설정해서, 디벨롭모드에서 로그찍을 때 사
// express json이라는 미들웨어 사용한 다는 것
// 미들웨어란? 여러종류가 될 수 있다. 경로를 받아서 경로에 대해서 통신을 주고 받는 미들웨어를 설정할 수 있고, 그외에도 여러가지 기능을 하는 미들웨어를 달 수 있다.

// 미들웨어로 exrpess.json()이라는 아이를 쓴다고 등록을 하는 건데, 데이터를 주고 받을 때 json형식으로 쓸 수 있도록 데이터를 변환해주는 역할을 한다.
// 미들웨어는 app.use로 애플리케이션에 등록된다.
//
//  따라서 통신하는 미들웨어가 아닌 것은 순서에 맞게 위에다가 작성해야 한다.
app.use(express.json()); // json형식으로 데이터를 주고받을 수 있게 변환해

// 미들웨어 설치 = 미들웨어 등 록
// url을 인코드 해주는 아이
// body parser의 역할도 해줌
app.use(express.urlencoded({ extended: false }));
// 쿠키 파서 등록
app.use(cookieParser());
// 뷰 관련, public 에 뷰들이 존재, 뷰들을 express에서 불러올 수 있게 설정해주는 것
// path를 통해서 public 디렉토리 경로로 접근할 수 있게 해줌
app.use(express.static(path.join(__dirname, 'public')));


// app.use(경로, function)이 나오는 것이 기본 적인 app.use() 사용법이다.
// 위에는 경로를 안적고 사용하는 것들도 있다. 바로 function으로 넘어갈 수 있게 사용할 수있다.
// 어떤 경로로 들어오는 요청이든지 간에 다 적용하는 경우 function만 인자로 적어주면된다.
// index.js에 있던 router를 지금 indexRouter라는 변수가 가지고 있는 것.
// 애플리케이션에 현재 등록을 해주는 것
// 유의할 점! 첫번째 인자로 주어진 경로로 라우터가 설정이 되는 것
// 경로가 중요하다!

// 미들웨어 설정 순서가중요! /users 요청을 뒤로 가지 못하고, 먼저 등록되어있던 미들웨어가 먹어버림.
app.use('/regi', indexRouter);
app.use('/users', usersRouter);
// 위의 app.use를 요청이 다 거쳤는데, 자신을 처리해줄 것이 없으면 다음 미들웨어로 넘어감
// 응답메시지를 보내게 되면, 미들웨어를 더이상 거치지 않는다. but router.get()안의 실행코드는 이어서 실행된다.


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
  // createError함수를 통해 404에러를 생성해서,
  // next()안에 생성한 404error를 주면, 다음 미들웨어로 인자로 들어온 404, error를 넘겨줌
});


// error handler
// 함수 인자중 err = 위의 next에서 넘겨준 404error
// next를 통해서 넘겨준 인자들은 항상 다른 인자들 맨앞에 우치한다.
// 다음 미들웨어로 넘겨줄 때 사용하는 next = 마지막의 next
// 바로 위의 함수가 아닌 다른 함수에서도 next(crateError()) 호출하면 아래의 err인자가 있는 미들웨어로 바로 온다.
// 따라서 에러 핸들러에서 모든 에러를 처리해야한다. 그래서 에러 핸들러는 맨 마지막에 위치해야 한다.
// 에러 핸들러에서 next 반드시 존재해야 한다.
// 파라미터가 4개일 때 에러 핸들러로 인식한다. b) js에는 타입이 없으니까..ㅎ
app.use(function (err, req, res, next){
  console.log(`error: "${err}"`)
  // status = 통신상태 등등 지정
  // send, json = 응답을 보내는 역할
  res.status(500).send(err)

})

module.exports = app;
