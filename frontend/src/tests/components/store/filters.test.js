import { useFiltersStore } from '../../../modules/app/store/filters'
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

jest.mock('../../../backend/postService', () => ({
  getPosts: jest.fn().mockResolvedValue([
    { id: 1, title: 'Post 1', price: 20, category: { name: 'c1' }, type: 't1', description: 'desc1' },
    { id: 2, title: 'Post 2', price: 30, category: { name: 'c2' }, type: 't2', description: 'desc2' },
  ]),
}));

const { getPosts } = require('../../../backend/postService');

describe('useFiltersStore', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useFiltersStore());

    expect(result.current.price).toBe('0');
    expect(result.current.category).toBe('all');
    expect(result.current.type).toBe('all');
    expect(result.current.query).toBe('');
    expect(result.current.posts).toEqual([]);
    expect(result.current.filteredPosts).toEqual([]);
    expect(result.current.stillValid).toBeNull();
    expect(result.current.created).toBeNull();
    expect(result.current.expDate).toBeNull();

  });

  it('searches posts correctly with criteria', async () => {
    const { result } = renderHook(() => useFiltersStore());

    await act(async () => {
      result.current.setPriceFilter('20');
      result.current.setCategoryFilter('c1');
      result.current.setTypeFilter('t1');
      result.current.setQuery('desc');

      await result.current.fetchPosts();
    });

    expect(result.current.filteredPosts).toMatchSnapshot();
  });

  it('fetches posts correctly', async () => {
    const { result } = renderHook(() => useFiltersStore());
    expect(getPosts).toHaveBeenCalledTimes(0);

    await act(async () => {
      await result.current.fetchPosts();
    });

    expect(result.current.posts).toMatchSnapshot();
    expect(getPosts).toHaveBeenCalledTimes(1);
  });
  
});
