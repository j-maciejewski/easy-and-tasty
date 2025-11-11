"use client";

import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
} from "dnd-kit-sortable-tree";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { forwardRef } from "react";

import { Button } from "@/components/ui";

export const SortableNavigation = ({
  navigation,
  handleEdit,
  handleDelete,
  setNavigation,
}: {
  navigation: NavigationItem[];
  setNavigation: (navigation: NavigationItem[]) => void;
  handleEdit: (item: Omit<NavigationItem, "children">) => void;
  handleDelete: (item: Omit<NavigationItem, "children">) => void;
}) => {
  return (
    <div className="rounded-lg border bg-background p-4">
      <SortableTree
        items={navigation}
        onItemsChanged={(items) => setNavigation(items)}
        dropAnimation={null}
        TreeItemComponent={forwardRef<
          HTMLDivElement,
          TreeItemComponentProps<NavigationItem>
        >((props, ref) => (
          <SimpleTreeItemWrapper
            {...props}
            ref={ref}
            showDragHandle={false}
            disableCollapseOnItemClick={true}
            hideCollapseButton={true}
            className="text-sm [&>div]:my-1 [&>div]:rounded-lg [&>div]:border-border! [&>div]:p-2"
          >
            <div
              className="flex w-full items-center text-foreground text-sm"
              ref={ref}
            >
              <GripVertical className="mr-1 h-4" />
              <span>{props.item.label}</span>
              {props.item.href && (
                <span className="ml-2 text-foreground/50">
                  {props.item.href}
                </span>
              )}
              <div className="ml-auto flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleEdit(props.item)}
                >
                  <Pencil className="size-4 text-foreground/75" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleDelete(props.item)}
                >
                  <Trash2 className="size-4 text-foreground/75" />
                </Button>
              </div>
            </div>
          </SimpleTreeItemWrapper>
        ))}
      />
    </div>
  );
};
