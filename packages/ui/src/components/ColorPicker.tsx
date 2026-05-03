import * as React from "react";
import { cn } from "../lib/utils";

export interface ColorPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const ColorPicker = React.forwardRef<HTMLInputElement, ColorPickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn("relative h-10 w-full overflow-hidden rounded-md border border-neutral-300", className)}>
        <input
          type="color"
          className="absolute -inset-2 h-[calc(100%+16px)] w-[calc(100%+16px)] cursor-pointer border-0 bg-transparent p-0"
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";
