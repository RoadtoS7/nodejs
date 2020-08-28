// db 접근하기 위해 얻어옴
// 모델이 비즈니스 로직과 디비 접근 등을 모두 처리하기 때문에(CRUD 담당)
// 따라서 salt, pw를 가져와 pw과 일치하는지 비교작업까지 model에서 담당하는 것이 mvc 패턴에 적합하다.
const pool = require('./pool')
const config = require('../config/config')
const crypto = require('crypto')

const index = {
    getSaltAndPw: async (id, pw) => {
        console.log("getSaltAndPw entered")
        const query = `
            SELECT 
                salt, pw
            FROM 
                user
            WHERE
                id = "${id}"     
        `;

        try {
            let result = await pool.queryParam(query)
            if (result.length <= 0) {
                return {"status": 400, "message": "login Fail"}
            } else {
                let crypted_pw = config.do_cypher(pw, result[0].salt)
                if (result[0].pw === crypted_pw) { // == 는 객체 비교: 참조하는 객체가 같은지 비교한다.
                    return {"status": 200, "message": "login Success!"}
                } else {
                    console.log("pw and crypted_pw is not same")
                    return {"stauts": 400, "message": "login Fail!"}
                }
            }
        } catch (err) {
            throw err
        }
    },

    insertIdAndPw: async (id, pw) => {
        const salt = crypto.randomBytes(128).toString('base64')
        const crypted_pw = config.do_cypher(pw, salt)

        let query =
        `
        INSERT 
        INTO
            user(id, pw, salt)
        VALUES("${id}", "${crypted_pw}", "${salt}") 
        `;

        try{
            let result = await pool.queryParam(query)
            return {result: result}
        }
        catch (err) {
            throw err
            // 에러를 발생시키고, 함수가 반환됨, 상위 함수에서 catch 문에 잡혀서 next(err) 호출됨
        }
    }
}
module.exports = index
