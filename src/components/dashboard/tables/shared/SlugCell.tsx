interface SlugCellProps {
  slug: string;
}

export const SlugCell = ({ slug }: SlugCellProps) => {
  return <span className="text-muted-foreground">{slug}</span>;
};
