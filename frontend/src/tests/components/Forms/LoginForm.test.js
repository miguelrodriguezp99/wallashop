import { render } from '@testing-library/react';
import LoginForm from '../../../modules/app/components/forms/LoginForm';
import { LogginContext } from '../../../modules/app/context/loginContext'; 
import { MemoryRouter } from 'react-router-dom';

describe('LoginForm component', () => {
  it('matches snapshot', () => {
    const fakeLogginContext = {
      login: jest.fn(),
      setToken: jest.fn(),
      setUser: jest.fn(),
      setImage: jest.fn(),
    };

    const { asFragment } = render(
      <MemoryRouter>
        <LogginContext.Provider value={fakeLogginContext}>
          <LoginForm />
        </LogginContext.Provider>
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
  
});