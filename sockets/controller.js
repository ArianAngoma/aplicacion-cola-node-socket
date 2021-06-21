const {v4: uuidv4} = require('uuid');
const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    socket.emit('last-ticket', ticketControl.latest);
    socket.emit('actual-state', ticketControl.last4);
    // Notificar que hay un nuevo ticket pendiente que asignar cuando un cliente se conecta
    socket.emit('pending-ticket', ticketControl.tickets.length);


    socket.on('next-ticket', (payload, callback) => {
        const next = ticketControl.next();
        callback(next);

        socket.broadcast.emit('pending-ticket', ticketControl.tickets.length);
    });

    socket.on('attend-ticket', ({desk}, callback) => {
        if (!desk) return callback({
            ok: false,
            msg: 'El escritorio es obligatorio'
        });

        const ticket = ticketControl.attendTicket(desk);

        // Notificar cambio en los last4
        socket.broadcast.emit('actual-state', ticketControl.last4);

        socket.emit('pending-ticket', ticketControl.tickets.length);
        socket.broadcast.emit('pending-ticket', ticketControl.tickets.length);

        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendiente'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    })
}

module.exports = {
    socketController
}