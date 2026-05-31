import { useState, useEffect } from 'react';

const BASE = 'https://nigeria-states-towns-lgas.onrender.com/api';

export function useStates() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/states`)
      .then(r => r.json())
      .then(data => setStates(data))
      .catch(console.error);
  }, []);

  return states;
}

export function useLGAs(stateCode) {
  const [lgas, setLgas] = useState([]);

  useEffect(() => {
    if (!stateCode) return;
    setLgas([]);
    fetch(`${BASE}/${stateCode}/lgas`)
      .then(r => r.json())
      .then(data => setLgas(data))
      .catch(console.error);
  }, [stateCode]);

  return lgas;
}

export function useTowns(stateCode) {
  const [towns, setTowns] = useState([]);

  useEffect(() => {
    if (!stateCode) return;
    setTowns([]);
    fetch(`${BASE}/${stateCode}/towns`)
      .then(r => r.json())
      .then(data => setTowns(data))
      .catch(console.error);
  }, [stateCode]);

  return towns;
}