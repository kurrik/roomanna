import React from 'react';
import { shallow, mount, render } from 'enzyme';

import TestComponent from '../';

describe('TestComponent', function() {
  it('should mount in a full DOM', function() {
    expect(mount(<TestComponent />).find('button').length).toBe(1);
  });

  it('should toggle its text when clicked', function() {
    const wrapper = shallow(<TestComponent />);
    expect(wrapper.find('button').text()).toEqual('ON');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('button').text()).toEqual('OFF');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('button').text()).toEqual('ON');
  });
});
