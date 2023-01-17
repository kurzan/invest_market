import { useState, useMemo } from 'react';
import styles from './instruments.module.css';
import { useSearchParams } from 'react-router-dom';

export const InstrumentElement = ({instruments}) => {

  return (
    <tr>
      
      <td><div className={styles.shortname}><img className={styles.icon} src={`./images/isins/${instruments.ISIN}.png` || `./images/isins/favicon.ico`} alt='' />{instruments.SHORTNAME}</div></td>
      <td>{instruments.SECID}</td>
      <td>{instruments.LAST} ₽</td>
      <td>{instruments.PREVPRICE} ₽</td>
      <td style={instruments.LASTTOPREVPRICE >= 0 ? { color: 'green' } : { color: 'red' }} >{instruments.LASTTOPREVPRICE} %</td>
      <td>{instruments.VALTODAY_RUR} ₽</td>
    </tr>
  )
}

export const Instruments = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
      return mergedInstruments.filter(
        item => item.SHORTNAME.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1
      );
    },
    [mergedInstruments, searchParams]
  ); 

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
        { filteredData.map((item, index) => item.LAST > 0 && <InstrumentElement key={index} instruments={item} />)}
      </tbody>
    </table>
  </div>
  )
};