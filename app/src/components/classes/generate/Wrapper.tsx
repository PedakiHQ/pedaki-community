import StoreProvider from '~/store/classes/generate/StoreProvider.tsx';
import React from 'react';

interface GenerateClassesRulesWrapperProps {
  children: React.ReactNode;
}

export const GenerateClassesRulesWrapper = ({ children }: GenerateClassesRulesWrapperProps) => {
  return <StoreProvider>{children}</StoreProvider>;
};
