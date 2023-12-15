import React from 'react';
import Home from '../../../modules/app/components/buttons/HomeButtons';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

describe('Home component', () => {
    it('matches snapshot', () => {
      const { asFragment } = render(
        <MemoryRouter>
          <Home text="Home" route="/home" />
        </MemoryRouter>
      );
  
      expect(asFragment()).toMatchSnapshot();
    });
      
    it('navigates to the correct route', async () => {
        const { getByText } = render(
          <MemoryRouter initialEntries={['/']}>
            <Routes>
              <Route path="/" element={<Home text="Home" route="/home" />} />
              <Route path="/home" element={<div>text</div>} />
            </Routes>
          </MemoryRouter>
        );
      
        fireEvent.click(getByText('Home'));
        await waitFor(() => expect(screen.getByText('text')).toBeInTheDocument());
      });
  });