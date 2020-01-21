import LocalCache from '../../helpers/LocalCache';

export const CHANGE_ACCOUNT = 'CHANGE_ACCOUNT';
export const CHANGE_APIKEY = 'CHANGE_APIKEY';
export const REQUEST_ACCOUNT_DATA = 'REQUEST_ACCOUNT_DATA';
export const RECEIVE_ACCOUNT_DATA = 'RECEIVE_ACCOUNT_DATA';

export function changeAccount(account_api_key, accountData) {
  return {
    type: CHANGE_ACCOUNT,
    account_api_key,
    accountData
  };
}

export function changeApikey(account_api_key) {
  return {
    type: CHANGE_APIKEY,
    account_api_key
  };
}

function saveState(accountData) {
  return function() {
    try {
      LocalCache.set('accountState', accountData);
    } catch(error) {}
  }
}

export function loadState() {
  return function(dispatch) {
    return LocalCache.get('accountState').then(({ account_api_key, accountData }) => dispatch(changeAccount(account_api_key, accountData)));
  };
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
          (json.id?dispatch(receiveAccountData(account_api_key, json)):dispatch(receiveAccountData(account_api_key, {})));
          (json.id?dispatch(saveState({account_api_key, accountData: json})):dispatch(saveState({account_api_key, accountData: {}})));
        }
      );
  }
}

function shouldFetchAccountData(state) {
  const { isFetching, didInvalidate } = state.AccountReducer;
  if (!isFetching) {
    return true
  } else if (isFetching) {
    return false
  } else {
    return didInvalidate
  }
}

export function fetchAccountDataIfNeeded(account_api_key) {
  return (dispatch, getState) => {
    if (shouldFetchAccountData(getState())) {
      return dispatch(fetchAccountData(account_api_key))
    }
  }
}