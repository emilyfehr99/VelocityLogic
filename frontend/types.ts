import React from 'react';

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PricingTier {
  name: string;
  price: string;
  subtitle: string;
  features: string[];
  replaces: string;
  highlight?: boolean;
}

export interface ComparisonRow {
  feature: string;
  competitor: string;
  us: string;
}