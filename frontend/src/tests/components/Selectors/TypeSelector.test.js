import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TypeSelector from  '../../../modules/app/components/selectors/TypeSelector';

const types = [
  { value: 'OFFER', label: 'Offers' },
  { value: 'COUPON', label: 'Coupons' },
];

test('handles type selection correctly', () => {
  const onSelectMock = jest.fn();
  const { getByLabelText } = render(
    <TypeSelector value="OFFER" fn={onSelectMock} />
  );
  fireEvent.click(getByLabelText('Select a type Type'));
  fireEvent.click(getByLabelText('Coupons'));
  expect(onSelectMock).toHaveBeenCalledWith('COUPON');
});