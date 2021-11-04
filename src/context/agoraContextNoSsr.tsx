import dynamic from "next/dynamic";
import { useContext } from "react";
import { agoraContext } from "./agoraContext";

export const AgoraProviderWithNoSSR = dynamic(
  () => import("./agoraContextProvider").then((ctx) => ctx.AgoraProvider),
  { ssr: false }
);

export const useAgora = () => useContext(agoraContext);
