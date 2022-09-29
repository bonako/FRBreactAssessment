import axios from 'axios';
import { API_URL } from './constant';

export const fetchData = async (
  setData,
  setGraphData,
  setLoading,
  setYearData,
  setSelectGraphData,
) => {
  try {
    setLoading(true);
    let graphDataArray = [];
    const response = await axios.get(API_URL);
    setLoading(false);
    const objectArray = Object.entries(response?.data?.data);
    objectArray.forEach(([key, value]) => {
      graphDataArray.push({
        date: new Date(key),
        value: value,
      });
      setYearData(preArray => [...preArray, { year: key }]);
    });
    setData(response?.data);
    setGraphData(graphDataArray);
    setSelectGraphData(graphDataArray);
  } catch (error) {
    setLoading(false);
    console.log('Error:::', error);
  }
};

export const getRemoveTemperatureInitialValue = data => {
  let obj = {};
  if (data && data.length) {
    obj = data[data.length - 1] || {};
    return obj.value || '';
  }
};

export const isValidFloatFunc = s => /^-?\d*(\.\d+)?$/i.test(s);
