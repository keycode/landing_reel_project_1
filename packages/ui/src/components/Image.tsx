import React from 'react';
import { cn } from '../lib/utils';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export function Image({ src, alt, width, height, objectFit = 'cover', className, style, ...props }: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={cn(className)}
      style={{
        objectFit,
        width: width ? typeof width === 'number' ? `${width}px` : width : '100%',
        height: height ? typeof height === 'number' ? `${height}px` : height : 'auto',
        ...style,
      }}
      {...props}
    />
  );
}
