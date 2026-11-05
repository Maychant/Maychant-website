import landingContent from "./landing-content";
import SiteScripts from "./site-scripts";

export default function Home() {
  return (
    <>
      <div id="maychant-site" dangerouslySetInnerHTML={{ __html: landingContent }} />
      <SiteScripts />
    </>
  );
}
