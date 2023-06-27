import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Card from '../components/Card';

const user = {
  name: 'John Doe',
  city: 'New York',
  country: 'USA',
  favoriteSport: 'Basketball',
};

describe('Card', () => {
  it('renders card component with correct user data', () => {
    const { getByText } = render(<Card data={user} />);

    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText(user.city)).toBeInTheDocument();
    expect(getByText(user.country)).toBeInTheDocument();
    expect(getByText(user.favoriteSport)).toBeInTheDocument();
  });
});