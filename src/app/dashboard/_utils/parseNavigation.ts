type Navigation = {
  label: string;
  href?: string;
  sublinks: {
    label: string;
    href: string;
  }[];
}[];

export function parseNavigation(navigation: Navigation) {
  return navigation.map((item, itemIdx) => ({
    id: `${itemIdx}`,
    label: item.label,
    href: item.href,
    ...(item.sublinks && item.sublinks.length > 0
      ? {
          children: item.sublinks.map((sublink, sublinkIdx) => ({
            id: `${itemIdx}-${sublinkIdx}`,
            label: sublink.label,
            href: sublink.href,
            canRootHaveChildren: false,
          })),
        }
      : {}),
  }));
}
