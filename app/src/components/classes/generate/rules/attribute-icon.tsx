import { ATTRIBUTES_COLORS } from '~/components/classes/generate/rules/constants.ts';
import React from 'react';

export const AttributeIcon = ({ index }: { index: number }) => {
  return (
    <div
      className="inline-flex h-6 w-6 items-center justify-center rounded-full"
      style={{ backgroundColor: ATTRIBUTES_COLORS[index] }}
    >
      <span className="text-sub-sm font-medium">{String.fromCharCode(65 + index)}</span>
    </div>
  );
};

export default AttributeIcon;
