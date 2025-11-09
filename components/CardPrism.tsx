import { ReactNode } from "react";

export function CardPrism({
  children,
  className = "",
  prism = false
}: {
  children: ReactNode;
  className?: string;
  prism?: boolean;
}) {
  return (
    <div className={(prism ? "card-prism" : "card-glass") + " " + className}>
      {children}
    </div>
  );
}
