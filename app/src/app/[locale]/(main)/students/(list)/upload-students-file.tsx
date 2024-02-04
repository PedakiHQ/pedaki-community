import { zodResolver } from '@hookform/resolvers/zod';
import wait from '@pedaki/common/utils/wait';
import { wrapWithLoading } from '@pedaki/common/utils/wrap-with-loading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@pedaki/design/ui/accordion';
import { Button } from '@pedaki/design/ui/button';
import { Card } from '@pedaki/design/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pedaki/design/ui/dialog';
import Dropzone from '@pedaki/design/ui/dropzone';
import { Form, FormField, FormMessage } from '@pedaki/design/ui/form';
import { IconDownload, IconSpinner, IconX } from '@pedaki/design/ui/icons';
import IconCheck from '@pedaki/design/ui/icons/IconCheck';
import { Separator } from '@pedaki/design/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@pedaki/design/ui/tooltip';
import {
  FILE_MAX_SIZE,
  FILE_MAX_SIZE_MB,
  FILE_TYPES,
} from '~/app/api/upload/students/constants.ts';
import { uploadFile } from '~/app/api/upload/students/fetch.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { customErrorParams } from '~/locales/zod.ts';
import { api } from '~/server/clients/client.ts';
import { formatBytes } from '~/utils.ts';
import type { OutputType } from '~api/router/router.ts';
import Link from 'next/link';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  logo: z
    .custom<File>()
    .refine(file => file instanceof File, { params: customErrorParams('file.mustBeCsv') })
    .refine(file => FILE_TYPES.includes(file.type), {
      params: customErrorParams('file.mustBeCsv'),
    })
    .refine(file => file.size < FILE_MAX_SIZE, {
      params: customErrorParams('file.size', { size: FILE_MAX_SIZE_MB * 100 + ' Ko' }),
    })
    .optional(),
});
type FormValues = z.infer<typeof FormSchema>;

