const MONTH_NAME = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const createPeriodList = () => {

  const periodsList = [];

  let index = 0;
  for (let year = 2021; year >= 2019; year--) {
    for (let month = 12; month >= 1; month--) {
      periodsList.push({
        id: year.toString() + '-' + month.toString().padStart(2, '0'),
        value: MONTH_NAME[month - 1] + '/' + year.toString(),
        index: index++,
      });
    }
  }

  return periodsList;
};

const getCurrentPeriod = () => {
  const date = new Date();
  return (
    date.getFullYear().toString() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0')
  );
};

const getDescriptionMonth = (month) => {
  return MONTH_NAME[month - 1];
};

export { createPeriodList, getCurrentPeriod, getDescriptionMonth };
