import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Path } from "@/config";
import { authOptions } from "@/lib/auth";

export default async function () {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(Path.LOGIN);
  }

  redirect(session.user.role === "editor" ? Path.DASHBOARD : Path.HOME);
}
