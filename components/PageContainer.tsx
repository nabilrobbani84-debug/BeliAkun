import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export function PageContainer({
  children,
  className = '',
  size = 'default',
}: PageContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-[1600px]',
    wide: 'max-w-[1800px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={`w-full mx-auto px-4 sm:px-5 md:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
    >
      {children}
    </div>
  );
}

interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  compact?: boolean;
}

export function SectionContainer({
  children,
  id,
  className = '',
  compact = false,
}: SectionContainerProps) {
  return (
    <section
      id={id}
      className={`w-full ${
        compact
          ? 'py-6 sm:py-8 md:py-10 lg:py-12'
          : 'py-8 sm:py-10 md:py-14 lg:py-18 xl:py-20'
      } ${className}`}
    >
      {children}
    </section>
  );
}
