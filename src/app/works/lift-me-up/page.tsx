import { Metadata } from "next";
import { LiftMeUpCaseStudy } from "@/components/case-studies/lift-me-up/LiftMeUpCaseStudy";

export const metadata: Metadata = {
  title: "Lift Me Up · Autonomous Hoist & XR Ergonomics | Rajayogi Nandina",
  description:
    "Designing an autonomous hoist behaviour that helps assembly workers stay closer to the ergonomic golden zone, prototyped safely in extended reality. University of Twente × Van Raam.",
  openGraph: {
    title: "Lift Me Up · Autonomous Hoist & XR Ergonomics",
    description:
      "M.Sc. Interaction Technology Thesis at University of Twente. 15-participant Wizard of Oz study investigating Voice, Nudge, and Semi-Automatic hoist assistance in XR.",
    images: ["/images/lift-me-up/hero-xr.webp"],
  },
};

export default function WorksLiftMeUpPage() {
  return <LiftMeUpCaseStudy />;
}
