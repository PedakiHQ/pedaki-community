import type { PageType } from '~/app/types.ts';
import { setStaticParamsLocale } from 'next-international/server';
import { SignupForm } from './signup-form';

export default function RegisterPage({ params }: PageType) {
  setStaticParamsLocale(params.locale);

  return (
    <div className="relative flex flex-col items-center justify-center md:w-[768px]">
      <div className="w-full max-w-screen-sm px-8 py-16">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Inscription</h1>
            <p className="text-sm text-secondary">
              Créez votre compte pour accéder à l&apos;application.
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Inscription',
};
