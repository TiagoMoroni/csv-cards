import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import FileUploader from '../components/FileUploader';

describe('FileUploader', () => {
  test('triggers file upload callback on selecting a file', () => {
    const onUploadMock = jest.fn();
    const { getByTestId } = render(<FileUploader onUpload={onUploadMock} />);
    const fileInput = getByTestId('file-input');

    const file = new File(['dummy content'], 'dummy.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(onUploadMock).toHaveBeenCalledWith('dummy content');
  });
});