import { cn } from '@pedaki/design/utils';
import React from 'react';

type SettingRowProps = {
  title: string;
  description: string;
  children: React.ReactNode; // Right section
} & React.HTMLAttributes<HTMLDivElement>;

const SettingRow = ({ title, description, children, className, ...props }: SettingRowProps) => {
  return (
    <section
      className={cn('grid max-w-screen-xl grid-cols-12 gap-4 @xl:gap-8', className)}
      {...props}
    >
      <div className="col-span-12 @xl:col-span-5">
        <h2 className="text-label-sm font-medium text-main">{title}</h2>
        <p className="text-p-xs text-sub">{description}</p>
      </div>
      <div className="col-span-12 @xl:col-span-7">{children}</div>
    </section>
  );
};

export default SettingRow;
