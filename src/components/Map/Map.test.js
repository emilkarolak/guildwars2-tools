import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Map from './Map';

it('renders without crashing', () => {
  shallow(<Map />);
});

it('renders correctly', () => {
  const tree = renderer
    .create(<Map />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// it('saves and loads map state correctly', async () => {
//   const mapComponent = shallow(<Map />);
//   let mapComponentState = mapComponent.state;
//   mapComponentState.zoom = 4;
//   mapComponent.setState({ zoom: 4 });
//   await saveMapState();
//   expect(mapComponent.state.accountData).not.toBeNull();
//   return expect(loadMapState()).resolves.toEqual(mapComponentState);
// });
