import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterForm from '../../../modules/app/components/forms/RegisterForm';
import { LogginContext } from '../../../modules/app/context/loginContext'; 
import { useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('../../../modules/app/firebase/config.js', () => ({
}));

describe('RegisterForm component', () => {
    it('renders all components correctly', () => {
        const fakeLogginContext = {
            login: jest.fn(),
            setToken: jest.fn(),
            setUser: jest.fn(),
            setImage: jest.fn(),
        };

        const TestComponent = () => {
            testLocation = useLocation();
            return null;
        };
            
        let testHistory, testLocation;
        render(
            <MemoryRouter initialEntries={['/register']}>
            <LogginContext.Provider value={fakeLogginContext}>
                <Routes>
                <Route path="/register" element={<RegisterForm />} />
                <Route path="*" element={<TestComponent />} />  
                </Routes>
            </LogginContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

        const signUpButton = screen.getByText('Sign Up');
        const homeButton = screen.getByText('Home');

        expect(signUpButton).toBeInTheDocument();
        expect(homeButton).toBeInTheDocument();

        fireEvent.click(homeButton);
        expect(testLocation.pathname).toBe('/wallashop/home');
    });

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
                <RegisterForm />
            </LogginContext.Provider>
            </MemoryRouter>
        );

        expect(asFragment()).toMatchSnapshot();
    });
});