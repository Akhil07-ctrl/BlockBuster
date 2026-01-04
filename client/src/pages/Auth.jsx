import { SignIn, SignUp } from "@clerk/clerk-react";

export const SignInPage = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8 w-full max-w-screen-xl mx-auto">
        <SignIn routing="path" path="/sign-in" />
    </div>
);

export const SignUpPage = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8 w-full max-w-screen-xl mx-auto">
        <SignUp routing="path" path="/sign-up" />
    </div>
);
