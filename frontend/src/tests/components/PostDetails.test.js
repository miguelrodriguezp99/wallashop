import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PostDetails from '../../modules/app/components/PostDetails';
import { useFiltersStore } from '../../modules/app/store/filters';

jest.mock('../../modules/app/store/filters', () => ({
    useFiltersStore: jest.fn(),
}));

describe('PostDetails Component', () => {
  it('renders post details correctly', () => {

    useFiltersStore.mockReturnValue({
        getPostById: jest.fn(() => ({
          id: '1',
          title: 'Mock Post Title',
          price: '100',
          category: 'Mock Category',
          type: 'Mock Type',
          stillValid: 'Mock StillValid',
          created: 'Mock Created',
          expDate: 'Mock ExpDate',
        })),
    });

    
    const tree = renderer
      .create(
        <MemoryRouter initialEntries={['/posts/1']}>
          <Routes>
            <Route path="/posts/:id" element={<PostDetails />} />
          </Routes>
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  
});
