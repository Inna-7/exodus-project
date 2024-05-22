import React, { FC } from "react";

interface VideoForNft_V2Props {
  src?: string;
  className?: string;
}

const VideoForNft_V2: FC<VideoForNft_V2Props> = ({
  className = "",
  src = "./nft.mp4",
}) => {
  return (
    <div
      className={`aspect-w-11 aspect-h-12 flex items-center justify-center bg-neutral-300 rounded-3xl overflow-hidden ${className}`}
      title="Play"
      dangerouslySetInnerHTML={{
        __html: `<video class="w-full h-full" playsinline autoplay muted loop  >
                    <source src=${src} type="video/mp4" />
                    our browser does not support the video tag.
                  </video>`,
      }}
    />
  );
};

export default VideoForNft_V2;
