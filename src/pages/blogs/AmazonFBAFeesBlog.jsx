import React from "react";
import BlogLayout, { H2, H3, P, Tip, Warning, Table } from "./BlogLayout";

function AmazonFBAFeesBlog() {
  return (
    <BlogLayout
      title="How to Calculate Amazon FBA Fees in India"
      subtitle="A complete guide to understanding Amazon FBA referral fees, closing fees, shipping charges and GST for Indian sellers."
      category="Amazon FBA"
      readTime="8 min"
      date="January 2025"
      relatedTools={[
        { href: "/fba", icon: "📦", name: "Amazon FBA Calculator", desc: "Calculate your exact FBA profit" },
        { href: "/commission", icon: "💰", name: "Marketplace Commission", desc: "Compare all marketplaces" },
      ]}
    >
      <H2>What is Amazon FBA?</H2>
      <P>
        Fulfillment by Amazon (FBA) is a service where Amazon stores your products in their warehouses,
        picks and packs orders, and handles delivery to customers. As a seller, you send your inventory
        to Amazon and they handle everything else - including customer service and returns.
      </P>
      <P>
        For Indian sellers on Amazon.in, FBA is one of the most popular fulfillment options because it
        gives your products the Prime badge, faster delivery, and access to Amazon's massive customer base.
      </P>

      <H2>Types of Amazon FBA Fees in India</H2>
      <P>Amazon charges several types of fees for FBA sellers in India. Understanding each one is critical
        to calculating your actual profit before listing a product.</P>

      <H3>1. Referral Fee</H3>
      <P>
        The referral fee is a percentage of the selling price that Amazon charges for every sale.
        This varies by product category and is the biggest fee for most sellers.
      </P>
      <Table
        headers={["Category", "Referral Fee %", "Example (Rs.1000 product)"]}
        rows={[
          ["Fashion and Apparel", "15%", "Rs.150"],
          ["Electronics", "8%", "Rs.80"],
          ["Home and Kitchen", "12%", "Rs.120"],
          ["Beauty and Personal Care", "10%", "Rs.100"],
          ["Books", "6%", "Rs.60"],
          ["Toys and Baby", "13%", "Rs.130"],
          ["Sports and Outdoors", "11%", "Rs.110"],
          ["Health and Wellness", "9%", "Rs.90"],
        ]}
      />

      <Warning>
        Amazon referral fees vary based on selling price slabs. For example in some categories,
        products priced below Rs.300 have a different commission rate than products above Rs.300.
        Always check the latest fee schedule on Amazon Seller Central.
      </Warning>

      <H3>2. Closing Fee</H3>
      <P>
        The closing fee is a flat per-item charge that Amazon deducts from every sale. It ranges
        from Rs.14 to Rs.40 depending on the selling price tier of your product.
      </P>
      <Table
        headers={["Selling Price Range", "Closing Fee"]}
        rows={[
          ["Below Rs.250", "Rs.14"],
          ["Rs.250 to Rs.500", "Rs.20"],
          ["Rs.500 to Rs.1000", "Rs.30"],
          ["Above Rs.1000", "Rs.40"],
        ]}
      />

      <H3>3. Shipping Fee (FBA Fulfillment Fee)</H3>
      <P>
        When you use FBA, Amazon charges a fulfillment fee for picking, packing and shipping your
        product. This is based on the weight and size of your product.
      </P>
      <Table
        headers={["Weight", "Local Zone", "Regional Zone", "National Zone"]}
        rows={[
          ["0-500 gm", "Rs.35", "Rs.45", "Rs.55"],
          ["500gm to 1kg", "Rs.45", "Rs.60", "Rs.75"],
          ["1kg to 2kg", "Rs.55", "Rs.75", "Rs.95"],
          ["Above 2kg (per kg)", "Rs.20", "Rs.25", "Rs.30"],
        ]}
      />

      <H3>4. GST on Fees</H3>
      <P>
        Amazon charges 18% GST on all its fees - referral fee, closing fee and fulfillment fee.
        This is an additional cost that many new sellers forget to include in their calculations.
      </P>
      <Tip>
        Always calculate GST on top of Amazon fees. If your total Amazon fees are Rs.200, you
        actually pay Rs.236 after 18% GST is added.
      </Tip>

      <H2>How to Calculate Your FBA Profit</H2>
      <P>Here is the simple formula to calculate your net profit on Amazon FBA:</P>
      <div style={{ background: "#0f172a", borderRadius: 10, padding: "16px 20px", marginBottom: 20, fontFamily: "monospace", fontSize: 13, color: "#35d0b2", lineHeight: 1.8 }}>
        <div>Net Profit = Selling Price</div>
        <div>- Referral Fee</div>
        <div>- Closing Fee</div>
        <div>- FBA Shipping Fee</div>
        <div>- GST on Fees (18%)</div>
        <div>- Product Cost (COGS)</div>
        <div>- Your Shipping Cost to Amazon</div>
      </div>

      <H2>Real Example: Calculating FBA Fees</H2>
      <P>
        Let's say you sell a Home and Kitchen product at Rs.999 with a product cost of Rs.350 and weight of 500gm.
      </P>
      <Table
        headers={["Fee Type", "Amount"]}
        rows={[
          ["Selling Price", "Rs.999"],
          ["Referral Fee (12%)", "Rs.119.88"],
          ["Closing Fee", "Rs.30"],
          ["FBA Shipping (Local)", "Rs.35"],
          ["GST on Fees (18%)", "Rs.33.22"],
          ["Total Amazon Fees", "Rs.218.10"],
          ["Product Cost", "Rs.350"],
          ["Net Profit", "Rs.430.90"],
          ["Profit Margin", "43.1%"],
        ]}
      />

      <Tip>
        Use our free Amazon FBA Calculator to instantly calculate all these fees without doing
        any manual math. Just enter your selling price, cost and weight and get results in seconds.
      </Tip>

      <H2>Tips to Maximize FBA Profit</H2>
      <H3>1. Keep weight under 500gm where possible</H3>
      <P>
        FBA shipping fees jump significantly above 500gm. If your product can be packaged
        lighter, you save on fulfillment costs per unit.
      </P>
      <H3>2. Price above Rs.500 for better margins</H3>
      <P>
        The closing fee is flat - Rs.30 on a Rs.500 product is 6% but only 3% on a Rs.1000 product.
        Higher priced products absorb closing fees better.
      </P>
      <H3>3. Check the referral fee for your exact category</H3>
      <P>
        Amazon has subcategories with different fee rates. A product listed under the wrong
        subcategory can cost you extra commission. Always verify on Amazon Seller Central.
      </P>
      <H3>4. Factor in storage fees for slow-moving products</H3>
      <P>
        Amazon charges monthly storage fees if your inventory sits in their warehouse for too long.
        For products that sell slowly, these costs can significantly eat into your margins.
      </P>

      <H2>FBA vs Self Ship vs Easy Ship</H2>
      <Table
        headers={["", "FBA", "Easy Ship", "Self Ship"]}
        rows={[
          ["Who ships?", "Amazon", "Amazon picks up from you", "You ship"],
          ["Prime Badge", "Yes", "Yes", "No"],
          ["Shipping Cost", "Higher", "Medium", "Lowest"],
          ["Storage", "Amazon warehouse", "Your warehouse", "Your warehouse"],
          ["Best for", "Fast-moving products", "Medium volume", "Heavy/slow products"],
        ]}
      />

      <Warning>
        FBA is not always the most profitable option. For heavy products or slow-moving inventory,
        Self Ship or Easy Ship may give you better margins. Always compare all options before choosing.
      </Warning>

      <H2>Conclusion</H2>
      <P>
        Understanding Amazon FBA fees is essential before listing any product. The combination of
        referral fee, closing fee, fulfillment fee and GST can add up to 20-30% of your selling
        price in some categories. Always calculate your exact profit before sourcing a product.
      </P>
      <P>
        Use our free Amazon FBA Calculator to get instant profit calculations with all fees
        included - no sign-up required.
      </P>
    </BlogLayout>
  );
}

export default AmazonFBAFeesBlog;