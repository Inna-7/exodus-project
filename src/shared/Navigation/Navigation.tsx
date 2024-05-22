import React, { useMemo } from "react";
import NavigationItem from "./NavigationItem";
import { getNavigation } from "data/navigation";
import { useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import { selectUserState } from "app/UserReducer";

function Navigation() {
  const { isLogged } = useAppSelector(selectLogState)
  const { isAdmin } = useAppSelector(selectUserState)

  const navigationData = useMemo(() => {
    const type = isAdmin ? 'admin' : isLogged ? 'user' : ''
    return getNavigation(type)
  }, [isAdmin, isLogged])

  return (
    <ul className="nc-Navigation hidden lg:flex lg:flex-wrap lg:items-center lg:space-x-1 relative">
      {navigationData?.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
