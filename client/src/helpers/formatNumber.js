const formatterNumber = Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function formatNumber(value) {
  return formatterNumber.format(value);
}

export { formatNumber };
