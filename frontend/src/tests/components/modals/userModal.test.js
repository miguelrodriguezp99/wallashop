import React from 'react';
import UserModal from '../../../modules/app/components/modals/userModal';
import { LogginContext } from '../../../modules/app/context/loginContext';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom'; 
import {render, fireEvent, waitFor, getAllByText} from '@testing-library/react';

jest.mock('../../../modules/app/firebase/config.js', () => ({
}));

const fakeLogginContext = {
    user: { id: 1 }, 
    token: "testToken",
};
  
describe("UserModal", () => {
  it("renders correctly", () => {
    const tree = renderer.create(
      <MemoryRouter>
        <LogginContext.Provider value={fakeLogginContext}>
          <UserModal />
        </LogginContext.Provider>
      </MemoryRouter>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
 
});