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
    <div className="bg-background rounded-lg border p-4">
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
            className="[&>div]:border-border! text-sm [&>div]:my-1 [&>div]:rounded-lg [&>div]:p-2"
          >
            <div
              className="text-foreground flex w-full items-center text-sm"
              ref={ref}
            >
              <GripVertical className="mr-1 h-4" />
              <span>{props.item.label}</span>
              {props.item.href && (
                <span className="text-foreground/50 ml-2">
                  {props.item.href}
                </span>
              )}
              <div className="ml-auto flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleEdit(props.item)}
                  aria-label={`Edit navigation item ${props.item.label}`}
                >
                  <Pencil className="text-foreground/75 size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleDelete(props.item)}
                  aria-label={`Delete navigation item ${props.item.label}`}
                >
                  <Trash2 className="text-foreground/75 size-4" />
                </Button>
              </div>
            </div>
          </SimpleTreeItemWrapper>
        ))}
      />
    </div>
  );
};
