import React from 'react';
import RegisterSite from '../../modules/app/RegisterSite';
import renderer from 'react-test-renderer';
import { LogginContext } from "../../modules/app/context/loginContext"; // Asegúrate de usar la ruta correcta
import { MemoryRouter } from "react-router-dom";

import '@testing-library/jest-dom';

jest.mock('../../modules/app/firebase/config.js', () => ({
}));


const fakeLogginContext = {
	token: "testToken",
};

describe('RegisterSite component', () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <MemoryRouter>
            <LogginContext.Provider value={fakeLogginContext}>
                <RegisterSite />
            </LogginContext.Provider>
        </MemoryRouter>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});