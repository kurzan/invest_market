import { useState } from 'react';
import styles from './instruments.module.css';

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

  const marketDataColumns = data.marketdata.columns;
  const marketDataRows = data.marketdata.data;
  const mergedMarketData = marketDataRows.map(row => marketDataColumns.reduce((obj, key, index) => ({ ...obj, [key]: row[index] }), {}));

  const securitiesDataColumns = data.securities.columns;
  const securitiesDataRows = data.securities.data;
  const mergedSecuritiesData = securitiesDataRows.map(row => securitiesDataColumns.reduce((obj, key, index) => ({ ...obj, [key]: row[index] }), {}));

  const mergedInstruments = [];

  for (let i = 0; i < mergedMarketData.length; i++) {
    mergedInstruments.push({
      ...mergedMarketData[i],
      ...(mergedSecuritiesData.find((itmInner) => itmInner.SECID === mergedMarketData[i].SECID))
    }
    );
  }

  const volumeSorted = mergedInstruments.sort((prev, next) => next.VALTODAY_RUR - prev.VALTODAY_RUR);



  return (

  <div className={styles.container}>
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
        { volumeSorted.map((item, index) => item.LAST > 0 && <InstrumentElement key={index} instruments={item} />)}
      </tbody>
    </table>
  </div>
  )
};