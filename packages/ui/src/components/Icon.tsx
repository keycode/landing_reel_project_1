import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface IconProps extends Omit<LucideIcons.LucideProps, 'name'> {
  name: string;
}

export function Icon({ name, size = 24, color = 'currentColor', ...props }: IconProps) {
  // Convert custom snake_case or dash-case to PascalCase for Lucide if necessary
  const toPascalCase = (str: string) => str.replace(/(^\w|-\w)/g, (clearAndUpper) => clearAndUpper.replace(/-/, '').toUpperCase());
  
  const IconName = toPascalCase(name);
  
  // @ts-ignore
  const LucideIcon = LucideIcons[IconName] as React.ElementType;

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return <LucideIcon size={size} color={color} {...props} />;
}
