import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCommentsStore } from '../../../modules/app/store/comments'; // Update the path accordingly

jest.mock('../../../backend/postService', () => ({
  getPostComments: jest.fn(),
}));

describe('useCommentsStore', () => {
  it('matches snapshot', async () => {
    const { asFragment } = renderSnapshotComponent();
    await act(async () => {});

    expect(asFragment()).toMatchSnapshot();
  });
});

const renderSnapshotComponent = () => {
  const Component = () => {
    const { commentsByPost, fetchComments } = useCommentsStore();
    fetchComments(1);
    return (
      <div>
        {commentsByPost.map((comment) => (
          <div key={comment.id}>{comment.text}</div>
        ))}
      </div>
    );
  };

  return render(<Component />);
};
