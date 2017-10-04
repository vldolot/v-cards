import {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAIL,
  CONTACTS_URL
} from './constants';
import request from '../utils/request';

export const fetchData = (source) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_DATA, payload: { source } });
    let data = await request(`${CONTACTS_URL}`);
    console.log("[data]", data);
    dispatch({ type: FETCH_DATA_SUCCESS, data });
  } catch (err) {
    dispatch({ type: FETCH_DATA_FAIL, err });
  }
}

export function fetchDataSuccess(response) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: {
      response
    },
  };
}

export function fetchDataFail() {
  return {
    type: FETCH_DATA_FAIL,
  };
}