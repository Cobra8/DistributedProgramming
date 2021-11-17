import { FrontendFooter } from "./FrontendFooter";
import { FrontendHeader } from "./FrontendHeader";
import FrontendWrapper from "./FrontendWrapper";

export interface FrontendProps {
  siteTitle?: string;
  variant?: "small" | "regular" | "wide" | "full";
}

export const Frontend: React.FC<FrontendProps> = ({ siteTitle = "", variant = "wide", children }) => {
  return (
    <>
      <FrontendHeader />
      <FrontendWrapper siteTitle={siteTitle} variant={variant}>
        {children}
      </FrontendWrapper>
      <FrontendFooter />
    </>
  );
};