const UploadStudentsFile = () => {
  const t = useScopedI18n('students.list');
  const [open, setOpen] = React.useState(false);
  const [importId, setImportId] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {},
  });

  const onSubmit = (values: FormValues) => {
    if (!values.logo) return;
    return wrapWithLoading(() => wait(uploadFile(values.logo!), 500), {
      errorProps: _error => {
        return {
          title: t('upload.submit.error.title'),
          description: t('upload.submit.error.description'),
        };
      },
      throwOnError: true,
    })
      .then(({ id }) => {
        setImportId(id);
      })
      .catch(() => {
        setImportId(null);
      });
  };

  const { data } = api.students.imports.status.useQuery(
    {
      id: importId!,
    },
    {
      enabled: importId !== null,
      refetchOnWindowFocus: false,
      refetchInterval: res => {
        if (res?.status === 'DONE' || res?.status === 'ERROR') return false;
        return 200;
      },
    },
  );

  const isDisabled = !data || data.status !== 'DONE';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="stroke-primary-main" className="text-sub">
          <IconDownload className="h-4 w-4" />
          <span className="hidden @2xl/main:inline">{t('headerActions.import.label')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[80%] overflow-hidden sm:max-w-screen-sm"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-label-md text-main">Upload files</DialogTitle>
          <DialogDescription className="text-p-sm text-sub">dd</DialogDescription>
        </DialogHeader>
        <OldUploadStudentsFile />
        <div className="pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="logo"
                render={({ field: { onChange } }) => (
                  <Dropzone
                    accept={FILE_TYPES.join(',')}
                    handleOnDrop={async files => {
                      const file = files?.[0];
                      if (!file) return;
                      onChange(file);
                      await form.handleSubmit(onSubmit)();
                    }}
                    className="flex flex-col items-center gap-5 p-8"
                  >
                    <IconDownload className="h-6 w-6" />
                    <div className="flex flex-col items-center">
                      <p className="text-lg font-medium text-main">Drag and drop your file here</p>
                      <FormMessage />
                    </div>
                    <div>
                      <Button variant="stroke-primary-main" className="w-full">
                        Browse files
                      </Button>
                    </div>
                  </Dropzone>
                )}
              />
            </form>
          </Form>
        </div>
        <FileCard form={form} response={data} />
        <Separator className="scale-x-110" />
        <div className="flex gap-2">
          <Button variant="stroke-primary-main" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="filled-primary"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={isDisabled}
            asChild
          >
            <Link href={`/students/import/${importId}`} data-disabled={isDisabled}>
              Continue
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FileCard = ({
  form,
  response,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  response: OutputType['students']['imports']['status'] | undefined;
}) => {
  const file = form.watch('logo');
  if (!file) return null;

  const format = response?.data?.family;
  const status = response?.status;

  return (
    <Card className="flex flex-row items-center justify-between">
      <div>
        <p className="text-label-sm font-medium text-main">{file.name}</p>
        <div className="pt-1 text-p-xs text-sub">
          <span>{formatBytes(file.size)} ∙&nbsp;</span>
          {format != undefined && <span>{format} ∙&nbsp;</span>}
          <FileCardStatusIcon status={status} />
          &nbsp;
          <FileCardStatusLabel response={response} />
        </div>
      </div>
      <Button size="icon" variant="ghost-sub" onClick={() => form.setValue('logo', undefined)}>
        <IconX className="h-4 w-4" />
      </Button>
    </Card>
  );
};

const FileCardStatusIcon = ({
  status,
}: {
  status: OutputType['students']['imports']['status']['status'] | undefined;
}) => {
  if (status === undefined || status == 'PENDING' || status == 'PROCESSING')
    return <IconSpinner className="inline h-4 w-4 animate-spin text-primary-base" />;
  if (status === 'ERROR') return <IconX className="inline h-4 w-4 text-state-error" />;
  if (status === 'DONE') return <IconCheck className="inline h-4 w-4 text-state-success" />;
};

const FileCardStatusLabel = ({
  response,
}: {
  response: OutputType['students']['imports']['status'] | undefined;
}) => {
  const t = useScopedI18n('students.list.upload.status');

  const status = response?.status;

  if (status === undefined || status == 'PENDING' || status == 'PROCESSING')
    return <span>Uploading...</span>;
  if (status === 'ERROR') {
    const errorCode = response?.data?.message;
    const translated = t(errorCode as any);
    return (
      <span className="text-state-error">
        {translated === errorCode ? t('default') : translated}
      </span>
    );
  }
  if (status === 'DONE') {
    const inserted = response?.data?.students?.insertedCount;
    const translated = t('inserted', {
      count: inserted,
    });
    return <span className="text-green-dark">{translated}</span>;
  }
};

const OldUploadStudentsFile = () => {
  const t = useScopedI18n('students.list.upload.oldImport');
  const { data } = api.students.imports.getMany.useQuery();

  const utils = api.useContext();
  const deleteOneMutation = api.students.imports.deleteOne.useMutation({
    onMutate: (id: string) => {
      utils.students.imports.getMany.setData(undefined, old => {
        if (!old) return;
        return old.filter(i => i.id !== id);
      });
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="old">
        <AccordionTrigger className="text-label-sm">{t('label')}</AccordionTrigger>
        <AccordionContent>
          <TooltipProvider>
            <ul className="max-h-60 space-y-2 overflow-auto">
              {data?.map(({ id, data, name, status, createdAt }) => {
                const response = { status, data, createdAt };
                return (
                  <li key={id}>
                    <Card className="flex flex-row items-center justify-between">
                      <div>
                        <p className="text-label-sm font-medium text-main">{name}</p>
                        <div className="pt-1 text-p-xs text-sub">
                          <FileCardStatusIcon status={status} />
                          &nbsp;
                          <FileCardStatusLabel response={response} />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" variant="ghost-sub" asChild>
                          <Link href={`/students/import/${id}`}>Ouvrir</Link>
                        </Button>
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              size="icon"
                              variant="ghost-error"
                              onClick={() => deleteOneMutation.mutate(id)}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Supprimer</TooltipContent>
                        </Tooltip>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default UploadStudentsFile;
