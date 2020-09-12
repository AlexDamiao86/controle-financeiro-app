import React, { useRef, useState } from 'react';

import { getCurrentPeriod, createPeriodList } from '../../helpers/periodsHelper';

export default function PeriodSelector({ onChange, isModalOpen }) {
  const inputPeriodSelector = useRef(null);

  const [currentPeriod, setCurrentPeriod] = useState(
    getCurrentPeriod()
  );

  const [isLeftDisabled, setIsLeftDisable] = useState(false);
  const [isRightDisabled, setIsRightDisable] = useState(false);

  const periodsList = createPeriodList();

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value);
  };

  const handleClickMinus = () => {
    const newPeriod = getNewPeriod(-1);
    setPeriod(newPeriod);
  };

  const handleClickPlus = () => {
    const newPeriod = getNewPeriod(1);
    setPeriod(newPeriod);
  };

  const getNewPeriod = (direction) => {
    const currentIndex = periodsList.findIndex((item) => {
      return item.id === currentPeriod;
    });

    const newPeriod = periodsList.find((item) => {
      return item.index === currentIndex + direction * -1;
    });

    return newPeriod.id;
  };

  const setPeriod = (newPeriod) => {
    const period = periodsList.find((item) => {
      return item.id === newPeriod;
    });

    setIsLeftDisable(periodsList.length === period.index + 1);
    setIsRightDisable(period.index === 0);

    setCurrentPeriod(period.id);
    onChange(period.id);

    inputPeriodSelector.current.focus();
  };

  return (
    <>
    {! isModalOpen && (

    <div style={styles.flexRow}>
   
      <button
        onClick={handleClickMinus}
        className="waves-effect waves-light btn"
        disabled={isLeftDisabled}
        style={styles.inputBtn}
      >
        {'<'}
      </button>

      <select
        id="periodSelector"
        ref={inputPeriodSelector}
        value={currentPeriod}
        onChange={handleChangePeriod}
        className="browser-default"
        style={styles.inputPeriod}
      >
        {periodsList.map((period) => {
          return (
            <option key={period.id} value={period.id}>
              {period.value}
            </option>
          );
        })}
      </select>

      <button
        onClick={handleClickPlus}
        className="waves-effect waves-light btn"
        disabled={isRightDisabled}
        style={styles.inputBtn}
      >
        {'>'}
      </button>
    </div>
    )}
  </>
  );
}

const styles = {
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '40px',
    marginBottom: '20px',
  },
  inputPeriod: {
    height: '36px',
    width: '180px',
    marginLeft: '5px',
    marginRight: '5px',
  },
  inputBtn: {
    height: '36px',
    width: '36px',
  },
};
