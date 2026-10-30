import { toast } from "sonner";

import { api } from "@/trpc/react";

type UserRole = "viewer" | "editor";

const getDisplayName = (name: string | null | undefined) => name || "User";

export const useUsersActions = () => {
  const utils = api.useUtils();

  const setUserRole = api.authorized.user.setUserRole.useMutation();
  const deleteUser = api.authorized.user.deleteUser.useMutation();

  async function handleSetUserRole(
    user: { id: string; name: string | null },
    role: UserRole,
    onSuccess?: () => void,
  ) {
    try {
      await setUserRole.mutateAsync({ id: user.id, role });
      await utils.authorized.user.getUsers.invalidate();

      toast.success(
        `${getDisplayName(user.name)} is now ${role === "editor" ? "an editor" : "a viewer"}.`,
      );
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while changing the user's role.",
      );
    }
  }

  async function handleDeleteUser(
    user: { id: string; name: string | null },
    onSuccess?: () => void,
  ) {
    try {
      await deleteUser.mutateAsync(user.id);
      await Promise.all([
        utils.authorized.user.getUsers.invalidate(),
        utils.authorized.comment.getComments.invalidate(),
        utils.authorized.recipe.getSummaryStats.invalidate(),
        utils.authorized.recipe.getRecipes.invalidate(),
        utils.authorized.article.getSummaryStats.invalidate(),
      ]);

      toast.success(`${getDisplayName(user.name)} was deleted.`);
      onSuccess?.();
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "There was an error while deleting the user.",
      );
    }
  }

  return { handleSetUserRole, handleDeleteUser };
};
