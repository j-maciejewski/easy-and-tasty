import { NewPasswordForm, ResetPasswordForm } from "@/components/auth_forms";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return token ? (
    <NewPasswordForm token={token} />
  ) : (
    <ResetPasswordForm type="page" />
  );
}
