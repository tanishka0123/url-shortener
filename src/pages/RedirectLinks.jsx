import { storeClicks } from "@/db/apiClicks";
import { getLongUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/UseFetch";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

function RedirectLinks() {
  const { id } = useParams();
  const { loading, data, fn } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loadingStats || loading) {
    return (
      <>
        <BarLoader width={"100%"} color="#3585f5"></BarLoader>
        <br />
        Redirecting...
      </>
    );
  }
  return null;
}

export default RedirectLinks;
