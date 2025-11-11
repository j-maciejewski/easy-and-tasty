export const ErrorCatcher = ({
  errors,
  children,
}: React.PropsWithChildren<{ errors: Array<Error | null> }>) => {
  if (errors.every((error) => error === null)) return children;

  return (
    <div>
      {errors
        .filter((error) => error !== null)
        .map((error, idx) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: explanation
          <div key={idx}>{error?.message ?? JSON.stringify(error)}</div>
        ))}
    </div>
  );
};
