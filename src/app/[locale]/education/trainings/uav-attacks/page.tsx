import { notFound } from "next/navigation";
import { metadataForRoute, renderLocalizedPage } from "@/content/render-localized-page";
import { uavAttacksTraining } from "@/content/trainings";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export async function generateMetadata(props: Props) {
  if (uavAttacksTraining.published === false) notFound();
  return metadataForRoute("/education/trainings/uav-attacks", props);
}

export default async function Page(props: Props) {
  if (uavAttacksTraining.published === false) notFound();
  return renderLocalizedPage("/education/trainings/uav-attacks", props);
}
