import renderer from 'react-test-renderer';
import Home from "../../modules/app/Home";
import { LogginContext } from "../../modules/app/context/loginContext"; // Asegúrate de usar la ruta correcta
import { MemoryRouter } from "react-router-dom";


const fakeLogginContext = {
	token: "testToken",
};

it('rensders correctly', () => {
	const tree = renderer
		.create(
			<MemoryRouter>
				<LogginContext.Provider value={fakeLogginContext}>
					<Home />
				</LogginContext.Provider>
			</MemoryRouter>)
		.toJSON();
	expect(tree).toMatchSnapshot();
});