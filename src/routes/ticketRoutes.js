const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

// Crear un nuevo ticket
router.post('/', ticketsController.createTicket);

// Obtener todos los tickets
router.get('/', ticketsController.getTickets);

// Obtener un ticket por ID
router.get('/:id', ticketsController.getTicketById);

// Eliminar un ticket por ID
router.delete('/:id', ticketsController.deleteTicketById);

module.exports = router;
