import DeviceStats from "@/components/DeviceStats";
import Location from "@/components/Location";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrlState } from "@/Context";
import { getClicksForUrl } from "@/db/apiClicks";
import { deleteUrl, getUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/UseFetch";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";

function Link() {
  const { id } = useParams();
  const { user } = UrlState();
  const nav = useNavigate();

  const {
    loading,
    data: url,
    fn,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });
  const {
    loading: loadingStats,
    data: stats,
    fn: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, id);

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

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`https://cutterr.netlify.app/${url.short_url}`)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy!"));
  };

  const handleDelete = async () => {
    try {
      await fnDelete();
      nav("/dashboard");
      toast.success("Link deleted!");
    } catch {
      toast.error("Failed to delete link.");
    }
  };

  useEffect(() => {
    fn();
    fnStats();
  }, []);
  if (error) {
    nav("/dashboard");
  }

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }
  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#3585f5" />
      )}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            href={`https://cutterr.netlify.app/${link}`}
            target="_blank"
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
          >
            https://cutterr.netlify.app/{link}
          </a>
          <a
            className="flex items-center gap-1 hover:underline cursor-pointer"
            href={url?.orginal_url}
            target="_blank"
          >
            <LinkIcon className="p-1"></LinkIcon>
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>
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
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>
        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              <Location stats={stats} />
              <CardTitle>Device Info</CardTitle>
              <DeviceStats stats={stats} />
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? "No Statistics yet"
                : "Loading Statistics.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}

export default Link;
