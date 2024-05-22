import React, { useEffect, useState } from "react";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import SectionHowItWork from "components/SectionHowItWork/SectionHowItWork";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionGridAuthorBox from "components/SectionGridAuthorBox/SectionGridAuthorBox";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import SectionSubscribe2 from "components/SectionSubscribe2/SectionSubscribe2";
import SectionGridFeatureNFT2 from "./SectionGridFeatureNFT2";
import SectionMagazine8 from "components/SectionMagazine8";
import SectionSliderCardNftVideo from "components/SectionSliderCardNftVideo";
import SectionHero3 from "components/SectionHero/SectionHero3";
import SectionSliderCollections from "components/SectionSliderCollections";
import { Link } from "react-router-dom";
import CardNFT_V2 from "components/CardNFT_V2";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import TabFilters from "components/TabFilters";
import Pagination from "shared/Pagination/Pagination";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getCurrencySet, getNfts, selectNftState } from "app/nftsState/nftsReducer";
import NftPagination from "shared/Pagination/NftPagination";

function PageHome3() {
  const dispatch = useAppDispatch()
  const { nfts, LUNCUSDT } = useAppSelector(selectNftState)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(nfts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleNFTs = nfts.slice(startIndex, endIndex);

  useEffect(() => {
    if (!nfts.length) {
      dispatch(getNfts())
    }

    if (LUNCUSDT === 0) {
      dispatch(getCurrencySet())
    }

    const interval = setInterval(() => {
      dispatch(getCurrencySet())
    }, 60000);

    return () => clearInterval(interval);
  }, [LUNCUSDT]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="nc-PageHome3 relative overflow-hidden">
      <div className="container px-4">
        {/* SECTION HERO */}
        <SectionHero3 />
      </div>

      <div className="container py-20 lg:pt-32">
        {/* SECTION 2 */}
        <SectionHowItWork />
      </div>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-20 lg:space-y-28">
        <main>
          {/* {isLogged &&
            <Link to='/nftListing'>
              <ButtonPrimary className="mb-5">
                Your purchased NFTs
              </ButtonPrimary>
            </Link>
          } */}

          {/* TABS FILTER */}
          {/* <TabFilters /> */}

          <h3 className="text-xl sm:text-3xl font-semibold">
            Discover our NFTs
          </h3>
          {/* LOOP ITEMS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10  mt-8 lg:mt-10">
            {visibleNFTs?.map(nft =>
              <CardNFT_V2
                key={nft.id}
                name={nft.name}
                type={nft.video ? "video" : "image"}
                src={nft.video || nft.image}
                price={nft.price}
                id={nft.id}
              />
            )}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <NftPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            {/* <ButtonPrimary loading>Show me more</ButtonPrimary> */}
          </div>
        </main>

        {/* === SECTION 5 === */}
        {/* <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div> */}

        {/* SUBCRIBES */}
        {/* <SectionBecomeAnAuthor /> */}
      </div>

      <div className="container relative space-y-24 mb-24 lg:space-y-32 lg:mb-32">
        {/* SECTION */}
        {/* <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionGridAuthorBox
            sectionStyle="style2"
            data={Array.from("11111111")}
            boxCard="box4"
          />
        </div> */}
        {/* SECTION 3 */}
        {/* <SectionMagazine8 /> */}

        {/* SECTION 4 */}
        {/* <SectionSliderCardNftVideo /> */}

        {/* SECTION */}
        <div className="relative py-20 lg:py-28">
          <BackgroundSection />
          <SectionSliderCollections />
        </div>

        {/* SECTION */}
        {/* <SectionSubscribe2 /> */}

        {/* SECTION */}
        {/* <div className="relative py-20 lg:py-28">
          <BackgroundSection className="bg-neutral-100/70 dark:bg-black/20 " />
          <SectionGridFeatureNFT2 />
        </div> */}

        {/* SECTION 1 */}
        {/* <SectionSliderCategories /> */}

        {/* SECTION */}
        {/* <div className="relative py-20 lg:py-24">
          <BackgroundSection />
          <SectionBecomeAnAuthor />
        </div> */}
      </div>
    </div>
  );
}

export default PageHome3;
