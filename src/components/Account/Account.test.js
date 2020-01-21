import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Account from './Account';

it('renders without crashing', () => {
  shallow(<Account />);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<Account />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders apikey input bar', () => {
  const wrapper = shallow(<Account />);
  const element = <label htmlFor="apikey" className="col-sm-2 col-form-label">Guild Wars 2 Account API KEY</label>;
  expect(wrapper).toContainReact(element);
});

// it('fetches GW2 account data properly', async () => {
//   const accountComponent = shallow(<Account />);
//   accountComponent.setState({ account_api_key: 'A645F4B5-6F07-B341-9B92-CADF989CAF7F9BE9F9D9-097E-4934-BAA1-3F1B0F5C24AD' });
//   await accountComponent.fetchAccountData();
//   expect(accountComponent.state.accountData).not.toBeNull();
// });

// it('GW2 account data fetch FAILS with an error', async () => {
//   const accountComponent = shallow(<Account />);
//   expect.assertions(1);
//   try {
//     await accountComponent.fetchAccountData();
//   } catch (e) {
//     expect(e).toMatch('error');
//   }
// });