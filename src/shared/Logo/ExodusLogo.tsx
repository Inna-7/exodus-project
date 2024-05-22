import React from "react";
import { Link } from "react-router-dom";
import logoImg from "images/exodus-metaverse-logo.png";

export interface ExodusLogoProps {
  className?: string;
}

const ExodusLogo: React.FC<ExodusLogoProps> = ({
  className = "",
}) => {
  return (
    <Link
      to="/"
      className={`ttnc-logo inline-block text-primary-6000 flex gap-x-2 items-center text-black ${className}`}
    >
      <img
        className={`block max-h-12`}
        src={logoImg}
        alt="Logo"
      />
      <span className="text-[17px] leading-5 font-semibold dark:text-neutral-200">
        Exodus <br/> Metaverse
      </span>
    </Link>
  );
};

export default ExodusLogo;
