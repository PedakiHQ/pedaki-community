import { LOGO_FIELD } from '~/app/api/upload/logo/constants.ts';

export const updateLogo = async (file: File) => {
  console.log('updateLogo', file);
  const formData = new FormData();
  formData.append(LOGO_FIELD, file);
  const res = await fetch('/api/upload/logo', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Failed to upload logo');
  }
  return await res.json();
};
