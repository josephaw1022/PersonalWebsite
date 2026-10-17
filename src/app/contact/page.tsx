import type { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Consulting & Contact | Joseph Whiteaker",
  description:
    "Get in touch with Joseph Whiteaker for consulting and advisory engagements in Kubernetes platforms, cloud infrastructure, and platform engineering.",
};

export default function ContactPage() {
  return <ContactContent />;
}
