import dynamic from "next/dynamic";
import { StyledHeading } from "@/components/Global/Global.styled";
import InfoBox from "@/components/InfoBox";
import useSWR from "swr";

const fetcher = async (resource, init) => {
  const result = await fetch(resource, init);

  if (!result.ok) {
    const error = new Error(
      "Meh! An eeerror occured while connecting to the weather data."
    );
    error.info = await result.json();
    error.status = result.status;
    throw error;
  }

  return result.json();
};

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage({ sheep, setSheep }) {
  // const { weather, error, isLoading } = useSWR(
  //   "/api/open-meteo?latitude=${latitude}&longitude=${longitude}",
  //   fetcher
  // );

  return (
    <div>
      <StyledHeading>Welcome to the meadow</StyledHeading>
      <Map sheep={sheep} setSheep={setSheep} />
      <InfoBox sheep={sheep} setSheep={setSheep} />
    </div>
  );
}
