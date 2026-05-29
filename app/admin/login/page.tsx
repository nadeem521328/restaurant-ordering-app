import { Suspense } from "react";
import { AdminLoginForm } from "./admin-login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center px-4 py-8">
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-5 ring-1 ring-orange-100">
            Loading...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}
