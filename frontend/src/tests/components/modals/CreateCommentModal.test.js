import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import renderer from 'react-test-renderer';
import CreateCommentModal from '../../../modules/app/components/modals/CreateCommentModal';

describe('CreateCommentModal component', () => {
  it('renders without errors, shows the Submit button, and matches snapshot', () => {
    const state = {
      id: 'postId',
      post: {
        id: 'parentCommentId',
      },
    };
    const setCommentCount = jest.fn();

    const { getByRole } = render(
      <CreateCommentModal state={state} reply={false} setCommentCount={setCommentCount} />
    );

    const submitButton = getByRole('button');
    expect(submitButton).toBeInTheDocument();
    fireEvent.click(submitButton);

    const tree = renderer.create(
      <CreateCommentModal state={state} reply={false} setCommentCount={setCommentCount} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});