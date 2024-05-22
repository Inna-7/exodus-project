import { NavItemType } from "shared/Navigation/NavigationItem";
import ncNanoId from "utils/ncNanoId";

const otherPageChildMenus: NavItemType[] = [
  // {
  //   id: ncNanoId(),
  //   href: "/",
  //   name: "Home Demo 1",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/home2",
  //   name: "Home Demo 2",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/home3",
  //   name: "Home Demo 3",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/page-collection",
  //   name: "Collection page",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/page-search",
  //   name: "Search page",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/page-author",
  //   name: "Author Profile",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/nft-detailt",
  //   name: "NFT detailt",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/account",
  //   name: "Account settings",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/page-upload-item",
  //   name: "Upload Item",
  // },
  {
    id: ncNanoId(),
    href: "/connect-wallet",
    name: "Connect Wallet",
  },
  // {
  //   id: ncNanoId(),
  //   href: "/login",
  //   name: "Login",
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/signup",
  //   name: "Signup",
  // }


  // {
  //   id: ncNanoId(),
  //   href: "/about",
  //   name: "Other Pages",
  //   type: "dropdown",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/about",
  //       name: "About",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/contact",
  //       name: "Contact us",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/login",
  //       name: "Login",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/signup",
  //       name: "Signup",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/subscription",
  //       name: "Subscription",
  //     },
  //   ],
  // },
  // {
  //   id: ncNanoId(),
  //   href: "/blog",
  //   name: "Blog Page",
  //   type: "dropdown",
  //   children: [
  //     {
  //       id: ncNanoId(),
  //       href: "/blog",
  //       name: "Blog Page",
  //     },
  //     {
  //       id: ncNanoId(),
  //       href: "/blog-single",
  //       name: "Blog Single",
  //     },
  //   ],
  // },
];

export const not_logged_in_navigation: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/login",
    name: "Login",
  },
  {
    id: ncNanoId(),
    href: "/signup",
    name: "Signup",
  }
];

export const admin_navigation: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/nft-management",
    name: "Nft Management",
  }
];

export const logged_in_navigation: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/recent-transactions",
    name: "Recent Transactions",
  },
  {
    id: ncNanoId(),
    href: "/nftListing",
    name: "Your purchased NFTs",
  }
];

export const getNavigation = (type: 'user' | 'admin' | '') => {
  switch (type) {
    case "user":
      return NAVIGATION_DEMO(logged_in_navigation)
    case "admin":
      return NAVIGATION_DEMO([...logged_in_navigation, ...admin_navigation])
    default:
      return NAVIGATION_DEMO(not_logged_in_navigation)
  }
}

export const NAVIGATION_DEMO = (array: NavItemType[]) => [
  {
    id: ncNanoId(),
    href: "/",
    name: "Discover",
    type: "dropdown",
    children: [...otherPageChildMenus, ...array],
  },
  // {
  //   id: ncNanoId(),
  //   href: "/page-upload-item",
  //   name: "Help center",
  // },
];