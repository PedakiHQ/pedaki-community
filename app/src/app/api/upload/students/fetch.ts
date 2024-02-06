import { FILE_FIELD } from './constants.ts';

export const uploadFile = async (file: File): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append(FILE_FIELD, file);
  const res = await fetch('/api/upload/students', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to upload file');
  }
  return (await res.json()) as { id: string };
};
