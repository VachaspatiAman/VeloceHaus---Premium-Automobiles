"use client";

import { FileText } from "lucide-react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

const SECTIONS = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using AutoDrive AI's platform (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these Terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: "Use of the Platform",
    content: `AutoDrive AI grants you a limited, non-exclusive, non-transferable, revocable license to use the Service for personal, non-commercial purposes.\n\nYou agree not to: use the Service to post false or misleading information; scrape or data-mine the platform; attempt to gain unauthorized access to any part of the Service; use the Service for any illegal purpose; or attempt to reverse-engineer our AI recommendation systems.`,
  },
  {
    title: "Vehicle Listings & Accuracy",
    content: `We strive to maintain accurate vehicle information including specifications, pricing, and availability. However, all vehicle listings on AutoDrive AI are provided "as is" based on information supplied by dealers and manufacturers.\n\nEx-showroom prices shown are published by manufacturers and may change without notice. Final on-road pricing must be confirmed with the relevant dealership. AutoDrive AI is not responsible for any discrepancy between listed and actual prices.`,
  },
  {
    title: "AI Recommendation Disclaimer",
    content: `Our AI recommendation engine provides suggestions based on your stated preferences. These recommendations are for informational purposes only and do not constitute financial or purchase advice.\n\nMatch scores represent algorithmic similarity to your stated preferences, not a guarantee of vehicle quality or suitability. AutoDrive AI is not liable for any purchase decision made based on AI recommendations.`,
  },
  {
    title: "User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.\n\nWe reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.`,
  },
  {
    title: "Intellectual Property",
    content: `The Service and its original content, features, and functionality are and will remain the exclusive property of AutoDrive AI and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AutoDrive AI.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by law, AutoDrive AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits or data, arising from your use of or inability to use the Service.\n\nOur total liability to you for any claim arising from these Terms or your use of the Service shall not exceed ₹5,000 or the amount you have paid to us in the past 12 months, whichever is greater.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law provisions. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.`,
  },
];

export default function TermsPageClient() {
  return (
    <LegalPageLayout
      icon={<FileText size={13} />}
      badge="Terms of Service"
      badgeColor="border-violet-500/25 text-violet-400"
      title="Terms of Service"
      lastUpdated="April 1, 2025"
      readTime="10 min"
      lead="These Terms of Service govern your access to and use of the AutoDrive AI platform. Please read them carefully before using our services. By using AutoDrive AI, you agree to these Terms."
      sections={SECTIONS}
    />
  );
}
