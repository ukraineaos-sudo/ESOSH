import { metadataForRoute, renderLocalizedPage } from "@/content/render-localized-page";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata(props: Props) {
  return metadataForRoute("/privacy-policy", props);
}

export default async function Page(props: Props) {
  return renderLocalizedPage("/privacy-policy", props);
}
