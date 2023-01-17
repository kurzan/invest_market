import { Instruments } from '../components/instruments/instruments';
import { useEffect, useState } from 'react';
import { getRequest, SHARES_MOEX_API } from '../utils/api'

export const Shares = () => {
  const [marketData, setMarketData] = useState();

  useEffect(() => {
    getRequest(SHARES_MOEX_API, setMarketData)
  }, []);

  return (
    marketData && <Instruments data={marketData} />
  )
}