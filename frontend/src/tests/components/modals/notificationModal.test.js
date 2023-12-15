import React from 'react';
import NotificationModal from '../../../modules/app/components/modals/notificationModal';
import { MemoryRouter } from 'react-router-dom'; 
import { render, screen, fireEvent } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { LogginContext } from '../../../modules/app/context/loginContext';

const fakeLogginContext = {
    user: { id: 1 }, 
    token: "testToken",
};
  
  describe("NotificationModal", () => {
    it("renders correctly", () => {
      const tree = renderer.create(
        <MemoryRouter>
          <LogginContext.Provider value={fakeLogginContext}>
            <NotificationModal />
          </LogginContext.Provider>
        </MemoryRouter>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });