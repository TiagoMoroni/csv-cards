import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

test('calls onSearch prop with the entered search term', () => {
  const onSearchMock = jest.fn();
  const searchTerm = 'Test';
  const { getByLabelText, getByText } = render(<SearchBar onSearch={onSearchMock} />);
  const input = getByLabelText('Search for stuff');
  const button = getByText('Go');

  fireEvent.change(input, { target: { value: searchTerm } });
  fireEvent.click(button);

  expect(onSearchMock).toHaveBeenCalledWith(searchTerm);
});

test('calls onSearch prop with empty search term after clearing the input field', () => {
  const onSearchMock = jest.fn();
  const { getByLabelText } = render(<SearchBar onSearch={onSearchMock} />);
  const input = getByLabelText('Search for stuff');

  fireEvent.change(input, { target: { value: 'Test' } });
  expect(onSearchMock).not.toHaveBeenCalled();

  fireEvent.change(input, { target: { value: '' } });
  expect(onSearchMock).toHaveBeenCalledWith('');
});