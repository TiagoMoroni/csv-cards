import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

test('should call onSearch with the entered search term', () => {
  const onSearchMock = jest.fn();
  const searchTerm = 'Test';

  const { getByPlaceholderText } = render(<SearchBar onSearch={onSearchMock} />);

  const input = getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: searchTerm } });

  expect(onSearchMock).toHaveBeenCalledWith(searchTerm);
});