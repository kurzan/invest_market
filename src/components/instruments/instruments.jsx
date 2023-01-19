import { useState, useMemo, useContext, useEffect } from 'react';
import styles from './instruments.module.css';
import { useSearchParams } from 'react-router-dom';
import { FavoriteInstrumentsContext } from '../../services/appContext';

export const InstrumentElement = ({instrument, isChecked}) => {
  const { favoriteInsruments, setFavoriteInstruments } = useContext(FavoriteInstrumentsContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked])

  const symbol = instrument.BOARDID === 'TQOB' ? '%' : '₽';
  const changeStyle = instrument.LASTTOPREVPRICE >= 0 ? { color: 'green' } : { color: 'red' };

  const getImageUrl = () => {
    const secid = instrument.SECID.toString();

    if (secid.startsWith('SU')) {
      return `./images/isins/ofz/minfinx640.png`
    } 
      
    return `./images/isins/${instrument.ISIN}.png`
  }

  const checkHandler = () => {
    setChecked(!checked)
    setFavoriteInstruments([...favoriteInsruments, instrument]);
    window.localStorage.setItem('favorites', JSON.stringify([...favoriteInsruments, instrument]));
  }

  return (
    <tr>
      <td>
        <div className={styles.rating_result}>
          <span  onClick={checkHandler} className={checked ? styles.active : ''}></span><img className={styles.icon} src={getImageUrl()} alt='' />{instrument.SHORTNAME}
        </div>
      </td>
      <td>{instrument.SECID}</td>
      <td>{instrument.LAST} {symbol}</td>
      <td>{instrument.PREVPRICE} {symbol}</td>
      <td style={changeStyle} >{instrument.LASTTOPREVPRICE} %</td>
      <td>{instrument.VALTODAY_RUR} ₽</td>
    </tr>
  )
}

export const Instruments = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteInsruments } = useContext(FavoriteInstrumentsContext);

  const onChange = e => {
    let filter = e.target.value;
    if (filter) {
        setSearchParams({ filter });
    } else {
        setSearchParams({});
    }
  };

  const marketDataColumns = data.marketdata.columns;
  const marketDataRows = data.marketdata.data;
  const mergedMarketData = marketDataRows.map(row => marketDataColumns.reduce((obj, key, index) => ({ ...obj, [key]: row[index] }), {}));

  const securitiesDataColumns = data.securities.columns;
  const securitiesDataRows = data.securities.data;
  const mergedSecuritiesData = securitiesDataRows.map(row => securitiesDataColumns.reduce((obj, key, index) => ({ ...obj, [key]: row[index] }), {}));

  const mergedInstruments = useMemo(
    () => {
      const instruments = [];

      for (let i = 0; i < mergedMarketData.length; i++) {
        instruments.push({
          ...mergedMarketData[i],
          ...(mergedSecuritiesData.find((itmInner) => itmInner.SECID === mergedMarketData[i].SECID))
        }
        );
      }

      return instruments;
    }, [mergedMarketData, mergedSecuritiesData]
  )

  const volumeSorted = mergedInstruments.slice().sort((prev, next) => next.VALTODAY_RUR - prev.VALTODAY_RUR);

  const filteredData = useMemo(
    () => {
      const searchValue = searchParams.get('filter') || '';
      return volumeSorted.filter(
        item => item.SHORTNAME.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1
      );
    },
    [volumeSorted, searchParams]
  ); 

  const isChecked = (item) => {

    for (let i=0; i < favoriteInsruments.length; i++) {
      if (favoriteInsruments[i].SECID === item.SECID) {
        return true;;
      }
    }
  }

  return (

  <div className={styles.container}>
    <input placeholder="Поиск" onChange={onChange} value={searchParams.get('filter') || ''} />
    <table>
      <thead>
        <tr>
          <th>Инструмент</th>
          <th>Тикер</th>
          <th>Цена</th>
          <th>Закрытие</th>
          <th>Изм, 1д</th>
          <th>Объем</th>
        </tr>
      </thead>
      <tbody>
        { filteredData.map((item) => item.LAST > 0 && <InstrumentElement key={item.SECID} instrument={item} isChecked={isChecked(item)} />)}
      </tbody>
    </table>
  </div>
  )
};



export const FavoriteInstruments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favoriteInsruments } = useContext(FavoriteInstrumentsContext);

  const onChange = e => {
    let filter = e.target.value;
    if (filter) {
        setSearchParams({ filter });
    } else {
        setSearchParams({});
    }
  };

  const volumeSorted = favoriteInsruments.slice().sort((prev, next) => next.VALTODAY_RUR - prev.VALTODAY_RUR);

  const filteredData = useMemo(
    () => {
      const searchValue = searchParams.get('filter') || '';
      return volumeSorted.filter(
        item => item.SHORTNAME.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1
      );
    },
    [volumeSorted, searchParams]
  ); 

  const isChecked = (item) => {

    for (let i=0; i < favoriteInsruments.length; i++) {
      if (favoriteInsruments[i].SECID === item.SECID) {
        return true;;
      }
    }
  }

  return (

  <div className={styles.container}>
    <input placeholder="Поиск" onChange={onChange} value={searchParams.get('filter') || ''} />
    <table>
      <thead>
        <tr>
          <th>Инструмент</th>
          <th>Тикер</th>
          <th>Цена</th>
          <th>Закрытие</th>
          <th>Изм, 1д</th>
          <th>Объем</th>
        </tr>
      </thead>
      <tbody>
        { filteredData.map((item, index) => item.LAST > 0 && <InstrumentElement key={item.ISIN} instrument={item} isChecked={isChecked(item)} />)}
      </tbody>
    </table>
  </div>
  )
};