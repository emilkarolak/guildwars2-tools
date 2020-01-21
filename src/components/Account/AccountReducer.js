import {
  CHANGE_ACCOUNT,
  CHANGE_APIKEY,
  REQUEST_ACCOUNT_DATA,
  RECEIVE_ACCOUNT_DATA
} from './AccountActions';

export default function AccountReducer(state = { account_api_key: '', accountData: {}, isFetching: false, didInvalidate: false }, action) {
  switch(action.type) {
    case CHANGE_ACCOUNT:
      return Object.assign({}, state, {
        account_api_key: action.account_api_key,
        accountData: action.accountData
      })
    case CHANGE_APIKEY:
      return Object.assign({}, state, {
        account_api_key: action.account_api_key
      })
    case REQUEST_ACCOUNT_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_ACCOUNT_DATA:
      return Object.assign({}, state, {
        accountData: action.accountData,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt
      })
    default:
      return state;
  }
}