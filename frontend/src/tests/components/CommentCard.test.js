import React from 'react';
import renderer from 'react-test-renderer';
import CommentCard from '../../modules/app/components/CommentCard';

jest.mock('../../modules/app/components/modals/CreateCommentModal', () => 'CreateCommentModal');
test('renders CommentCard correctly', () => {
  const comment = {
    user: {
      avatar: 'url',
      userName: 'user',
      email: 'a@a.com',
    },
    text: 'comment',
  };

  const setCommentCount = jest.fn();
  const component = renderer.create(<CommentCard comment={comment} setCommentCount={setCommentCount} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});