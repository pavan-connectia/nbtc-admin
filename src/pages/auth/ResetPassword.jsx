import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/redux/reducer/authReducer";
import {
  Card,
  Heading,
  Button,
  Input,
  Label,
  Text,
  Logo,
} from "../../components";
import { useResetPasswordMutation } from "@/redux/api/auth";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleValidation = async (e) => {
    e.preventDefault();
    if (!formData.newPassword) {
      toast.error("New password can't be empty");
      return;
    } else if (!formData.confirmPassword) {
      toast.error("Confirm password can't be empty");
      return;
    } else if (
      formData.confirmPassword.trim().length < 8 &&
      formData.newPassword.trim().length < 8
    ) {
      toast.error("Password must contain a minimum of 8 characters");
      return;
    } else if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password does not match");
      return;
    }
    try {
      const { newPassword } = formData;
      const res = await resetPassword({
        token: token,
        password: newPassword,
      }).unwrap();
      dispatch(login({ userDetails: res.data }));
      toast.success("Password reset successfully");
      navigate("/");
    } catch (error) {
      // Log the error for debugging
      let errorMessage = "Something went wrong";
      if (error.status) {
        switch (error.status) {
          case 400:
            errorMessage = "Invalid or expired reset link";
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
            Reset password
          </Heading>
          <Text>Enter a new password for your account.</Text>
        </div>

        <div className="space-y-4">
          <Input
            id="newPassword"
            type="password"
            label="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          Reset Password
        </Button>

        <div className="text-center">
          <Button
            variant="link"
            className="mx-auto"
            onClick={() => navigate("/forgot-password")}
          >
            Back to reset password
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResetPassword;
