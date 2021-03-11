var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs290_mohrs',
    password        : '5422',
    database        : 'cs290_mohrs'
});

module.exports.pool = pool;