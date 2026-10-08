import { useState, useEffect, useRef } from 'react';
import { useMarketStore } from '../store/useMarketStore';

export function useLivePrice(symbol) {
  const priceData = useMarketStore(state => state.prices[symbol] || state.indices[symbol]);
  const [flashClass, setFlashClass] = useState('');
  const prevLtpRef = useRef(priceData?.ltp);

  useEffect(() => {
    if (!priceData || !priceData.ltp) return;

    if (prevLtpRef.current !== undefined && prevLtpRef.current !== priceData.ltp) {
      if (priceData.ltp > prevLtpRef.current) {
        setFlashClass('tick-flash-up');
      } else if (priceData.ltp < prevLtpRef.current) {
        setFlashClass('tick-flash-down');
      }

      const timer = setTimeout(() => {
        setFlashClass('');
      }, 700);

      prevLtpRef.current = priceData.ltp;
      return () => clearTimeout(timer);
    }

    prevLtpRef.current = priceData.ltp;
  }, [priceData?.ltp]);

  return {
    ...priceData,
    flashClass,
    isPositive: (priceData?.change || 0) >= 0,
  };
}
