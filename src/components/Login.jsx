import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import { use, useEffect, useState } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/UseFetch";
import { login } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/Context";

function Login() {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const nav = useNavigate();
  let [serachParams] = useSearchParams();

  const longLink = serachParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { data, loading, error, fn } = useFetch(login, formData);
  const { fetchUser } = UrlState();
  useEffect(() => {
    if (error === null && data) {
      nav(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleLogin = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid Email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      });
      await schema.validate(formData, { abortEarly: false });
      await fn();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          to your account if you already have one
        </CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          ></Input>
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className="space-y-1">
          <Input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          ></Input>
          {errors.password && <Error message={errors.password} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleLogin}>
          {loading ? <BeatLoader size={10} color="#3585f5" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
