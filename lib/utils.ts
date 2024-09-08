import { type ClassValue, clsx } from "clsx";
import { formatDistanceStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithDateFns(date: string) {
  return formatDistanceStrict(new Date(date), new Date(), {
    addSuffix: true,
  });
}
