const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
const sequelize_conn = new Sequelize('lokmesh_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',

  // host: 'my.server.tld',
  // for postgres, you can also specify an absolute path to a directory
  // containing a UNIX socket to connect over
  // host: '/sockets/psql_sockets'.

  // custom port; default: dialect default
  // port: 12345,

  // custom protocol; default: 'tcp'
  // postgres only, useful for Heroku
  // protocol: null,

  // disable logging; default: console.log
  // logging: false,
});

sequelize_conn
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize_conn;