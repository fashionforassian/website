import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1400px] items-center justify-center px-4 py-12 md:px-8">
      <SignIn />
    </main>
  );
}
