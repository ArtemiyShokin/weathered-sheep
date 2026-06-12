import dynamic from "next/dynamic";
import { StyledHeading } from "@/components/Global/Global.styled";
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <p>A map is loading</p>,
});

export default function HomePage() {
  return (
    <div>
      <StyledHeading>Welcome to the meadow</StyledHeading>
      <Map />
    </div>
  );
}
