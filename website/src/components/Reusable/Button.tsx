import { ComponentProps, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

function reusableCn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "max-h-[48px] min-h-[48px] flex items-center justify-center rounded-xl border-2 px-2 text-lg font-semibold ",
  {
    variants: {
      btnType: {
        button: "button-shadow",
      },
      variant: {
        "button-secondary-pink": "button-secondary-pink",
        "button-secondary-puprle": "button-secondary-purple",
        "button-secondary-orange": "button-secondary-orange",
        "button-secondary-yellow": "button-secondary-yellow",
        "button-primary-pink": "button-primary-pink",
        "button-primary-puprle": "button-primary-purple",
        "button-primary-orange": "button-primary-orange",
        "button-primary-yellow": "button-primary-yellow",
        "popup-secondary-pink": "popup-secondary-pink",
        "popup-secondary-puprle": "popup-secondary-purple",
        "popup-secondary-orange": "popup-secondary-orange",
        "popup-secondary-yellow": "popup-secondary-yellow",
        "popup-primary-pink": "popup-primary-pink",
        "popup-primary-puprle": "popup-primary-purple",
        "popup-primary-orange": "popup-primary-orange",
        "popup-primary-yellow": "popup-primary-yellow",
        "default-pink": "button-default-pink",
        "default-purple": "button-default-purple",
        "default-orange": "button-default-orange",
        "default-yellow": "button-default-yellow",
      },
      size: {
        default: "min-w-[176px] max-w-[176px]",
        full: "w-full",
        "sm-full": "w-full md:min-w-[176px] md:max-w-[176px]",
        "sm-auto": "md:min-w-[176px] md:max-w-[176px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  btnType,
  size,
  href,
  ...props
}) => {
  if (href) {
    return (
      <Link
        href={href}
        className={reusableCn(buttonVariants({ variant, btnType, size, className }))}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={reusableCn(buttonVariants({ variant, btnType, size, className }))}
      {...props}
    >
      {children}
    </button>
  );
};
