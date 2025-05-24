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
import { useEffect, useState } from "react";
import * as Yup from "yup";
import useFetch from "@/hooks/UseFetch";
import { signUp } from "@/db/apiAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UrlState } from "@/Context";

function Signup() {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile: null,
  });
  const nav = useNavigate();
  let [serachParams] = useSearchParams();

  const longLink = serachParams.get("createNew");

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, loading, error, fn } = useFetch(signUp, formData);
  const { fetchUser } = UrlState();
  useEffect(() => {
    if (error === null && data) {
      nav(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
      fetchUser();
    }
  }, [ error,loading]);

  const handleSignup= async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        profile: Yup.mixed().required("Profile picture is required"),
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
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new account if you haven&rsquo;t already
        </CardDescription>
        {error && <Error message={error?.message} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            onChange={handleInputChange}
          />
        </div>
        {errors.name && <Error message={errors.name} />}
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            onChange={handleInputChange}
          />
        </div>
        {errors.email && <Error message={errors.email} />}
        <div className="space-y-1">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
          />
        </div>
        {errors.password && <Error message={errors.password} />}
        <div className="space-y-1">
          <Input
            name="profile"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>
        {errors.profile && <Error message={errors.profile} />}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? (
            <BeatLoader size={10} color="#3585f5" />
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Signup;
