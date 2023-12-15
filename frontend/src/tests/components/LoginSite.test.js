import renderer from 'react-test-renderer';
import LoginSite from '../../modules/app/LoginSite';
import { LogginContext } from "../../modules/app/context/loginContext"; // Asegúrate de usar la ruta correcta
import { MemoryRouter } from "react-router-dom";

const fakeLogginContext = {
	token: "testToken",
};

describe('LoginSite component', () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <MemoryRouter>
            <LogginContext.Provider value={fakeLogginContext}>
                <LoginSite />
            </LogginContext.Provider>
        </MemoryRouter>)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});