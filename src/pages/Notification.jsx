import { ButtonGroup, Card, Heading } from "@/components";
import { useGetAwardsQuery, useUpdateAwardsMutation } from "@/redux/api/awards";
import {
  useGetImgGalleryQuery,
  useUpdateImgGalleryMutation,
} from "@/redux/api/imgGallery";
import { useGetNewsQuery, useUpdateNewsMutation } from "@/redux/api/news";
import {
  useGetVideoGalleryQuery,
  useUpdateVideoGalleryMutation,
} from "@/redux/api/videGallery";
import { useGetPublicationQuery,useUpdatePublicationMutation } from "@/redux/api/publication";
import React from "react";
import { toast } from "sonner";

export default function Notification() {
  const { data: awardsReq } = useGetAwardsQuery(true);
  const { data: imgReq } = useGetImgGalleryQuery(true);
  const { data: newsReq } = useGetNewsQuery(true);
  const { data: videoReq } = useGetVideoGalleryQuery(true);
  const { data: publicationReq } = useGetPublicationQuery(true);

  return (
    <div className="space-y-5">
      <AwardsRequest awardsReq={awardsReq} />

      <NewsRequest newsReq={newsReq} />

      <ImgGalleryRequest imgReq={imgReq} />

      <VideoRequest videoReq={videoReq} />
      
      <PublicationRequest publicationReq={publicationReq} />
    </div>
  );
}

function ImgGalleryRequest({ imgReq }) {
  const [updateImgGallery] = useUpdateImgGalleryMutation();

  const handleApprove = async (id) => {
    updateImgGallery({
      id: id,
      requested: false,
      showInMain: true,
    });
    toast.success("Image gallery Request has been approved");
  };

  const handleDeny = async (id) => {
    updateImgGallery({ id: id, requested: false });
    toast.success("Video Request has been denied");
  };

  return (
    <>
      <Heading className="text-xl md:text-2xl">Image Gallery Request</Heading>
      <Card className="mt-3 overflow-y-auto p-5">
        <table className="mb-10 w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">#</th>
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {imgReq?.data?.map((d, idx) => (
              <tr
                key={d?._id || idx}
                className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
              >
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                    alt=""
                    className="size-20 overflow-hidden object-contain"
                  />
                </td>
                <td className="p-2"> {d?.title?.en}</td>
                <td className="p-2">
                  <ButtonGroup
                    negativeLabel="Deny"
                    positiveLabel="Approve"
                    negativeClick={() => handleDeny(d?._id)}
                    positiveClick={() => handleApprove(d?._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function AwardsRequest({ awardsReq }) {
  const [updateAwards] = useUpdateAwardsMutation();

  const handleApprove = async (id) => {
    updateAwards({ id: id, requested: false, showInMain: true });
    toast.success("Awards Request has been approved");
  };

  const handleDeny = async (id) => {
    updateAwards({ id: id, requested: false });
    toast.success("Awards Request has been denied");
  };

  return (
    <>
      <Heading className="text-xl md:text-2xl">Awards Request</Heading>
      <Card className="mt-3 overflow-y-auto p-5">
        <table className="mb-10 w-full border-collapse">
          <thead>
            <tr className="text-left">
              <th className="p-2">#</th>
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Type</th>
              <th className="p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {awardsReq?.data?.map((d, idx) => (
              <tr
                key={d?._id || idx}
                className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
              >
                <td className="p-2">{idx + 1}</td>
                <td className="p-2">
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                    alt=""
                    className="size-20 overflow-hidden object-contain"
                  />
                </td>
                <td className="p-2"> {d?.name?.en}</td>
                <td className="p-2"> {d?.type}</td>
                <td className="p-2">
                  <ButtonGroup
                    negativeLabel="Deny"
                    positiveLabel="Approve"
                    negativeClick={() => handleDeny(d?._id)}
                    positiveClick={() => handleApprove(d?._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

function NewsRequest({ newsReq }) {
  const [updateNews] = useUpdateNewsMutation();

  const handleApprove = async (id) => {
    updateNews({
      id: id,
      requested: false,
      showInMain: true,
    });
    toast.success("News has been approved");
  };

  const handleDeny = async (id) => {
    updateNews({ id: id, requested: false });
    toast.success("News has been denied");
  };
  return (
    <>
      <Heading className="text-xl md:text-2xl">News Request</Heading>
      {
        <Card className="mt-3 overflow-y-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Date</th>
                <th className="p-2">Location</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {newsReq?.data?.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                      alt=""
                      className="size-20 overflow-hidden object-contain"
                    />
                  </td>
                  <td className="max-w-[300px] text-wrap p-2">
                    {" "}
                    {d?.title?.en}
                  </td>
                  <td className="text-nowrap p-2"> {d?.date}</td>
                  <td className="p-2"> {d?.location?.en}</td>
                  <td className="p-2">
                    <ButtonGroup
                      negativeLabel="Deny"
                      positiveLabel="Approve"
                      negativeClick={() => handleDeny(d?._id)}
                      positiveClick={() => handleApprove(d?._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      }
    </>
  );
}

function VideoRequest({ videoReq }) {
  const [updateVideoGallery] = useUpdateVideoGalleryMutation();

  const handleApprove = async (id) => {
    await updateVideoGallery({
      id: id,
      requested: false,
      showInMain: true,
    });
    toast.success("Video Request has been approved");
  };

  const handleDeny = async (id) => {
    await updateVideoGallery({ id: id, requested: false });
    toast.success("Video Request has been denied");
  };

  return (
    <>
      <Heading className="text-xl md:text-2xl">Video Gallery Request</Heading>
      {
        <Card className="mt-3 overflow-y-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Title</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {videoReq?.data?.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2"> {d?.title?.en}</td>
                  <td className="p-2">
                    <ButtonGroup
                      negativeLabel="Deny"
                      positiveLabel="Approve"
                      negativeClick={() => handleDeny(d?._id)}
                      positiveClick={() => handleApprove(d?._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      }
    </>
  );
}


function PublicationRequest({ publicationReq }) {
  const [updatePublication] = useUpdatePublicationMutation();

 const handleApprove = async (id) => {
  try {
    await updatePublication({
      id,
      requested: false,
      showInMain: true,
    }).unwrap();

    toast.success("Publication Request has been approved");
  } catch (err) {
    toast.error("Failed to approve publication");
  }
};

const handleDeny = async (id) => {
  try {
    await updatePublication({
      id,
      requested: false,
    }).unwrap();

    toast.success("Publication Request has been denied");
  } catch (err) {
    toast.error("Failed to deny publication");
  }
};


  return (
    <>
      <Heading className="text-xl md:text-2xl">Publication Request</Heading>
      {
        <Card className="mt-3 overflow-y-auto p-5">
          <table className="mb-10 w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="p-2">#</th>
                <th className="p-2">Image</th>
                <th className="p-2">Title</th>
                <th className="p-2">Deparment</th>
                <th className="p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {publicationReq?.data?.map((d, idx) => (
                <tr
                  key={d?._id || idx}
                  className="border-b hover:bg-gray-100 dark:hover:bg-neutral-600"
                >
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">
                    <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${d?.image}`}
                    alt=""
                    className="size-20 overflow-hidden object-contain"
                  />
                  </td>
                  <td className="p-2"> {d?.title}</td>
                  <td className="p-2"> {d?.department?.name?.en}</td>
                  <td className="p-2">
                    <ButtonGroup
                      negativeLabel="Deny"
                      positiveLabel="Approve"
                      negativeClick={() => handleDeny(d?._id)}
                      positiveClick={() => handleApprove(d?._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      }
    </>
  );
}


