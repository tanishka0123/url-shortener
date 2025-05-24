import { UrlState } from "@/Context";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { QRCode } from "react-qrcode-logo";
import useFetch from "@/hooks/UseFetch";
import { createUrl } from "@/db/apiUrls";

function CreateLinks() {
  const { user } = UrlState();
  const nav = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const ref = useRef();

  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink ? longLink : "",
    customUrl: "",
  });

  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .url("Must be a valid URL")
      .required("Long URL is required"),
    customUrl: yup.string(),
  });

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.id]: e.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fn: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  useEffect(() => {
    if (error === null && data) {
      nav(`/link/${data[0].id}`);
    }
  });

  const createNewLink = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      await fnCreateUrl(blob);
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger asChild>
        <Button >Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
        </DialogHeader>

        {formValues?.longUrl && (
          <QRCode value={formValues?.longUrl} size={250} ref={ref} />
        )}

        <Input
          id="title"
          placeholder="Short Link's Title"
          onChange={handleChange}
          value={formValues.title}
        />
        {errors.title && <Error message={errors.title} />}
        <Input
          id="longUrl"
          placeholder="Enter your Loooong URL"
          onChange={handleChange}
          value={formValues.longUrl}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}
        <div className="flex items-center gap-2">
          <Card className="p-2">cutterr.netlify.app/</Card> /
          <Input
            id="customUrl"
            placeholder="Custom Link (optional)"
            onChange={handleChange}
            value={formValues.customUrl}
          />
        </div>
        {error && <Error message={errors.message} />}
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={createNewLink}
            type="button"
            variant="destructive"
            disabled={loading}
          >
            {loading ? <BeatLoader size={10} color="white" /> : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateLinks;
