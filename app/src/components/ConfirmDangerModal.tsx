import { Button } from '@pedaki/design/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@pedaki/design/ui/dialog';
import { IconSpinner } from '@pedaki/design/ui/icons';
import { Input } from '@pedaki/design/ui/input';
import React from 'react';
import { cn } from '@pedaki/design/utils/cn';

interface ConfirmDangerModalProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
}

const PASSWORD = 'DELETE';

const ConfirmDangerModal = ({
  trigger,
  children,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
}: ConfirmDangerModalProps) => {
  const [isOpen, _setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [isTransitionLoading, startTransition] = React.useTransition();

  const isValid = value === PASSWORD;

  const setIsOpen = (value: boolean) => {
    _setIsOpen(value);
    if (value) {
      setValue('');
    }
  };

  const confirm = () => {
    if (isValid) {
      startTransition(() => {
        onConfirm();
        setIsOpen(false);
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex text-label-sm text-soft">{children}</div>

        <Input
          type="text"
          placeholder="Type DELETE to confirm"
          onChange={e => setValue(e.target.value)}
          value={value}
        />

        <DialogFooter>
          <Button variant="stroke-primary-main" onClick={() => setIsOpen(false)}>
            {cancelText}
          </Button>

          <Button variant="filled-error" disabled={!isValid} onClick={confirm}>
            <div className={cn('pr-2', !isTransitionLoading && 'hidden')}>
              <IconSpinner className="h-5 w-5 animate-spin text-primary-base" />
            </div>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDangerModal;
