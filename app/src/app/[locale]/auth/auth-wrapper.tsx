import React from 'react';

interface AuthWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode | React.ReactNode[];
}

const AuthWrapper = ({ title, description, children }: AuthWrapperProps) => {
  return (
    <div className="flex h-full w-full flex-col justify-center">
      <div className="mx-auto md:w-[450px]">
        <div className="mb-6 flex flex-col space-y-2">
          <h1 className="text-title-4 font-semibold">{title}</h1>
          <p className="text-p-sm text-sub">{description}</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
