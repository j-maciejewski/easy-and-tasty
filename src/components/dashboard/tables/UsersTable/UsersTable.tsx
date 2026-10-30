"use client";

import { use, useEffect } from "react";

import {
  DataTable,
  ErrorCatcher,
  GenericConfirmModal,
} from "@/components/dashboard";
import { Badge } from "@/components/ui";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import {
  useColumnsToggler,
  useDebouncedSearchQuery,
  useModalAction,
  useUsersActions,
} from "@/utils";

import {
  ActiveFilter,
  ColumnsToggler,
  DateCell,
  SearchBar,
  TableColumn,
  TableDropdownActions,
  TableToolbar,
} from "../shared";

type UserModalAction = {
  type: "role" | "delete";
  user: { id: string; name: string | null; role: "viewer" | "editor" };
};

export const UsersTable = () => {
  const { pagination, sort, handleChangePage, setTotalItemsCount } =
    use(PaginationContext)!;
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery(() => handleChangePage(1));

  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = api.authorized.user.getUsers.useQuery({
    query: debouncedQuery,
    orderBy: sort.key ?? "createdAt",
    orderDir: sort.key ? sort.order : "desc",
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  });

  const { data: currentUser } = api.authorized.user.getCurrentUser.useQuery();
  const { action, setAction, clearAction } = useModalAction<UserModalAction>();
  const { handleSetUserRole, handleDeleteUser } = useUsersActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!users?.pagination) return;

    setTotalItemsCount(users.pagination.hitsCount);
  }, [users]);

  type UserItem = NonNullable<typeof users>["results"][number];

  const columns: TableColumn<UserItem>[] = [
    {
      label: "Name",
      sortKey: "name",
      render: ({ name }) =>
        name ?? <span className="text-muted-foreground">-</span>,
    },
    {
      label: "Email",
      sortKey: "email",
      render: ({ email }) => email,
    },
    {
      label: "Role",
      sortKey: "role",
      render: ({ role }) => (
        <Badge variant={role === "editor" ? "default" : "secondary"}>
          {role}
        </Badge>
      ),
    },
    {
      label: "Email verified",
      sortKey: "emailVerified",
      render: ({ emailVerified }) => <DateCell date={emailVerified} />,
      defaultHidden: true,
    },
    {
      label: "Created at",
      sortKey: "createdAt",
      render: ({ createdAt }) => <DateCell date={createdAt} />,
    },
    {
      label: "Updated at",
      sortKey: "updatedAt",
      render: ({ updatedAt }) => <DateCell date={updatedAt} />,
      defaultHidden: true,
    },
    {
      label: "Actions",
      render: ({ id, name, role }) =>
        !currentUser || id === currentUser.id ? null : (
          <TableDropdownActions
            actions={[
              {
                label: role === "editor" ? "Make viewer" : "Make editor",
                onClick: () =>
                  setAction({ type: "role", user: { id, name, role } }),
              },
              {
                label: "Delete user",
                onClick: () =>
                  setAction({ type: "delete", user: { id, name, role } }),
                variant: "destructive",
              },
            ]}
          />
        ),
    },
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler(
    columns
      .filter(({ defaultHidden }) => defaultHidden)
      .map(({ label }) => label),
  );

  const actionUserName = action?.user.name || "this user";

  return (
    <ErrorCatcher errors={[usersError] as (Error | null)[]}>
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search users..."
              value={query}
              onChange={setQuery}
            />
          }
          actions={
            <ColumnsToggler
              columnNames={columns.map(({ label }) => label)}
              hiddenColumns={hiddenColumns}
              toggleColumn={toggleColumn}
            />
          }
        />
        <div className="mb-6 empty:hidden">
          {debouncedQuery && (
            <ActiveFilter
              content={<>Query: {debouncedQuery}</>}
              onClear={clearQuery}
            />
          )}
        </div>

        <DataTable
          isLoading={usersLoading}
          hiddenColumns={hiddenColumns}
          columns={columns}
          data={users?.results ?? []}
          getRowKey={({ id }) => id}
        />

        <GenericConfirmModal
          open={action?.type === "role"}
          title={
            action?.user.role === "editor"
              ? `Make ${actionUserName} a viewer?`
              : `Make ${actionUserName} an editor?`
          }
          description={
            action?.user.role === "editor"
              ? "They will lose access to the dashboard."
              : "They will get full access to the dashboard, including managing content and users."
          }
          handleClose={clearAction}
          handleConfirm={async () => {
            if (action?.type !== "role") return;
            await handleSetUserRole(
              action.user,
              action.user.role === "editor" ? "viewer" : "editor",
            );
            clearAction();
          }}
        />

        <GenericConfirmModal
          open={action?.type === "delete"}
          title={`Delete ${actionUserName}?`}
          description="The account will be permanently deleted, along with all of its comments, ratings and bookmarks. This action cannot be undone."
          confirmText="Delete"
          confirmVariant="destructive"
          handleClose={clearAction}
          handleConfirm={async () => {
            if (action?.type !== "delete") return;
            await handleDeleteUser(action.user);
            clearAction();
          }}
        />
      </div>
    </ErrorCatcher>
  );
};
