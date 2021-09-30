const mysql = require('mysql2/promise');

const db = {}

db.init = async ({ database, host, user }) => {
    const connection = await db.createDatabase({ database, host, user });

    await db.createTableSkills(connection);
    // await db.createTableAccounts(connection);

    return connection;
}

db.createDatabase = async ({ database, host, user }) => {
    host = host ? host : 'localhost';
    user = user ? user : 'root';

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`DROP DATABASE IF EXISTS \`${database}\``);
        console.log('Buvusi duombaze istrinta');
    } catch (error) {
        console.log('Nera duombazes, kuria butu galima istrinti');
    }

    try {
        let db = await mysql.createConnection({ host, user });
        await db.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
        await db.end();

        db = await mysql.createConnection({ host, user, database });
        console.log('Nauja duombaze sukurta');
        return db;
    } catch (error) {
        return error;
    }
}

db.createTableSkills = async (connection) => {
    try {
        const sql = 'CREATE TABLE IF NOT EXISTS `skills` (\
                        `id` int(10) NOT NULL AUTO_INCREMENT,\
                        `title` char(20) COLLATE utf8_swedish_ci NOT NULL,\
                        `value` tinyint(3) DEFAULT 50 NOT NULL,\
                        PRIMARY KEY(`id`)\
                    ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
        await connection.execute(sql);

        const skillsQuery = 'INSERT INTO `skills`\
                                (`title`, `value`)\
                            VALUES\
                                ("UX Design", 90),\
                                ("Web Design", 86),\
                                ("Web Development", 30)';
        await connection.execute(skillsQuery);
    } catch (error) {
        console.log('Nepavyko sukurti skills lenteles');
        console.log(error);
        return error;
    }
}

// db.createTableAccounts = async (connection) => {
//     try {
//         const query = 'CREATE TABLE IF NOT EXISTS `accounts` (\
//                             `id` int(10) NOT NULL AUTO_INCREMENT,\
//                             `user_id` int(10) NOT NULL,\
//                             `account_number` char(20) NOT NULL,\
//                             `money` int(10) DEFAULT 0 NOT NULL,\
//                             `isActive` tinyint(1) DEFAULT 1 NOT NULL,\
//                             PRIMARY KEY(`id`)\
//                         ) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_swedish_ci';
//         await connection.execute(query);

//         const queryFK = 'ALTER TABLE `accounts`\
//                         ADD FOREIGN KEY (`user_id`)\
//                             REFERENCES `users`(`id`)\
//                                 ON DELETE RESTRICT\
//                                 ON UPDATE RESTRICT;';
//         await connection.execute(queryFK);
//     } catch (error) {
//         console.log('Nepavyko sukurti knygu lenteles');
//         console.log(error);
//         return error;
//     }
// }

(async function () {
    await db.init({
        host: 'localhost',
        user: 'root',
        database: 'coming-soon',
    });
})()

module.exports = db;