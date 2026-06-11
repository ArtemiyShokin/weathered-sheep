import dynamic from "next/dynamic";

export default function HomePage() {
  const Map = dynamic(() => import("@/components/Map"), {
    ssr: false,
    loading: () => <p>A map is loading</p>,
  });

  return (
    <div>
      <h1>Welcome to the meadow</h1>
      <Map />
    </div>
  );
}
