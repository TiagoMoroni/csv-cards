import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import FileUploader from '../components/FileUploader';

jest.mock('axios');

describe('FileUploader', () => {
  test('uploads file and calls onUpload with data when successful', async () => {
    const onUploadMock = jest.fn();
    const onErrorMock = jest.fn();
    axios.post.mockResolvedValueOnce();

    const { getByTestId } = render(
      <FileUploader onUpload={onUploadMock} onError={onErrorMock} />
    );

    const fileInput = getByTestId('file-input');
    const file = new File(
      ['name,city,country,favoriteSport\nJohn,New York,USA,Basketball'],
      'test.csv',
      { type: 'text/csv' }
    );

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/files', {
        content: expect.any(String),
      });
      expect(onUploadMock).toHaveBeenCalledTimes(2);
      expect(onUploadMock).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.arrayContaining([
          { name: 'John', city: 'New York', country: 'USA', favoriteSport: 'Basketball' },
          { name: 'name', city: 'city', country: 'country', favoriteSport: 'favoriteSport' },
        ]),
        loading: false,
      }));
      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });
});
