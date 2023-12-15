import React from 'react';
import { render } from '@testing-library/react';
import { LogginProvider } from '../../../modules/app/context/loginContext';

test('LogginProvider renders correctly', () => {
    const { asFragment } = render(<LogginProvider />);
    expect(asFragment()).toMatchSnapshot();
  });