import { Switch } from "@/components/ui";
import { api } from "@/trpc/react";
import { Session } from "next-auth";
import { toast } from "sonner";

export const AccountContent = () => {
  const {
    data: user,
    isLoading,
    refetch,
  } = api.authorized.user.getCurrentUser.useQuery();

  const updateUserPreferences =
    api.authorized.user.updateUserPreferences.useMutation();

  if (isLoading) return "Loading...";

  if (!user) return "User not found.";

  const preferences = user.preferences
    ? (JSON.parse(user.preferences) ?? {})
    : {};

  const handleUpdateUserPreferences = async (
    newPreferences: Partial<
      NonNullable<Session["user"]["preferences"]>["dashboard"]
    >,
  ) => {
    await updateUserPreferences.mutateAsync({
      ...(preferences?.dashboard ?? {}),
      ...newPreferences,
    });

    toast.success("Preferences updated.");

    refetch();
  };

  return (
    <div>
      <h2 className="mb-4 font-semibold text-xl">Personalization</h2>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h6 className="font-semibold text-base">Form modals</h6>
          <p className="text-muted-foreground text-sm">
            If you prefer to have your forms displayed as modals instead of new
            pages.
          </p>
        </div>
        <Switch
          checked={preferences?.dashboard?.formsInModals ?? true}
          onCheckedChange={(newValue) =>
            handleUpdateUserPreferences({ formsInModals: newValue })
          }
        />
      </div>
    </div>
  );
};
