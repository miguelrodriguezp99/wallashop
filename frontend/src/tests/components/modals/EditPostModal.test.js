import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import EditPostModal from './../../../modules/app/components/modals/EditPostModal';

describe('EditPostModal component', () => {
  const mockPost = {
    id: 1,
    title: 'Sample Title',
    description: 'Sample Description',
    url: 'https://example.com',
    price: 20.99,
    category: {
      id: 1,
      name: 'Sample Category',
    },
    active: true,
  };

  it('renders correctly', () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <EditPostModal post={mockPost} />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});