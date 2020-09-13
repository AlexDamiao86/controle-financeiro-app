import React, { useState, useEffect } from 'react';

import TransactionList from './components/TransactionList';
import Modal from './components/TransactionModal';
import PeriodSelector from './components/PeriodSelector';
import Summary from './components/Summary';

import * as api from './api/apiService';
import M from 'materialize-css';
import { getCurrentPeriod } from './helpers/periodsHelper';

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [listFilter, setListFilter] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dataSelected, setDataSelected] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState(getCurrentPeriod());

  useEffect(() => {
    M.AutoInit();
  }, []);

  useEffect(() => {
    const getTransactionsList = async () => {
      const transactionsOfPeriod = await api.getPeriodTransaction(period);
      setTransactions(transactionsOfPeriod.transactions);
    };
    getTransactionsList();
  }, [period]);

  useEffect(() => {
    const filteredTransactions =
      filterText.length > 0
        ? transactions
            .filter((item) => {
              const textDescription = item.description.toLowerCase();
              return textDescription.indexOf(filterText.toLowerCase()) >= 0;
            })
            .sort((a, b) => a.day - b.day)
        : Object.assign(
            [],
            transactions.sort((a, b) => a.day - b.day)
          );
    setListFilter(filteredTransactions);
  }, [transactions, filterText]);

  const handleChangePeriod = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleFilterText = (newDescription) => {
    setFilterText(newDescription);
  };

  const handlePersistData = async (formData, isEdit) => {
    const newTransaction = isEdit
      ? await api.update(formData)
      : await api.create(formData);

    let newList = isEdit
      ? Object.assign(
          [],
          [
            ...transactions.filter(({ _id }) => _id !== newTransaction._id),
            newTransaction,
          ]
        )
      : Object.assign([], [...transactions, newTransaction]);
    setTransactions(newList);
    setIsModalOpen(false);
  };

  const handleRemove = async (id) => {
    const transactionData = listFilter.find(({ _id }) => _id === id);
    await api.remove(transactionData);
    const newList = transactions.filter(({ _id }) => _id !== id);
    setTransactions(newList);
  };

  const handlePersist = () => {
    const newFormData = {
      value: 0,
      category: 'Outros',
      description: '',
      type: '-',
      yearMonthDay: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${new Date().getDate()}`,
    };
    setIsEdit(false);
    setDataSelected(newFormData);
    setIsModalOpen(true);
  };

  const handleEditData = (data) => {
    setDataSelected(data);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (  
    <div className="container">
      <h1 className="font-xlarge center">Bootcamp Full Stack - Desafio Final</h1>
      <h2 className="font-medium center">Controle Financeiro Pessoal</h2>
      
      <PeriodSelector 
        value={period} 
        onChange={handleChangePeriod}
        isModalOpen={isModalOpen} 
      />

      <Summary lancamentos={listFilter} />
      
      <TransactionList
        listFilter={listFilter}
        filterText={filterText}
        onFilterText={handleFilterText}
        onRemove={handleRemove}
        onNew={handlePersist}
        onEdit={handleEditData}
        isModalOpen={isModalOpen}
      />

      {isModalOpen && (
          <Modal
            onSave={handlePersistData}
            dataSelected={dataSelected}
            isEdit={isEdit}
            onClose={handleClose}
          />
        )}
    </div>
  );
}
