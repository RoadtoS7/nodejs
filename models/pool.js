const mysql = require('promise-mysql');
const DBConfig = require("./../config/DBConfig.json");
const poolPromise = mysql.createPool(DBConfig);


module.exports = {
    queryParam: async (query) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    const result = await connection.query(query);
                    pool.releaseConnection(connection);
                    resolve(result);
                } catch (err) {
                    pool.releaseConnection(connection);
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },

    // 파라미터를 쿼리문에 직접 안넣고, 따로 넣을 때 사용하는 것
    queryParamArr: async (query, value) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    const result = await connection.query(query, value);
                    pool.releaseConnection(connection);
                    resolve(result);
                } catch (err) {
                    pool.releaseConnection(connection);
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },

    // 디비 트랜잭션할 때 쓰는 것
    Transaction: async (...args) => {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await poolPromise;
                const connection = await pool.getConnection();
                try {
                    await connection.beginTransaction();
                    args.forEach(async (it) => await it(connection));
                    await connection.commit();
                    pool.releaseConnection(connection);
                    resolve(result);
                } catch (err) {
                    await connection.rollback();
                    pool.releaseConnection(connection);
                    reject(err);
                }
            } catch (err) {
                reject(err);
            }
        });
    },
};