import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect';
import Navbar from '../../modules/app/components/Navbarc';
import { LogginContext } from "../../modules/app/context/loginContext"; // Asegúrate de usar la ruta correcta
import { MemoryRouter } from "react-router-dom";
import {render, fireEvent, screen} from '@testing-library/react';

const fakeLogginContext = {
    token: 'testToken',
    user: 'id'
};

// Reemplazar useNavigate por una versión simulada en el dom (tambien simulado)
// Permite rastrear su comportamiento
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Se hace para que no se ejecuten los modulos reales del codigo, sino que se simulan
jest.mock('../../modules/app/components/modals/userModal', () => () => <div>UserModal Mock</div>);  //Ahora la función userModal devuelve <div>UserModal Mock</div>
jest.mock('../../modules/app/components/modals/notificationModal', () => () => <div>NotificationModal Mock</div>); // Lo mismo para notificationModal

describe('Navbar component', () => {
  it('matches the snapshot', () => {
    const tree = renderer.create(
        <MemoryRouter>
          <LogginContext.Provider value={fakeLogginContext}>
            <Navbar />
          </LogginContext.Provider>
        </MemoryRouter>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('handles navigation on click', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

    render( 
        <MemoryRouter>
            <LogginContext.Provider value={fakeLogginContext}>
                <Navbar />
            </LogginContext.Provider>
        </MemoryRouter>);

    fireEvent.click(screen.getByText(/wallashop/i));
    expect(navigateMock).toHaveBeenCalledWith('/wallashop/');
    
  });

  it('handles navigation on login button click', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <LogginContext.Provider value={{ fakeLogginContext }}>
          <Navbar />
        </LogginContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));
    expect(navigateMock).toHaveBeenCalledWith('/wallashop/login');
  });

  it('handles navigation on logout button click', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <LogginContext.Provider value={{ token: 'testToken', setToken: jest.fn(), setImage: jest.fn() }}>
          <Navbar />
        </LogginContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Log out'));
    expect(navigateMock).toHaveBeenCalledWith('/wallashop');
  });

  it('handles navigation on signup button click', () => {
    const navigateMock = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <LogginContext.Provider value={{fakeLogginContext}}>
          <Navbar />
        </LogginContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Sign Up/i));
    expect(navigateMock).toHaveBeenCalledWith('/wallashop/register');
  });

});