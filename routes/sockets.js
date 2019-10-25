// Libraries

// Helpers
const { sql } = require('../config/database');
const device_helpers = require('../helper/device_helpers.js');
const general_helpers = require('../helper/general_helper.js');

// Controllers
const socketController = require('../app/controllers/socket');

// middleware
const socketMiddleware = require('../middlewares/socketAuth');

// Constants
const Constants = require('../constants/Application');
const app_constants = require('../config/constants');

let io;
// let dealerIo;

module.exports = {
    baseIo:io,
    baseSocket : function (socketIo) {
        this.baseIo = socketIo;
        // socket configuration options
        // io.path('/api')
    
        // {
        //    path: '/socket.io',
        //    serveClient: false,
        //    pingInterval: 10000,
        //    pingTimeout: 5000,
        //    cookie: false
        // }
    
    
        // io = socket({
        //     pingTimeout :100
        // });
    
    
        
    
        // io.set('transports', ['websocket']);
    
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
    
    
        socketIo.sockets.on('connection', async function(socket){
            await socketController.baseSocket(socketIo, socket)
        });
        
    },

    // dealerIo: dealerIo,
    // dealerSocket: function (socketIo){
    //     // console.log(socketIo);

    //     this.dealerIo = dealerIo;

    //     socketIo.on('connection', function (socket){
    //         console.log('socket connected on dealer route');
    //         socketIo.emit('test', "message");
    //     })
    // }
}


// module.exports = (socketIo) => {
//     baseIo = socketIo;
//     // socket configuration options
//     // io.path('/api')

//     // {
//     //    path: '/socket.io',
//     //    serveClient: false,
//     //    pingInterval: 10000,
//     //    pingTimeout: 5000,
//     //    cookie: false
//     // }


//     // io = socket({
//     //     pingTimeout :100
//     // });




//     // io.set('transports', ['websocket']);

//     // ===============================================================================
//     // io.of('/') is for middleware not for path/namespace/endpoint 
//     // ===============================================================================

//     // ===============================================================================
//     // io.of('dynamic of for device_id') for dynamic/namespace/endpoint
//     // ===============================================================================
//     // const dynamicNsp = io.of(/^\/\d+$/).on('connect', (socket) => {
//     //     const newNamespace = socket.nsp; // newNamespace.name === '/dynamic-101'

//     //     // broadcast to all clients in the given sub-namespace
//     //     newNamespace.emit('hello');
//     // });


//     // middleware for socket incoming and outgoing requests
//     baseIo.use(socketMiddleware);


//     baseIo.sockets.on('connection', async function (socket) {
//         await socketController.baseSocket(baseIo, socket)
//     });
// }

// exports.baseIo = baseIo