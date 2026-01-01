import { SignIn, SignUp } from "@clerk/clerk-react";

export const SignInPage = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        <SignIn routing="path" path="/sign-in" />
    </div>
);

export const SignUpPage = () => (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        <SignUp routing="path" path="/sign-up" />
    </div>
);
