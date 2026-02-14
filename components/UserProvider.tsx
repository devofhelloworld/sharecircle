"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";
import { Session } from "next-auth";

interface UserContextValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any | null;
  loading: boolean;
}

const UserContext = createContext<UserContextValue>({
  currentUser: null,
  loading: true,
});

export function useUser() {
  return useContext(UserContext);
}

function UserContextBridge({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const currentUser = session?.user
    ? {
      _id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      credits: (session.user as any).credits ?? 0,
    }
    : null;

  return (
    <UserContext.Provider
      value={{ currentUser, loading: status === "loading" }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function UserProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <UserContextBridge>{children}</UserContextBridge>
    </SessionProvider>
  );
}
