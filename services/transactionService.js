const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

const objectStructure = (objectReq) => {
  const { description, value, category, yearMonthDay, type } = objectReq;
  const dateResult = yearMonthDay.split('-');

  const objectData = {
    description,
    value,
    category,
    type,
    yearMonthDay,
    yearMonth: `${dateResult[0]}-${dateResult[1]}`,
    year: Number(dateResult[0]),
    month: Number(dateResult[1]),
    day: Number(dateResult[2]),
  };
  return objectData;
};

const create = async (req, res) => {
  try {
    const data = objectStructure(req.body);
    const newTransaction = new TransactionModel(data);
    await newTransaction.save(); 
    res.send({ message: 'Transaction inserida com sucesso' });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
  }
};

const findTransactionsByPeriod = async (req, res) => {
  const period = req.query.period;

  //condicao para o filtro no findTransactionsByPeriod
  if(!period) {
    res
      .status(400)
      .send({ error: "É necessário informar o parâmetro period, cujo valor deve estar no formato yyyy-mm" });
    return; 
  }

  var condition = period
    ? { yearMonth: { $eq: period } }
    : {};

  try {
    const data = await TransactionModel.find(condition);
    res.send(
      { length: data.length, 
        transactions: data 
      });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todas as transactions' });
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await TransactionModel.findById(id);

    if (!data) {
      res.send({ error: 'Nao encontrado a Transaction id: ' + id });
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar a Transaction id: ' + id });
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;

  try {
    const updateData = objectStructure(req.body);
    const data = await TransactionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!data) {
      res.send({ error: 'Nao encontrado a Transaction id: ' + id });
    } else {
      res.send(data);
    }
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Transaction id: ' + id });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await TransactionModel.findByIdAndRemove(id);

    if (!data) {
      res.send({ error: 'Nao encontrado a Transaction id: ' + id });
    } else {
      res.send({ message: 'Transaction excluida com sucesso'});
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar a Transaction id: ' + id });
  }
};

const removeAll = async (req, res) => {
  try {
    await TransactionModel.deleteMany({});
    res.send({ message: 'Transactions excluidas com sucesso'});
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todas as Transactions' });
  }
};

module.exports = { create, findTransactionsByPeriod, findOne, update, remove, removeAll };
