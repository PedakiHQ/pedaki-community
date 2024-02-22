// @ts-nocheck
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@pedaki/design/ui/dropdown-menu';
import { cn } from '@pedaki/design/utils';
import type { ParamScope, TranslationGroup } from '~/locales/client.ts';
import { useScopedI18n } from '~/locales/client.ts';
import { isActive } from '~/utils.ts';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

interface NavigationItem<TKey extends TranslationGroup> {
  labelKey: ParamScope<TKey>;
  href: string;
  segment: string | null;
  id?: string;
}

interface Navigation<TKey extends TranslationGroup> {
  items: Readonly<NavigationItem<TKey>[]>;
  tKey: TKey;
  id: string;
}

const MobileNavigation = <TKey extends TranslationGroup>({
  items,
  tKey,
}: Omit<Navigation<TKey>, 'id'>) => {
  const selectedSegment = useSelectedLayoutSegment();
  const currentItem = items.find(item => isActive(selectedSegment, item.segment));
  const t = useScopedI18n(tKey);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="block py-3 @sm:hidden">
        <div>
          <span className="text-p-sm font-medium text-sub">
            {t(currentItem?.labelKey ?? 'default')}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom">
        {items.map(item => {
          const active = isActive(selectedSegment, item.segment);
          return (
            <DropdownMenuItem key={item.href} disabled={active} asChild className="w-full">
              <Link href={item.href}>{t(item.labelKey)}</Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const DesktopNavigation = <TKey extends TranslationGroup>({
  items,
  tKey,
}: {
  items: NavigationItem<TKey>[];
  tKey: Pick<Navigation<TKey>, 'tKey'>;
}) => {
  return (
    <>
      {items.map(item => (
        <Item {...item} key={item.href} tKey={tKey} />
      ))}
    </>
  );
};

const Item = <TKey extends TranslationGroup>({
  labelKey,
  href,
  segment,
  id,
  tKey,
}: NavigationItem<TKey> & Pick<Navigation<TKey>, 'tKey'>) => {
  const selectedSegment = useSelectedLayoutSegment();
  const active = isActive(selectedSegment, segment);
  const t = useScopedI18n(tKey);

  return (
    <Link className="group relative hidden py-3 @sm:block" href={href} id={id}>
      <span
        className={cn(
          'text-p-sm font-medium text-sub ',
          active ? 'text-main' : 'group-hover:text-main',
        )}
      >
        {t(labelKey)}
      </span>
      {active && (
        <div className="absolute inset-x-0 -bottom-[0.065rem] h-0.5 bg-primary-base"></div>
      )}
    </Link>
  );
};

export const Navigation = <TKey extends TranslationGroup>({
  items,
  tKey,
  id,
}: Navigation<TKey>) => {
  return (
    <nav className="flex items-center gap-6 border-b" id={id}>
      <MobileNavigation items={items} tKey={tKey} />
      <DesktopNavigation items={items} tKey={tKey} />
    </nav>
  );
};
