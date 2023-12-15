import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostCard from '../../modules/app/components/PostCard';
import { LogginContext } from "../../modules/app/context/loginContext"; 
import '@testing-library/jest-dom';

const fakeLogginContext = {
    token: 'testToken',
    user: { id: 'user1' }
};

const samplePost = {
  id: '1',
  type: 'OFFER',
  images: ['image1', 'image2'],
  category: { name: 'cat' },
  title: 'title',
  price: '20',
  stillValid: '2023-12-31T12:00:00.000Z',
  user: { id: 'user1' },
};


jest.mock('../../backend/postService', () => ({
    ...jest.requireActual('../../backend/postService'),
    deletePost: jest.fn().mockResolvedValue({}), 
  }));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));
  

describe('PostCard component', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('matches the snapshot', () => {
        const post = {
          id: '1',
          type: 'OFFER',
          images: ['image1', 'image2'],
          category: { name: 'cat1' },
          title: 'title',
          price: '20',
          user: { id: 'user1' },
          stillValid: '2023-01-01T12:00:00.000Z',
        };
    
        const { asFragment } = 
        render(
            <MemoryRouter>
                <LogginContext.Provider value={fakeLogginContext}>
                  <PostCard post={samplePost} />
                </LogginContext.Provider>
            </MemoryRouter>
        );
    
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders PostCard correctly', () => {
        render(
            <MemoryRouter>
                <LogginContext.Provider value={fakeLogginContext}>
                  <PostCard post={samplePost} />
                </LogginContext.Provider>
            </MemoryRouter>
        );

        // Check if essential elements are present
        expect(screen.getByText('title')).toBeInTheDocument();
        expect(screen.getByText('20 €')).toBeInTheDocument();
        expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('handles delete button click for user-owned post', () => {
        const deleteMock = jest.fn();
        render(
        <MemoryRouter>
            <LogginContext.Provider value={fakeLogginContext}>
                <PostCard post={samplePost} />
            </LogginContext.Provider>
        </MemoryRouter>
        );
    });

    
    it('does not render EditPostModal when user does not own the post', () => {
        const fakeLogginContextForOtherUser = {
          token: 'testToken',
          user: { id: 'user2' },
        };
    
        render(
          <MemoryRouter>
            <LogginContext.Provider value={fakeLogginContextForOtherUser}>
              <PostCard post={samplePost} />
            </LogginContext.Provider>
          </MemoryRouter>
        );
    
        expect(screen.queryByTestId('edit-post-modal')).toBeNull();
      });

      
});



