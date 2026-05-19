"use client";

import { Shield } from "lucide-react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

const SECTIONS = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us when creating an account, such as your name, email address, phone number, and preferences. We also collect information about the vehicles you browse, compare, and save on our platform.\n\nWe automatically collect certain information about your device and how you interact with our services, including IP address, browser type, operating system, referring URLs, and pages viewed.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services; to power our AI recommendation engine with your vehicle preferences; to send transactional emails and, with your consent, marketing communications; to analyze usage patterns and optimize our platform; and to comply with legal obligations.\n\nYour preference data is used exclusively to improve your personalized recommendations and is never sold to third parties.`,
  },
  {
    title: "Data Sharing & Disclosure",
    content: `We do not sell, rent, or trade your personal information to any third parties. We may share your information with: authorized dealerships when you request a test drive or quotation; service providers who help us operate our platform (e.g., hosting, analytics) under strict data processing agreements; and law enforcement or regulatory authorities when required by applicable law.`,
  },
  {
    title: "AI Recommendation Data",
    content: `Our AI recommendation engine uses anonymized preference data across our user base to improve suggestions. Individual profiles are processed on secure servers and are not accessible to dealership partners.\n\nYou may reset your preference profile at any time from your account settings, which will restart the AI learning process from scratch.`,
  },
  {
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to provide you services. Upon account deletion, personal information is purged from active systems within 30 days and from backup systems within 90 days, subject to our legal retention obligations.`,
  },
  {
    title: "Your Rights",
    content: `Under applicable Indian data protection laws, you have the right to: access the personal data we hold about you; correct inaccurate or incomplete data; request deletion of your personal data (subject to legal requirements); object to processing of your data for marketing; and data portability — receive your data in a structured, machine-readable format.\n\nTo exercise any of these rights, email us at privacy@autodrive.ai.`,
  },
  {
    title: "Security",
    content: `We implement industry-standard security measures including TLS encryption in transit, AES-256 encryption at rest, regular security audits, and role-based access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at privacy@autodrive.ai or write to us at: AutoDrive AI, Bandra Kurla Complex, Mumbai, Maharashtra 400051, India.`,
  },
];

export default function PrivacyPageClient() {
  return (
    <LegalPageLayout
      icon={<Shield size={13} />}
      badge="Privacy Policy"
      badgeColor="border-blue-500/25 text-blue-400"
      title="Privacy Policy"
      lastUpdated="April 1, 2025"
      readTime="8 min"
      lead="At AutoDrive AI, we take your privacy seriously. This Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using AutoDrive AI, you consent to the practices described in this Policy."
      sections={SECTIONS}
    />
  );
}
