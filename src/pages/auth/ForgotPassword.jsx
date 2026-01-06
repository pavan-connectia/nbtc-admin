import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Heading, Button, Input, Label, Text, Logo } from "@/components";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleValidation = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Email can't be empty");
      return;
    }

    try {
      const res = await forgotPassword({ email: trimmedEmail }).unwrap();
      if (res) toast.success("Password reset link has been sent your email");
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.status) {
        switch (error.status) {
          case 404:
            errorMessage = "User with email doesn't exist";
            break;
          case 500:
            errorMessage = "Internal server error";
            break;
          default:
            errorMessage = "Something went wrong";
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Card
        className="w-[420px] space-y-6 rounded-lg p-5 sm:p-8"
        as="form"
        onSubmit={handleValidation}
      >
        <div className="space-y-2">
          <Logo />
          <Heading as="h2" className="text-3xl">
            Forgot password
          </Heading>
          <Text>
            Enter your email address below and we'll send you a link to reset
            your password
          </Text>
        </div>

        <div className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          Reset Password
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="mx-auto"
            onClick={() => navigate("/")}
          >
            Remember your password? Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
