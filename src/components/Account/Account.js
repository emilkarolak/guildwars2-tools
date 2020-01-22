import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { loadState, changeApikey, clearDataAsync, fetchAccountDataIfNeeded } from './AccountActions';
import $ from 'jquery';
import './Account.scss';

const Account = ({ account_api_key, accountData, isFetching, dispatch }) => {
  const handleChange = (event) => {
    dispatch(changeApikey(event.target.value));
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(fetchAccountDataIfNeeded(account_api_key));
  }
  const handleClearDataClick = (event) => {
    event.preventDefault();
    dispatch(clearDataAsync());
  }
  const toAge = (seconds) => {
    var labels = ['hours', 'minutes', 'seconds'],
      increments = [3600, 60, 1],
      result = "",
      i,
      increment,
      label,
      quantity;
    for(i = 0; i < 3; i += 1) {
      increment = increments[i];
      label = labels[i];
      if(seconds >= increment) {
        quantity = Math.floor(seconds / increment);
        if(quantity === 1) {
          label = label.slice(0, -1);
        }
        seconds -= quantity * increment;
        result = result + " " + quantity + " " + label + ",";
      }
    }
    result = result.slice(1, -1);
    if(result === "") {
      result = "less than one " + labels[2].slice(0, -1);
    }
    return result;
  }
  useEffect(() => {
    dispatch(loadState());
    $('.toast').toast();
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
            <input type="text" id="apikey" className="form-control col-sm-10 apikey-input" required value={account_api_key} onChange={handleChange} />
          </div>
          <div className="row">
            <div className="col-sm-2" />
            <small id="emailHelp" className="col-sm-10 form-text text-muted" style={{ padding: 0 }}><a href="https://wiki.guildwars2.com/wiki/API:API_key" target="_blank" rel="noopener noreferrer">How to get an API KEY?</a></small>
          </div>
        </div>
        <div className="col-1">
          <button type="submit" className="btn btn-primary w-100" disabled={isFetching}>{isFetching?'Fetching data':(accountData.id?'Update':'Save')}</button>
        </div>
      </form>
      <div className="row">
        <div className="col-12 mt-3">
          <h3>Account Info {accountData.id?<button type="button" className="btn btn-danger btn-sm" onClick={handleClearDataClick}>Clear data</button>:''}</h3>
          {
          accountData.id
          ?
          <dl className="row">
            <dt className="col-sm-3">Name</dt>
            <dd className="col-sm-9">{accountData.name}</dd>
            <dt className="col-sm-3">Age (playtime)</dt>
            <dd className="col-sm-9">{toAge(accountData.age)}</dd>
            <dt className="col-sm-3">Created at</dt>
            <dd className="col-sm-9">{new Date(Date.parse(accountData.created)).toUTCString()}</dd>
            <dt className="col-sm-3">Current world ID</dt>
            <dd className="col-sm-9">{accountData.world}</dd>
            <dt className="col-sm-3">Game access</dt>
            <dd className="col-sm-9"><ul>{accountData.access?accountData.access.map((type, index)=><li key={index}>{type}</li>):<li>No access</li>}</ul></dd>
            <dt className="col-sm-3">Is commander?</dt>
            <dd className="col-sm-9">{accountData.commander?'Yes':'No'}</dd>
            <dt className="col-sm-3">Fractal level</dt>
            <dd className="col-sm-9">{accountData.fractal_level}</dd>
            <dt className="col-sm-3">Daily AP</dt>
            <dd className="col-sm-9">{accountData.daily_ap}</dd>
            <dt className="col-sm-3">Monthly AP</dt>
            <dd className="col-sm-9">{accountData.monthly_ap}</dd>
            <dt className="col-sm-3">WvW rank</dt>
            <dd className="col-sm-9">{accountData.wvw_rank}</dd>
          </dl>
          :
          <div className="alert alert-danger" role="alert">Provide valid API KEY to get your GW2 Account Info</div>
          }
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center">
        <div id="invalid_apikey_error" className="toast" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="false">
          <div className="toast-header">
            <svg className="bd-placeholder-img rounded mr-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img"><rect width="100%" height="100%" fill="#f00"></rect></svg>
            <strong className="mr-auto">GW2 API KEY</strong>
            <small>Now</small>
            <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="toast-body">
            You provided invalid GW2 api key.<br />
            Please try again.
          </div>
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