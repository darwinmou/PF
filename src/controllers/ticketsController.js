const TicketsModel = require('../models/tickets.model');

exports.createTicket = async (req, res) => {
  try {
    const { code, amount, purchaser } = req.body;

    // Validar si el código del ticket ya existe
    const existingTicket = await TicketsModel.findOne({ code });

    if (existingTicket) {
      return res.status(400).json({ error: 'Ya existe un ticket con ese código' });
    }

    // Crear un nuevo ticket
    const newTicket = await TicketsModel.create({
      code,
      amount,
      purchaser,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error('Error al crear un ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await TicketsModel.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getTicketById = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticket = await TicketsModel.findById(ticketId);

    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket no encontrado.' });
    }
  } catch (error) {
    console.error('Error al obtener un ticket por ID:', error.message);
    res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
  }
};

exports.deleteTicketById = async (req, res) => {
  const ticketId = req.params.id;

  try {
    const deletedTicket = await TicketsModel.findByIdAndDelete(ticketId);

    if (deletedTicket) {
      res.json({ message: 'Ticket eliminado exitosamente' });
    } else {
      res.status(404).json({ error: 'Ticket no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar un ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
