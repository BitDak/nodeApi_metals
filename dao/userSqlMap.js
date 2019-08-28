var userSqlMap = {
    add: 'insert into user(username, password) values(?, ?)',
    deleteById: 'delete from user where id = ?',
    update: 'update user set username=?, password=? where id=?',
    list: 'select * from user where id>=(select id from user order by id limit ?,1) order by id limit ?',
    getById: 'select * from user where id = ?',
    totalRecord: 'select count(*) as totalRecord from user'
};

module.exports = userSqlMap;