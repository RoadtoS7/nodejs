/**
 * indexConroller라는 변수를 만듬
 * 이 변수 안에 로그인이라는 function 객체를 만들 것이다.
 * @type {{login: login}}
 */
const indexModel = require('../models/indexModel')
const indexController = {
    login: async (req, res, next) => {
        if(!req.body.id || !req.body.pw){
            return next("body 불충분")
        }
        let id = req.body.id
        let pw = req.body.pw

        /// getSaltAndPw에서 try catch문에서 에러 발생이 이러날 수 있음 따라서 try, catch 문내에서 실행함
        try {
            const result = await indexModel.getSaltAndPw(id, pw)
            res.status(200).json(result)
        } catch (err) {
            // 에러 핸들링 방법
            // next함수를 호출해서 파라미터로 err를 넘결준다.
            // 모듈화의 중요성! : 에러를 바로 넘길 수 있다.
            next(err)
        }
    },
    signUp: async (req, res, next) => {
        if(!req.body.id || !req.body.pw){
            return next("body 불충분")
        }
        let id = req.body.id
        let pw = req.body.pw

        try{
            const result = await indexModel.insertIdAndPw(id, pw)
            res.status(200).json(result)
        }
        catch (err) {
            next(err)
        }

    }


}

module.exports = indexController