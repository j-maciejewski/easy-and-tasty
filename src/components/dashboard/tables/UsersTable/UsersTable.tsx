"use client";

import { use, useEffect } from "react";

import { DataTable, ErrorCatcher } from "@/components/dashboard";
import { Badge } from "@/components/ui";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import { useColumnsToggler, useDebouncedSearchQuery } from "@/utils";

import {
  ActiveFilter,
  ColumnsToggler,
  DateCell,
  SearchBar,
  TableColumn,
  TableToolbar,
} from "../shared";

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
  ];

  const { hiddenColumns, toggleColumn } = useColumnsToggler(
    columns
      .filter(({ defaultHidden }) => defaultHidden)
      .map(({ label }) => label),
  );

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
        />
      </div>
    </ErrorCatcher>
  );
};
