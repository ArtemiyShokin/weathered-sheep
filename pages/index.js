import dynamic from "next/dynamic";
import { StyledHeading } from "@/components/Global/Global.styled";
export default function HomePage() {
  const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>A map is loading</p>,
  });

  return (
    <div>
      <StyledHeading>Welcome to the meadow</StyledHeading>
      <Map />
    </div>
  );
}
