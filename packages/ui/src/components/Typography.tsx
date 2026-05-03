"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  dynamicValue?: string;
}

export function Typography({
  variant = 'p',
  color,
  align = 'left',
  dynamicValue,
  children,
  className,
  style,
  ...props
}: TypographyProps) {
  const [text, setText] = useState<React.ReactNode>(children);

  useEffect(() => {
    if (dynamicValue && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramValue = urlParams.get(dynamicValue);
      if (paramValue) {
        setText(paramValue);
      } else {
        setText(children);
      }
    } else {
      setText(children);
    }
  }, [dynamicValue, children]);

  const Component = variant;

  const baseStyles = {
    h1: 'text-4xl md:text-5xl font-extrabold font-heading tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold font-heading tracking-tight',
    h3: 'text-2xl md:text-3xl font-bold font-heading tracking-tight',
    h4: 'text-xl md:text-2xl font-bold font-heading tracking-tight',
    h5: 'text-lg md:text-xl font-bold font-heading tracking-tight',
    h6: 'text-base md:text-lg font-bold font-heading tracking-tight',
    p: 'text-base leading-relaxed',
    span: '',
  };

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return (
    <Component
      className={cn(baseStyles[variant], alignStyles[align], className)}
      style={{ color: color, ...style }}
      {...props}
    >
      {text}
    </Component>
  );
}
