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

let io = null;


module.exports = {
    baseIo:io,
    baseSocket : function (socketIo) {
        io = socketIo;
        this.baseIo = io;
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
        io.use(socketMiddleware);
    
    
        io.sockets.on('connection', async function(socket){
            await socketController.baseSocket(io, socket)
        });
    
        return io;
    }
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