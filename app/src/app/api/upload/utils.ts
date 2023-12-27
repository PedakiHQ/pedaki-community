interface UploadResult {
  file: File;
  fileName: string;
  extension: string;
  mimetype: string;
  size: number;
}

interface UploadOptions {
  form: FormData;
  sizeLimit: number;
  allowedMimeTypes: readonly string[];
  field: string;
}

export const getFile = ({
  form,
  sizeLimit,
  allowedMimeTypes,
  field,
}: UploadOptions): UploadResult => {
  const file = form.get(field);
  if (file === null || typeof file === 'string') {
    throw new Error(`No file uploaded with field name ${field}`);
  }

  const type = file.type;
  if (!allowedMimeTypes.includes(type)) {
    throw new Error(`File type ${type} is not allowed`);
  }

  if (file.size > sizeLimit) {
    throw new Error(`File size ${file.size} exceeds limit ${sizeLimit}`);
  }

  const extension = file.name.split('.').pop() ?? '';
  const fileName = file.name.replace(`.${extension}`, '');

  return {
    file,
    fileName: fileName,
    extension: extension,
    mimetype: file.type,
    size: file.size,
  };
};
