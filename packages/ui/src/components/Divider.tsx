import React from 'react';
import { cn } from '../lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number | string;
  color?: string;
  variant?: 'solid' | 'dashed' | 'dotted';
}

export function Divider({
  orientation = 'horizontal',
  thickness = 1,
  color = '#e5e5e5',
  variant = 'solid',
  className,
  style,
  ...props
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  
  const thicknessVal = typeof thickness === 'number' ? `${thickness}px` : thickness;

  return (
    <div
      role="separator"
      className={cn(
        isHorizontal ? 'w-full' : 'h-full',
        className
      )}
      style={{
        borderTopWidth: isHorizontal ? thicknessVal : 0,
        borderLeftWidth: !isHorizontal ? thicknessVal : 0,
        borderStyle: variant,
        borderColor: color,
        ...style,
      }}
      {...props}
    />
  );
}
