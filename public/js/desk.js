// Referencias HTML
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPending = document.querySelector('#lblPending');

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('desk')) {
    window.location = 'index.html';
    throw new Error(`El escritorio es obligatorio`);
}

const desk = searchParams.get('desk');
lblDesk.innerText = desk;

divAlert.style.display = 'none'

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAttend.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
    btnAttend.disabled = true;
});

socket.on('pending-ticket', (pending) => {
    if (pending === 0) lblPending.style.display = 'none';
    else lblPending.style.display = '';

    lblPending.innerText = pending;
})

btnAttend.addEventListener('click', () => {

    socket.emit('attend-ticket', {desk}, ({ok, ticket, msg}) => {
        if (!ok)  {
            lblTicket.innerText = `Nadie`
            return divAlert.style.display = '';
        }

        lblTicket.innerText = `Ticket ${ticket.number}`
    })

    /*socket.emit('next-ticket', null, (ticket) => {
        lblNewTicket.innerText = ticket;
    });*/
});