import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Card, Heading, Button, Input, Label, Text, Logo } from "@/components";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/auth";
import { login as loginAction } from "@/redux/reducer/authReducer";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleValidation = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Email can't be empty");
      return;
    } else if (!formData.password) {
      toast.error("Password can't be empty");
      return;
    }

    try {
      const res = await login(formData).unwrap();
      dispatch(
        loginAction({
          token: res.data.token,
          role: res.data.role,
          department: res.data?.department,
        }),
      );
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Something went wrong";

      if (err.status) {
        switch (err.status) {
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 404:
            errorMessage = "Email not registred";
            break;
          case 500:
            errorMessage = "Something went wrong";
            break;
          default:
            errorMessage = "Something went wrong";
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-3">
      <Card
        className="w-[420px] space-y-6 p-5 sm:p-8"
        as="form"
        onSubmit={handleValidation}
      >
        <div className="space-y-2">
          <Logo />
          <Heading as="h2" className="text-3xl">
            Login to your account
          </Heading>
          <Text>Enter your email and password to login</Text>
        </div>

        <div className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label id="password">Password</Label>
              <Button
                variant="link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          Login
        </Button>
      </Card>
    </div>
  );
};

export default Login;
