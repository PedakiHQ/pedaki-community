import { Avatar, AvatarFallback, AvatarImage } from '@pedaki/design/ui/avatar';
import type { IconType } from '@pedaki/design/ui/icons';
import { Separator } from '@pedaki/design/ui/separator';
import { Skeleton } from '@pedaki/design/ui/skeleton';
import React from 'react';

export type PageHeaderProps = {
  title: string | React.ReactNode;
  description: string;
  children?: React.ReactNode; // Right section
  divider?: boolean;

  image?: string;
  icon?: IconType;
  alt?: string;
} & ({ image: string; alt: string } | { icon: IconType } | {});

const PageHeader = ({
  title,
  description,
  children,
  icon: Icon,
  image,
  alt,
  divider = true,
}: PageHeaderProps) => {
  return (
    <>
      <header className="flex h-14 justify-between pb-3">
        <div className="flex items-center gap-4">
          {image != undefined && (
            <Avatar className="flex size-12 items-center justify-center object-cover">
              <AvatarImage src={image} alt={alt} className="size-12" />
              <AvatarFallback>
                <Skeleton className="size-12 bg-neutral-300">&nbsp;</Skeleton>
              </AvatarFallback>
            </Avatar>
          )}
          {Icon && (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full border bg-weak p-3.5 text-sub">
              <Icon className="size-5" />
            </div>
          )}
          <div>
            <h1 className="text-label-lg font-medium text-main">{title}</h1>
            <p className="text-p-sm text-sub">{description}</p>
          </div>
        </div>

        {children && <div className="flex items-center gap-4">{children}</div>}
      </header>
      {divider && <Separator />}
    </>
  );
};

export default PageHeader;
