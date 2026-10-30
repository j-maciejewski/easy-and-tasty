"use client";

import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { use, useEffect } from "react";

import {
  DataTable,
  ErrorCatcher,
  GenericConfirmModal,
} from "@/components/dashboard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { Path } from "@/config";
import { PaginationContext } from "@/context";
import { api } from "@/trpc/react";
import {
  type CommentType,
  useColumnsToggler,
  useCommentsActions,
  useCommentTypeFilter,
  useDebouncedSearchQuery,
  useModalAction,
} from "@/utils";

import {
  ActiveFilter,
  ColumnsToggler,
  DateCell,
  getTableEmptyState,
  SearchBar,
  TableColumn,
  TableDropdownActions,
  TableToolbar,
} from "../shared";

type CommentModalAction =
  | { type: "delete"; id: number }
  | { type: "deleteByUser"; userId: string; userName: string | null };

const getCommentTargetPath = (type: CommentType, slug: string) =>
  type === "recipe" ? `${Path.RECIPE}/${slug}` : `/${slug}`;

export const CommentsTable = () => {
  const { pagination, sort, setTotalItemsCount } = use(PaginationContext)!;
  const { query, setQuery, debouncedQuery, clearQuery } =
    useDebouncedSearchQuery();
  const { type, setType } = useCommentTypeFilter();

  const { action, setAction, clearAction } =
    useModalAction<CommentModalAction>();

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = api.authorized.comment.getComments.useQuery({
    type,
    query: debouncedQuery,
    orderBy: sort.key ?? "createdAt",
    orderDir: sort.key ? sort.order : "desc",
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
  });

  const { handleDeleteComment, handleDeleteCommentsByUser } =
    useCommentsActions();

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    if (!comments?.pagination) return;

    setTotalItemsCount(comments.pagination.hitsCount);
  }, [comments]);

  type CommentItem = NonNullable<typeof comments>["results"][number];

  const columns: TableColumn<CommentItem>[] = [
    {
      label: "Comment",
      sortKey: "text",
      render: ({ text }) => (
        <p className="line-clamp-2 max-w-md whitespace-normal">{text}</p>
      ),
    },
    {
      label: "On",
      sortKey: "target",
      render: ({ target }) => (
        <Link
          href={getCommentTargetPath(type, target.slug)}
          target="_blank"
          rel="noopener"
          className="hover:text-primary line-clamp-2 max-w-xs whitespace-normal underline-offset-4 hover:underline"
        >
          {target.title}
        </Link>
      ),
    },
    {
      label: "Author",
      sortKey: "author",
      render: ({ user }) =>
        user.name ?? <span className="text-muted-foreground">-</span>,
    },
    {
      label: "Likes",
      sortKey: "likes",
      align: "right",
      render: ({ likes }) => likes,
    },
    {
      label: "Posted",
      sortKey: "createdAt",
      render: ({ createdAt }) => <DateCell date={createdAt} />,
    },
    {
      label: "Actions",
      render: ({ id, target, user }) => (
        <TableDropdownActions
          actions={[
            {
              label: "View on site",
              onClick: () =>
                window.open(
                  getCommentTargetPath(type, target.slug),
                  "_blank",
                  "noopener",
                ),
            },
            {
              label: "Delete comment",
              onClick: () => setAction({ type: "delete", id }),
              variant: "destructive",
            },
            {
              label: "Delete all comments by this user",
              onClick: () =>
                setAction({
                  type: "deleteByUser",
                  userId: user.id,
                  userName: user.name,
                }),
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
    "comments",
  );

  const typeLabel = type === "recipe" ? "recipe" : "article";

  return (
    <ErrorCatcher errors={[commentsError] as (Error | null)[]}>
      <div>
        <TableToolbar
          search={
            <SearchBar
              placeholder="Search comments..."
              value={query}
              onChange={setQuery}
            />
          }
          filters={
            <Tabs
              value={type}
              onValueChange={(value) => setType(value as CommentType)}
            >
              <TabsList aria-label="Comment type">
                <TabsTrigger value="recipe">Recipes</TabsTrigger>
                <TabsTrigger value="article">Articles</TabsTrigger>
              </TabsList>
            </Tabs>
          }
          actions={
            <ColumnsToggler
              columnNames={columns.map(({ label }) => label)}
              hiddenColumns={hiddenColumns}
              toggleColumn={toggleColumn}
            />
          }
        />
        <div className="mb-6 flex flex-wrap gap-2 empty:hidden">
          {debouncedQuery && (
            <ActiveFilter
              content={<>Query: {debouncedQuery}</>}
              onClear={clearQuery}
            />
          )}
        </div>

        <DataTable
          isLoading={commentsLoading}
          hiddenColumns={hiddenColumns}
          columns={columns}
          data={comments?.results ?? []}
          getRowKey={({ id }) => id}
          emptyState={
            debouncedQuery
              ? getTableEmptyState({
                  entity: "comment",
                  isFiltered: true,
                  onClear: clearQuery,
                })
              : {
                  icon: MessageSquare,
                  title: `No ${typeLabel} comments yet`,
                  description: `Comments on ${typeLabel}s will appear here once readers start posting.`,
                }
          }
        />

        <GenericConfirmModal
          open={action?.type === "delete"}
          title="Delete comment?"
          description="The comment and its likes will be permanently removed. This action cannot be undone."
          confirmText="Delete"
          confirmVariant="destructive"
          handleClose={clearAction}
          handleConfirm={async () => {
            if (action?.type !== "delete") return;
            await handleDeleteComment(type, action.id);
            clearAction();
          }}
        />

        <GenericConfirmModal
          open={action?.type === "deleteByUser"}
          title={`Delete all ${typeLabel} comments by ${
            (action?.type === "deleteByUser" && action.userName) || "this user"
          }?`}
          description={`Every ${typeLabel} comment posted by this user, along with its likes, will be permanently removed. This action cannot be undone.`}
          confirmText="Delete all"
          confirmVariant="destructive"
          handleClose={clearAction}
          handleConfirm={async () => {
            if (action?.type !== "deleteByUser") return;
            await handleDeleteCommentsByUser(type, action.userId);
            clearAction();
          }}
        />
      </div>
    </ErrorCatcher>
  );
};
