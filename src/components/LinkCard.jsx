import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/UseFetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";
import toast from "react-hot-toast";

function LinkCard({ url, fetchUrls }) {
  const downloadImage = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;
    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url?.id);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://cutterr.netlify.app/${url.short_url}`)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy!"));
  };

  const handleDelete = async () => {
    try {
      await fnDelete();
      fetchUrls();
      toast.success("Link deleted!");
    } catch {
      toast.error("Failed to delete link.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row  gap-5 border p-4 bg-gray-900 rounded-lg">
      <img
        src={url?.qr}
        className="h-32 object-contain ring ring-blue-500 self-start"
        alt="qr code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col flex-1 gap-2">
        <span className="text-3xl font-extrabold hover:underline cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">
          https://cutterr.netlify.app/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className="flex items-center gap-1 hover:underline cursor-pointer flex-1">
          <LinkIcon className="p-1" />
          {url?.original_url}
        </span>
        <span className="flex items-end font-extralight text-sm flex-1">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={handleCopy}>
          <Copy />
        </Button>
        <Button variant="ghost" onClick={downloadImage}>
          <Download />
        </Button>
        <Button variant="ghost" onClick={handleDelete}>
          {loadingDelete ? (
            <BeatLoader size={5} color="white" />
          ) : (
            <Trash></Trash>
          )}
        </Button>
      </div>
    </div>
  );
}

export default LinkCard;
