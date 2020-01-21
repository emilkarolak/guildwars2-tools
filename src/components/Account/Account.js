import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadState, changeApikey, fetchAccountDataIfNeeded } from './AccountActions';
import Table from '../../helpers/Table';
import './Account.scss';

const Account = ({ account_api_key, accountData, dispatch }) => {
  const handleChange = (event) => {
    dispatch(changeApikey(event.target.value));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(fetchAccountDataIfNeeded(account_api_key));
  }
  useEffect(() => {
    dispatch(loadState());
  }, [dispatch]);
  return (
    <section className="page-content">
      <h1>
        GuildWars 2 - Account info{accountData?accountData.name?" ("+accountData.name+")":"":""}
      </h1>
      <form onSubmit={handleSubmit} className="row apikey-bar">
        <div className="col-11">
          <div className="row">
            <label htmlFor="apikey" className="col-sm-2 col-form-label">Guild Wars 2 Account API KEY</label>
            <input type="text" id="apikey" className="form-control col-sm-10 apikey-input" value={account_api_key} onChange={handleChange} />
          </div>
        </div>
        <div className="col-1">
          <button type="submit" className="btn btn-primary w-100">Save</button>
        </div>
      </form>
      <div className="row">
        <div className="col-12 mt-3">
          <Table data={accountData} />
        </div>
      </div>
    </section>
  )
};

Account.propTypes = {
  account_api_key: PropTypes.string.isRequired,
  accountData: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return state.AccountReducer
}

export default connect(mapStateToProps)(Account)