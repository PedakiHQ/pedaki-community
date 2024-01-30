import { FILE_FIELD } from './constants.ts';

export const importFile = async (file: File) => {
  const formData = new FormData();
  formData.append(FILE_FIELD, file);
  const res = await fetch('/api/upload/imports', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to upload file');
  }
  await res.json();
};
