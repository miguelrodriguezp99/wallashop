import Selector from  '../../../modules/app/components/selectors/Selector';
import renderer from 'react-test-renderer';

describe('Selector component', () => {
    it('matches snapshot', () => {
      const mockFn = jest.fn();
      const tree = renderer
        .create(<Selector value="1" fn={mockFn} placeholder="Select a category" />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });


  