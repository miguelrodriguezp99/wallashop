import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Filters } from './../../modules/app/components/Filters';
import { useFiltersStore } from '../../modules/app/store/filters';

jest.mock('../../modules/app/store/filters');

describe('Filters component', () => {
  beforeEach(() => {
    // Resetear el mock antes de cada test
    jest.clearAllMocks();
  });

  it('matches the snapshot', () => {
    // Setear el mock para que devuelva los valores que queramos
    useFiltersStore.mockReturnValueOnce('0'); // price
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setCategoryFilter
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setPriceFilter
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setTypeFilter
    useFiltersStore.mockReturnValueOnce('mocked-query'); // query
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setQuery
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setStillValid
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setCreated
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setExpDate

    render(<Filters />);
    expect(screen).toMatchSnapshot();
  });

  it('setPriceFilter on Slider change', () => {
    // Setear valores del mock para useFiltersStore
    useFiltersStore.mockReturnValueOnce('0'); // price
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setCategoryFilter
    const setPriceFilterMock = jest.fn();
    useFiltersStore.mockReturnValueOnce(setPriceFilterMock); // setPriceFilter
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setTypeFilter
    useFiltersStore.mockReturnValueOnce('mocked-query'); // query
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setQuery
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setStillValid
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setCreated
    useFiltersStore.mockReturnValueOnce(jest.fn()); // setExpDate

    render(<Filters />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } });
    expect(setPriceFilterMock).toHaveBeenCalledWith('10');
  });

  

});
