import { cn } from "../utils";
import "./Skeleton.css";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md skeleton-pulsate", className)}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
      {...props}
    />
  );
}

export { Skeleton };
