import React from 'react';
import { cn } from '@/lib/utils';

export default function Avatar({
  src,
  alt = '',
  size = 36,
  className = '',
  ...props
}) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden bg-gray-200 shrink-0",
        className
      )}
      style={style}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-center"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground font-medium text-xs">
          {alt.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
}
