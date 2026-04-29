import Link from 'next/link';
import clsx from 'clsx';
import { type ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  type?: 'button' | 'submit';
};

const classes =
  'inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60';

export const Button = ({ children, href, className, type = 'button' }: ButtonProps) => {
  if (href) {
    return (
      <Link href={href} className={clsx(classes, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={clsx(classes, className)}>
      {children}
    </button>
  );
};
