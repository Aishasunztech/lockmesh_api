// Libraries

// Helpers
// const { sql } = require('../config/database');
// const device_helpers = require('../helper/device_helpers.js');
// const general_helpers = require('../helper/general_helper.js');

// Controllers
const socketController = require('../app/controllers/socket');

// middleware
const socketMiddleware = require('../middlewares/socketAuth');

// Constants
// const Constants = require('../constants/Application');
// const app_constants = require('../config/constants');

module.exports = {
    baseIo: null,
    deviceIo: null,
    webIo: null,

    baseSocket: function (socketIo) {
        this.baseIo = socketIo;
        // // socket configuration options
        // // io.path('/api')

        // // {
        // //    path: '/socket.io',
        // //    serveClient: false,
        // //    pingInterval: 10000,
        // //    pingTimeout: 5000,
        // //    cookie: false
        // // }


        // // io = socket({
        // //     pingTimeout :100
        // // });




        // socketIo.set('transports', ['websocket']);

        // ===============================================================================
        // io.of('/') is for middleware not for path/namespace/endpoint 
        // ===============================================================================

        // ===============================================================================
        // io.of('dynamic of for device_id') for dynamic/namespace/endpoint
        // ===============================================================================
        // const dynamicNsp = io.of(/^\/\d+$/).on('connect', (socket) => {
        //     const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'

        //     // broadcast to all clients in the given sub-namespace
        //     newNamespace.emit('hello');
        // });


        // middleware for socket incoming and outgoing requests
        socketIo.use(socketMiddleware);


        socketIo.sockets.on('connection', async function (socket) {
            // console.log("BASE SOCKET CONNECTED");
            await socketController.baseSocket(socketIo, socket)
        });

    },

    deviceSocket: function (socketIo) {
        this.deviceIo = socketIo;
        socketIo.use(socketMiddleware);

        socketIo.on('connection', async function (socket) {
            console.log('device/socket');
            await socketController.baseSocket(socketIo, socket)
        });
    },

    webSocket: function (socketIo) {
        this.webIo = socketIo;
        socketIo.use(socketMiddleware);
        
        socketIo.on('connection', async function (socket) {
            console.log("web/socket");
            await socketController.webSocket(socketIo, socket)
        });
    },
}
