import { metadataForRoute, renderLocalizedPage } from "@/content/render-localized-page";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata(props: Props) {
  return metadataForRoute("/contact-us", props);
}

export default async function Page(props: Props) {
  return renderLocalizedPage("/contact-us", props);
}
