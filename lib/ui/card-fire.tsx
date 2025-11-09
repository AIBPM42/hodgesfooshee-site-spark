import { clsx } from "clsx";

export function Card({className, children}:{className?:string; children:React.ReactNode}){
  return (
    <div className={clsx(
      "rounded-xl2 border bg-ui-panel border-ui-border text-ui-text shadow-card",
      "dark:bg-ui-dark3 dark:border-ui-dborder dark:text-ui-dtext dark:shadow-dcard",
      className
    )}>{children}</div>
  );
}

export const CardHeader = ({children, sub}:{children:React.ReactNode; sub?:string}) => (
  <div className="px-5 pt-4 pb-2">
    <div className="font-display text-xl leading-7">{children}</div>
    {sub && <div className="text-sm text-ui-sub dark:text-ui-dsub mt-0.5">{sub}</div>}
  </div>
);

export const CardBody = ({children, className}:{children:React.ReactNode; className?:string}) => (
  <div className={clsx("px-5 pb-5", className)}>{children}</div>
);
