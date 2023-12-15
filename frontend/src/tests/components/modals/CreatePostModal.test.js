import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import ModalB from  './../../../modules/app/components/modals/CreatePostModal';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../modules/app/firebase/config.js', () => ({
}));

describe('ModalB component', () => {
    it('renders correctly', () => {
      const tree = renderer.create(
        <MemoryRouter>
          <ModalB />
        </MemoryRouter>
      ).toJSON();
      expect(tree).toMatchSnapshot();
    });
});