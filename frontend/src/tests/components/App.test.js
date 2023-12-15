import React from 'react';
import { render } from '@testing-library/react';
import App from '../../modules/app/App';
import { LogginContext } from '../../modules/app/context/loginContext';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

const fakeLogginContext = {
    token: 'testToken',
    user: 'id'
  };
  
  describe('App component', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <LogginContext.Provider value={fakeLogginContext}>
            <App />
          </LogginContext.Provider>
        </MemoryRouter>
      );
  
      expect(asFragment()).toMatchSnapshot();
    });
  });