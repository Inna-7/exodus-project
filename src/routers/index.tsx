import React, { useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Page } from "./types";
import ScrollToTop from "./ScrollToTop";
import Footer from "shared/Footer/Footer";
import PageHome from "containers/PageHome/PageHome";
import Page404 from "containers/Page404/Page404";
import AuthorPage from "containers/AuthorPage/AuthorPage";
import AccountPage from "containers/AccountPage/AccountPage";
import PageContact from "containers/PageContact/PageContact";
import PageAbout from "containers/PageAbout/PageAbout";
import PageSignUp from "containers/PageSignUp/PageSignUp";
import PageLogin from "containers/PageLogin/PageLogin";
import PageSubcription from "containers/PageSubcription/PageSubcription";
import BlogPage from "containers/BlogPage/BlogPage";
import BlogSingle from "containers/BlogPage/BlogSingle";
import SiteHeader from "containers/SiteHeader";
import NftDetailPage from "containers/NftDetailPage/NftDetailPage";
import NftDetailPageV2 from "containers/NftDetailPage/NftDetailPageV2";
import PageCollection from "containers/PageCollection";
import PageSearch from "containers/PageSearch";
import PageUploadItem from "containers/PageUploadItem";
import PageConnectWallet from "containers/PageConnectWallet";
import PageHome2 from "containers/PageHome/PageHome2";
import PageHome3 from "containers/PageHome/PageHome3";
import VerifyEmailPage from "containers/VerifyEmailPage/VerifyEmailPage";
import NftListingPage from "containers/NftListingPage";
import RecentTransactions from "containers/RecentTransactions/RecentTransactions";
import NftManagement from "containers/NftManagement/NftManagement";
import { useAppSelector } from "app/hooks";
import { selectUserState } from "app/UserReducer";
import { selectLogState } from "app/LoginStateReducer";

export const allPages: Page[] = [
  { path: "/", component: PageHome3 },
  // { path: "/#", component: PageHome2 },
  // { path: "/home2", component: PageHome },
  { path: "/home3", component: PageHome3 },
  // { path: "/home-header-2", component: PageHome },
  { path: "/nft-detailt/:id", component: NftDetailPageV2 },
  // { path: "/nft-detailt", component: NftDetailPage },
  // { path: "/page-collection", component: PageCollection },
  // { path: "/page-search", component: PageSearch },
  // { path: "/page-author", component: AuthorPage },
  // { path: "/account", component: AccountPage },
  // { path: "/page-upload-item", component: PageUploadItem },
  { path: "/connect-wallet", component: PageConnectWallet },
  // { path: "/blog", component: BlogPage },
  // { path: "/blog-single", component: BlogSingle },
  // { path: "/contact", component: PageContact },
  // { path: "/about", component: PageAbout },
  // { path: "/signup", component: PageSignUp },
  // { path: "/login", component: PageLogin },
  // { path: "/subscription", component: PageSubcription },
  { path: "/verify-email", component: VerifyEmailPage },
  { path: "/nftListing", component: NftListingPage, type: 'user' },
  { path: "/recent-transactions", component: RecentTransactions, type: 'user' },
  { path: "/nft-management", component: NftManagement, type: 'admin' }
];

const MyRoutes = () => {
  const { isAdmin } = useAppSelector(selectUserState)
  const { isLogged } = useAppSelector(selectLogState)

  const pages: Page[] = useMemo(() => {
    return allPages?.reduce((newPages: Page[], item: Page) => {

      if (!isLogged) {
        if (!item.type) {
          newPages.push(item);
        }
        return newPages;
      }

      if (isAdmin) {
        newPages.push(item);
      }
      else if (item.type !== 'admin') {
        newPages.push(item);
      }

      return newPages;
    }, [])
  }, [isAdmin, isLogged]);

  return (
    <BrowserRouter basename={process.env.NODE_ENV === "production" ? "/" : "/"}>
      <ScrollToTop />
      <SiteHeader />
      <Routes>
        {pages.map(({ component, path }) => {
          const Component = component;
          return <Route key={path} element={<Component />} path={path} />;
        })}
        <Route
          path="/login"
          element={isLogged ? <Navigate to="/" replace /> : <PageLogin />}
        />
        <Route
          path="/signup"
          element={isLogged ? <Navigate to="/" replace /> : <PageSignUp />}
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MyRoutes;
