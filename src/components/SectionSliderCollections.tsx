import React, { FC, useEffect, useId, useRef } from "react";
import Heading from "components/Heading/Heading";
import Glide from "@glidejs/glide";
import CollectionCard from "./CollectionCard";
import CollectionCard2 from "./CollectionCard2";
import { Link } from "react-router-dom";
import pics1 from "images/exo_pics/Pics_1.jpeg";
import pics2 from "images/exo_pics/Pics_2.jpg";
import pics8 from "images/exo_pics/Pics_8.jpg";
import pics18 from "images/exo_pics/Pics_18.jpg";
import pics53 from "images/exo_pics/Pics_53.jpg";
import pics54 from "images/exo_pics/Pics_54.jpg";
import pics55 from "images/exo_pics/Pics_55.jpg";
import pics56 from "images/exo_pics/Pics_56.jpg";
import pics85 from "images/exo_pics/Pics_85.jpg";
import pics86 from "images/exo_pics/Pics_86.jpg";
import pics87 from "images/exo_pics/Pics_87.jpg";
import pics88 from "images/exo_pics/Pics_88.jpg";
import pics44 from "images/exo_pics/Pics_44.jpg";
import pics45 from "images/exo_pics/Pics_45.jpg";
import pics46 from "images/exo_pics/Pics_46.jpg";
import pics47 from "images/exo_pics/Pics_47.jpg";

export interface SectionSliderCollectionsProps {
  className?: string;
  itemClassName?: string;
  cardStyle?: "style1" | "style2";
}

const SectionSliderCollections: FC<SectionSliderCollectionsProps> = ({
  className = "",
  cardStyle = "style1",
}) => {
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  useEffect(() => {
    if (!sliderRef.current) {
      return;
    }

    const OPTIONS: Glide.Options = {
      perView: 3,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          gap: 28,
          perView: 2.5,
        },
        1024: {
          gap: 20,
          perView: 2.15,
        },
        768: {
          gap: 20,
          perView: 1.5,
        },

        500: {
          gap: 20,
          perView: 1,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    // @ts-ignore
    return () => slider.destroy();
  }, [sliderRef, UNIQUE_CLASS]);

  const MyCollectionCard =
    cardStyle === "style1" ? CollectionCard : CollectionCard2;

  return (
    <div className={`nc-SectionSliderCollections ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <Heading
          isCenter={false}
          hasNextPrev
          desc="Discover the new creative economy"
          rightPopoverText="last 7 days"
        >
          Top collections
        </Heading>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            <li className={`glide__slide`}>
              <MyCollectionCard
                imgs={[ pics2, pics1, pics8, pics18 ]}
                collectionName="Exodus"
              />
            </li>
            <li className={`glide__slide`}>
              <MyCollectionCard
                imgs={[ pics53, pics54, pics55, pics56 ]}
                collectionName="Our"
              />
            </li>

            <li className={`glide__slide`}>
              <MyCollectionCard
                imgs={[ pics85, pics86, pics87, pics88 ]}
                collectionName="Universe"
              />
            </li>
            {/* <li className={`glide__slide`}>
              <MyCollectionCard
                imgs={[ pics44, pics45, pics46, pics47 ]}
              />
            </li> */}
            {/* <li className={`glide__slide   `}>
              <Link to={"/page-search"} className="block relative group">
                <div className="relative rounded-2xl overflow-hidden h-[410px]">
                  <div className="h-[410px] bg-black/5 dark:bg-neutral-800"></div>
                  <div className="absolute inset-y-6 inset-x-10  flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center relative">
                      <span className="text-xl font-semibold">Collections</span>
                      <svg
                        className="absolute left-full w-5 h-5 ml-2 rotate-45 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.0701 9.57L12.0001 3.5L5.93005 9.57"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 20.4999V3.66992"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-sm mt-1">Show me more</span>
                  </div>
                </div>
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SectionSliderCollections;
