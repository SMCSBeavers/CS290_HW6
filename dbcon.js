var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : /* host ip */,
    user            : /* user */,
    password        : 'default',
    database        : 'hellodb'
});

module.exports.pool = pool;