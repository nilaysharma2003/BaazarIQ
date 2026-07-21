import React from "react";
import BlogLayout, { H2, H3, P, Tip, Warning, Table } from "./BlogLayout";

function UTMTrackingBlog() {
  return (
    <BlogLayout
      title="UTM Tracking Guide for Ecommerce Sellers in India"
      subtitle="Learn how to use UTM parameters to track which marketing channels drive the most sales for your ecommerce store and marketplace listings."
      category="Marketing"
      readTime="8 min"
      date="January 2025"
      relatedTools={[
        { href: "/utm", icon: "🔗", name: "UTM Builder", desc: "Generate UTM tracking URLs free" },
        { href: "/whatsapp", icon: "💬", name: "WhatsApp Link Generator", desc: "Create trackable WhatsApp links" },
      ]}
    >
      <H2>What is UTM Tracking?</H2>
      <P>
        UTM (Urchin Tracking Module) parameters are tags added to URLs that help you track where
        your website visitors and customers come from. When someone clicks your UTM-tagged link,
        Google Analytics records exactly which source, medium and campaign brought them to your store.
      </P>
      <P>
        For Indian ecommerce sellers who run ads on Google, Facebook, Instagram and WhatsApp,
        UTM tracking is essential to understand which channels are actually driving sales and
        which are wasting your marketing budget.
      </P>

      <H2>The 5 UTM Parameters Explained</H2>
      <Table
        headers={["Parameter", "What it Tracks", "Example"]}
        rows={[
          ["utm_source", "Where traffic comes from", "google, facebook, instagram"],
          ["utm_medium", "Type of marketing channel", "cpc, email, social, organic"],
          ["utm_campaign", "Name of your campaign", "diwali_sale_2025"],
          ["utm_term", "Paid search keyword (optional)", "running_shoes_india"],
          ["utm_content", "Which ad or link (optional)", "banner_v1, cta_button"],
        ]}
      />

      <H2>Why UTM Tracking Matters for Ecommerce</H2>
      <H3>Know Which Channel Drives Sales</H3>
      <P>
        Without UTM tracking, you know your store got 1000 visitors but you don't know if they
        came from your Instagram ad, your WhatsApp broadcast or your Google search campaign.
        UTM parameters tell you exactly which source each visitor came from.
      </P>
      <P>
        This lets you double down on channels that work and stop spending on channels that don't.
        For sellers spending Rs.10,000 to Rs.1 lakh per month on ads, this data can save lakhs
        of rupees in wasted ad spend annually.
      </P>

      <H3>Calculate Actual ROI Per Channel</H3>
      <P>
        When UTM data is combined with your sales data in Google Analytics, you can calculate
        the exact return on investment for every marketing channel. You might discover that
        your Instagram ads give 5x ROI while your Google ads give only 2x ROI.
      </P>
      <Tip>
        Set up Google Analytics 4 (GA4) on your website or store before creating UTM links.
        UTM data only appears in analytics tools - the links work without analytics but you
        won't be able to see the tracking data.
      </Tip>

      <H2>How to Create UTM Links</H2>
      <H3>Manual Method</H3>
      <P>
        You can manually add UTM parameters to any URL by appending them after a question mark.
        For example to track traffic from an Instagram post for your Diwali sale campaign:
      </P>
      <div style={{ background: "#0f172a", borderRadius: 10, padding: "16px 20px", marginBottom: 20, fontFamily: "monospace", fontSize: 12, color: "#35d0b2", lineHeight: 1.8, wordBreak: "break-all" }}>
        https://yourstore.com/product?utm_source=instagram&utm_medium=social&utm_campaign=diwali_sale_2025
      </div>

      <H3>Using BaazarIQ UTM Builder</H3>
      <P>
        Building UTM links manually is time-consuming and error-prone. Our free UTM Builder
        lets you create properly formatted UTM links in seconds. Just enter your URL, select
        your platform from presets like Google, Facebook or Instagram, name your campaign
        and copy the generated link.
      </P>
      <Tip>
        Always use lowercase and underscores in UTM parameters. Google Analytics 4 is case
        sensitive so "Instagram" and "instagram" appear as two separate sources in your reports.
      </Tip>

      <H2>UTM Best Practices for Indian Ecommerce Sellers</H2>

      <H3>1. Create a Naming Convention and Stick to It</H3>
      <P>
        Decide on a consistent naming format before you start creating UTM links. For example
        always use platform name for source (google, facebook, instagram), channel type for
        medium (cpc, social, email) and campaign description with date for campaign name
        (diwali_sale_oct2025).
      </P>
      <Table
        headers={["Platform", "utm_source", "utm_medium", "utm_campaign example"]}
        rows={[
          ["Google Ads", "google", "cpc", "diwali_search_oct2025"],
          ["Facebook Ads", "facebook", "paid_social", "diwali_fb_oct2025"],
          ["Instagram Ads", "instagram", "paid_social", "diwali_ig_oct2025"],
          ["WhatsApp Broadcast", "whatsapp", "messaging", "diwali_wa_oct2025"],
          ["Email Newsletter", "newsletter", "email", "diwali_email_oct2025"],
          ["Instagram Bio Link", "instagram", "organic_social", "bio_link"],
          ["YouTube Video", "youtube", "video", "product_review_oct2025"],
        ]}
      />

      <H3>2. Use utm_content to Track Ad Variations</H3>
      <P>
        If you are running A/B tests on your ads, use utm_content to differentiate between
        variations. For example utm_content=image_v1 and utm_content=image_v2 lets you see
        which creative drives more traffic and conversions.
      </P>

      <H3>3. Never Use Spaces in UTM Parameters</H3>
      <P>
        Spaces in UTM parameters break URLs and create tracking errors. Always use underscores
        or hyphens instead of spaces. Our UTM Builder automatically warns you if spaces are
        detected in any parameter.
      </P>
      <Warning>
        Never use special characters like and, hash, equals or question mark in UTM parameter
        values as these break the URL structure. Stick to letters, numbers, underscores and hyphens.
      </Warning>

      <H3>4. Track WhatsApp Marketing with UTM</H3>
      <P>
        WhatsApp is one of the most effective marketing channels for Indian ecommerce sellers
        but it is often the hardest to track. By adding UTM parameters to links you share in
        WhatsApp broadcasts, you can measure exactly how much traffic and revenue comes from
        your WhatsApp marketing.
      </P>
      <P>
        Use our WhatsApp Link Generator with UTM parameters built in to create trackable
        WhatsApp click-to-chat links for your business.
      </P>

      <H3>5. Shorten Long UTM URLs</H3>
      <P>
        UTM URLs can get very long and look unprofessional in social media posts. Use a URL
        shortener like bit.ly to shorten them before sharing. The tracking still works perfectly
        through the redirect.
      </P>

      <H2>Reading UTM Data in Google Analytics 4</H2>
      <P>
        Once your UTM links are live and getting clicks, you can see the data in GA4 under
        Reports, Acquisition, Traffic Acquisition. You will see columns for Session Source,
        Session Medium and Session Campaign which correspond directly to your UTM parameters.
      </P>
      <Table
        headers={["GA4 Report", "What You See", "UTM Parameter"]}
        rows={[
          ["Session Source", "google, facebook, instagram", "utm_source"],
          ["Session Medium", "cpc, social, email", "utm_medium"],
          ["Session Campaign", "diwali_sale_2025", "utm_campaign"],
          ["Session Manual Term", "running_shoes", "utm_term"],
          ["Session Manual Ad Content", "banner_v1", "utm_content"],
        ]}
      />

      <H2>Common UTM Tracking Mistakes</H2>
      <Table
        headers={["Mistake", "Problem", "Fix"]}
        rows={[
          ["Using capitals in parameters", "Duplicate sources in GA4", "Always use lowercase"],
          ["Spaces in campaign names", "Broken URLs", "Use underscores instead"],
          ["No UTM on paid ads", "Cannot measure ROI", "Always tag paid links"],
          ["Same campaign name for all ads", "Cannot compare ads", "Use unique campaign names"],
          ["Not tracking WhatsApp links", "Missing revenue attribution", "Add UTM to all WA links"],
        ]}
      />

      <H2>Conclusion</H2>
      <P>
        UTM tracking is one of the most powerful and free tools available to Indian ecommerce
        sellers. It takes less than 5 minutes to set up but gives you data that can save lakhs
        of rupees in wasted advertising spend by showing you exactly which channels drive sales.
      </P>
      <P>
        Start using UTM parameters on every link you share - Google ads, Facebook posts,
        Instagram bio, WhatsApp broadcasts and email campaigns. Use our free UTM Builder
        to generate properly formatted links in seconds with no sign-up required.
      </P>
    </BlogLayout>
  );
}

export default UTMTrackingBlog;