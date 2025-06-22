"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { api } from "@/trpc/react";

import { NavigationItemForm, SortableNavigation } from "../../_components";
import { parseNavigation } from "../../_utils/parseNavigation";

export const NavigationContent = () => {
  const { data: savedNavigation, isLoading } =
    api.authorized.navigation.getNavigation.useQuery();
  const updateNavigation =
    api.authorized.navigation.updateNavigation.useMutation();

  const parsedSavedNavigation = useMemo(
    () => parseNavigation(savedNavigation ?? []),
    [savedNavigation],
  );

  const [navigation, setNavigation] = useState<NavigationItem[]>(
    parsedSavedNavigation,
  );

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<NavigationItem | null>(null);

  const [navigationChanged, setNavigationChanged] = useState(false);

  async function handleSubmit() {
    try {
      const navigationWithoutIds = navigation.map((item) => {
        const { label, href, children } = item;
        const parsedChildren = children?.map(
          ({ label: _label, href: _href }) => ({ label: _label, href: _href }),
        );

        return {
          label,
          href,
          sublinks: parsedChildren,
        };
      });
      await updateNavigation.mutateAsync(navigationWithoutIds);

      toast.success("Navigation was updated.");
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while updating navigation.",
      );
    }
  }

  useEffect(() => {
    if (JSON.stringify(parsedSavedNavigation) !== JSON.stringify(navigation)) {
      setNavigationChanged(true);
    } else {
      setNavigationChanged(false);
    }
  }, [navigation, parsedSavedNavigation]);

  useEffect(() => {
    setNavigation(parsedSavedNavigation);
  }, [parsedSavedNavigation]);

  if (isLoading) return "Loading...";

  const handleAdd = () => {
    setEditingItem(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (item: NavigationItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const onDelete = (itemId: string) => {
    setNavigation((prev) => {
      const filteredNavigation = prev.reduce<NavigationItem[]>((acc, curr) => {
        if (curr.id === itemId) {
          return acc;
        }

        if (curr.children) {
          const filteredChildren = curr.children.filter(
            (child) => child.id !== itemId,
          );
          if (filteredChildren.length !== curr.children.length) {
            return acc.concat({ ...curr, children: filteredChildren });
          }
        }
        return acc.concat(curr);
      }, []);

      return filteredNavigation;
    });
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="h-fit font-semibold text-xl">Header</h2>
        <Button
          className="relative aspect-square p-1"
          variant="ghost"
          size="icon"
          onClick={handleAdd}
        >
          <Plus className="absolute size-5 stroke-2 text-foreground" />
        </Button>
      </div>
      {navigation.length ? (
        <SortableNavigation
          navigation={navigation}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setNavigation={setNavigation}
        />
      ) : (
        <p className="text-muted-foreground text-sm italic">
          Navigation not configured
        </p>
      )}
      <Button
        className="mt-4 ml-auto"
        size="sm"
        disabled={!navigationChanged}
        onClick={handleSubmit}
      >
        Save
      </Button>
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogTrigger asChild>Add new navigation item</DialogTrigger>
        <DialogContent className="max-h-[calc(100%_-_4rem)] overflow-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit navigation item" : "Add navigation item"}
            </DialogTitle>
          </DialogHeader>
          <NavigationItemForm
            data={editingItem!}
            onSubmit={(values) => {
              setNavigation((prev) => {
                if (editingItem) {
                  return prev.map((item) => {
                    if (item.id === editingItem?.id) {
                      return { ...item, ...values };
                    }

                    if (item.children) {
                      item.children = item.children.map((child) => {
                        if (child.id === editingItem?.id) {
                          return { ...child, ...values };
                        }
                        return child;
                      });
                    }

                    return item;
                  });
                }

                return prev.concat({ id: crypto.randomUUID(), ...values });
              });
              setEditDialogOpen(false);
            }}
          />
          <DialogClose />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingItem?.label}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => onDelete(deletingItem?.id!)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
