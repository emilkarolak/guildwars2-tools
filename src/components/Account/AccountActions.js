import LocalCache from '../../helpers/LocalCache';
import $ from 'jquery';

export const LOAD_ACCOUNT = 'LOAD_ACCOUNT';
export const CHANGE_APIKEY = 'CHANGE_APIKEY';
export const CLEAR_DATA = 'CLEAR_DATA';
export const REQUEST_ACCOUNT_DATA = 'REQUEST_ACCOUNT_DATA';
export const RECEIVE_ACCOUNT_DATA = 'RECEIVE_ACCOUNT_DATA';

export function loadAccount(account_api_key, accountData) {
  return {
    type: LOAD_ACCOUNT,
    account_api_key,
    accountData
  }
}

export function changeApikey(account_api_key) {
  return {
    type: CHANGE_APIKEY,
    account_api_key
  }
}

function clearData() {
  return {
    type: CLEAR_DATA
  }
}

export function clearDataAsync() {
  return dispatch => {
    dispatch(saveState({account_api_key: '', accountData: {}}));
    dispatch(clearData());
  }
}

function saveState(accountState) {
  return function() {
    LocalCache.set('accountState', accountState).catch(error => console.log(error))
  }
}

export function loadState() {
  return dispatch => {
    return LocalCache.get('accountState').then(({ account_api_key, accountData }) => dispatch(loadAccount(account_api_key, accountData))).catch(error => console.log(error));
  }
}

function requestAccountData(account_api_key) {
  return {
    type: REQUEST_ACCOUNT_DATA,
    account_api_key
  }
}

function receiveAccountData(account_api_key, json) {
  return {
    type: RECEIVE_ACCOUNT_DATA,
    account_api_key,
    accountData: json,
    receivedAt: Date.now()
  }
}

function fetchAccountData(account_api_key) {
  return dispatch => {
    dispatch(requestAccountData(account_api_key))
    return fetch(`${process.env.REACT_APP_GW2_API_V2}account?access_token=${account_api_key}`)
      .then(response => response.json())
      .then(json => {
          $('#invalid_apikey_error').toast(json.id?'hide':'show');
          (json.id?dispatch(receiveAccountData(account_api_key, json)):dispatch(receiveAccountData(account_api_key, {})));
          (json.id?dispatch(saveState({account_api_key, accountData: json})):dispatch(saveState({account_api_key, accountData: {}})));
        }
      )
      .catch(error => console.log(error));
  }
}

function shouldFetchAccountData(state) {
  const { isFetching, didInvalidate } = state.AccountReducer;
  if(!isFetching) {
    return true
  } else if(isFetching) {
    return false
  } else {
    return didInvalidate
  }
}

export function fetchAccountDataIfNeeded(account_api_key) {
  return (dispatch, getState) => {
    if(shouldFetchAccountData(getState())) {
      return dispatch(fetchAccountData(account_api_key))
    }
  }
}