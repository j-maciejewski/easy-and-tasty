export type ModalAction =
  | {
      type: "publish" | "unpublish" | "delete" | "edit";
      id: number;
    }
  | { type: "add" };

export interface TableColumn<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  sortKey?: string;
  defaultHidden?: boolean;
}
