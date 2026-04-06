import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[1400px] items-center justify-center px-4 py-12 md:px-8">
      <SignUp />
    </main>
  );
}
