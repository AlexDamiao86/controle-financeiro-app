const express = require('express');
const transactionService = require('../services/transactionService.js');
const transactionRouter = express.Router();

transactionRouter.get('/', transactionService.findAll);
transactionRouter.get('/:id', transactionService.findOne);
transactionRouter.post('/', transactionService.create);
transactionRouter.put('/:id', transactionService.update);
transactionRouter.delete('/:id', transactionService.remove);
// transactionRouter.delete('/', transactionService.removeAll);

module.exports = transactionRouter;

