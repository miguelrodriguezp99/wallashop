import LoginInput from '../../../modules/app/components/inputs/LoginInput';
import renderer from 'react-test-renderer';

describe('LoginInput component', () => {
    it('matches snapshot', () => {
      const mockFn = jest.fn();
  
      const tree = renderer
        .create(<LoginInput name="test" placeholder="Enter text" type="text" value="1" fn={mockFn} />)
        .toJSON();
  
      expect(tree).toMatchSnapshot();
    });
  });