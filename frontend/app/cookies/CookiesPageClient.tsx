"use client";

import { Cookie } from "lucide-react";
import { LegalPageLayout } from "@/components/LegalPageLayout";

const SECTIONS = [
  {
    title: "What Are Cookies",
    content: `Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work efficiently and to provide reporting information.\n\nCookies can be "persistent" (remain on your device for a set period) or "session" cookies (deleted when you close your browser). We use both types on AutoDrive AI.`,
  },
  {
    title: "How We Use Cookies",
    content: `We use cookies to: keep you signed in to your account; remember your vehicle preferences and filter settings; understand how you use our platform through analytics; improve our AI recommendation accuracy based on browsing patterns; and deliver relevant content and advertisements (only if you consent).`,
  },
  {
    title: "Types of Cookies We Use",
    content: `Essential Cookies: Required for the platform to function. These cannot be disabled and include session management, security tokens, and CSRF protection.\n\nPerformance Cookies: Help us understand how visitors interact with our site — pages visited, time spent, errors encountered. We use anonymized Google Analytics data.\n\nFunctional Cookies: Remember your preferences such as language, currency, and filter settings to personalize your experience.\n\nMarketing Cookies: Used only with your explicit consent to show you relevant vehicle ads on other platforms.`,
  },
  {
    title: "Third-Party Cookies",
    content: `We use the following third-party services that may set their own cookies: Google Analytics (performance); Vercel Analytics (performance); Supabase (authentication); and Google Fonts (functional). Each of these providers has their own privacy policies governing cookie use.`,
  },
  {
    title: "Managing Cookies",
    content: `You can control and manage cookies through your browser settings. Most browsers allow you to: view and delete individual cookies; block all cookies from all or specific sites; and receive a notification before cookies are placed.\n\nNote that disabling certain cookies may affect the functionality of AutoDrive AI, particularly login, saved preferences, and AI recommendations.`,
  },
  {
    title: "Your Cookie Preferences",
    content: `When you first visit AutoDrive AI, we display a cookie consent banner. You can choose to: accept all cookies; accept only essential cookies; or customize which categories of cookies you allow.\n\nYou can change your cookie preferences at any time by clicking "Cookie Settings" in the footer of our website.`,
  },
  {
    title: "Updates to This Policy",
    content: `We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make significant changes, we will notify you via a banner on the website or by email if you have an account.`,
  },
];

export default function CookiesPageClient() {
  return (
    <LegalPageLayout
      icon={<Cookie size={13} />}
      badge="Cookie Policy"
      badgeColor="border-amber-500/25 text-amber-400"
      title="Cookie Policy"
      lastUpdated="April 1, 2025"
      readTime="5 min"
      lead="This Cookie Policy explains how AutoDrive AI uses cookies and similar tracking technologies on our platform. It describes what cookies are, why we use them, and how you can control them."
      sections={SECTIONS}
    />
  );
}
