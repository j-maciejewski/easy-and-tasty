interface DateCellProps {
  date: string | Date | null | undefined;
}

export const DateCell = ({ date }: DateCellProps) => {
  return date ? new Date(date).toLocaleString() : null;
};
