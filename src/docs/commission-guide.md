# BaazarIQ - Marketplace Commission Guide

This document explains all commission rates, closing fees and shipping fees
used in the BaazarIQ Marketplace Commission Calculator.

All rates are managed via the `.env` file so they can be updated without
editing any code. See the `.env` file in the root of the project.

---

## How to Update Commission Rates

1. Open the `.env` file in the root of the project
2. Find the variable you want to update
3. Change the value
4. Save the file
5. Restart the development server with `npm start`

---

## Amazon Commission Rates

Amazon charges a referral fee as a percentage of the selling price.
Rates vary by product category.


|
 Category 
|
 Commission % 
|
 Closing Fee 
|
 Shipping Fee 
|
|
---
|
---
|
---
|
---
|
|
 Fashion 
|
 15% 
|
 Rs.30 
|
 Rs.50 
|
|
 Electronics 
|
 8% 
|
 Rs.30 
|
 Rs.50 
|
|
 Beauty and Personal Care 
|
 10% 
|
 Rs.30 
|
 Rs.50 
|
|
 Home and Kitchen 
|
 12% 
|
 Rs.30 
|
 Rs.50 
|
|
 Sports and Outdoors 
|
 11% 
|
 Rs.30 
|
 Rs.50 
|
|
 Books and Stationery 
|
 6% 
|
 Rs.14 
|
 Rs.50 
|
|
 Toys and Baby 
|
 13% 
|
 Rs.30 
|
 Rs.50 
|
|
 Health and Wellness 
|
 9% 
|
 Rs.30 
|
 Rs.50 
|
|
 Automotive 
|
 9% 
|
 Rs.30 
|
 Rs.50 
|

### Amazon Environment Variables

REACT_APP_AMAZON_COMMISSION_DEFAULT=0.15
REACT_APP_AMAZON_COMMISSION_ELECTRONICS=0.08
REACT_APP_AMAZON_COMMISSION_FASHION=0.15
REACT_APP_AMAZON_COMMISSION_BOOKS=0.06
REACT_APP_AMAZON_SHIPPING_FEE=50
REACT_APP_AMAZON_CLOSING_FEE=30


### Amazon Commission Notes

- Electronics: 8% for most electronics. Mobile phones may have different rates.
- Fashion: 15% for clothing and apparel above Rs.1000. Below Rs.1000 may be lower.
- Books: Lower commission at 6% with lower closing fee of Rs.14.
- GST at 18% is charged on all Amazon fees (referral + closing + shipping).
- Closing fee varies by price slab:
  - Below Rs.250: Rs.14
  - Rs.250 to Rs.500: Rs.20
  - Rs.500 to Rs.1000: Rs.30
  - Above Rs.1000: Rs.40

---

## Flipkart Commission Rates

Flipkart charges a referral fee similar to Amazon but with slightly different
rates per category.

| Category | Commission % | Closing Fee | Shipping Fee |
|---|---|---|---|
| Fashion | 18% | Rs.35 | Rs.45 |
| Electronics | 9% | Rs.35 | Rs.45 |
| Beauty and Personal Care | 12% | Rs.35 | Rs.45 |
| Home and Kitchen | 14% | Rs.35 | Rs.45 |
| Sports and Outdoors | 13% | Rs.35 | Rs.45 |
| Books and Stationery | 7% | Rs.16 | Rs.45 |
| Toys and Baby | 15% | Rs.35 | Rs.45 |
| Health and Wellness | 10% | Rs.35 | Rs.45 |
| Automotive | 10% | Rs.35 | Rs.45 |

### Flipkart Environment Variables

REACT_APP_FLIPKART_COMMISSION_DEFAULT=0.18
REACT_APP_FLIPKART_COMMISSION_ELECTRONICS=0.09
REACT_APP_FLIPKART_COMMISSION_FASHION=0.18
REACT_APP_FLIPKART_SHIPPING_FEE=45
REACT_APP_FLIPKART_CLOSING_FEE=35


### Flipkart Commission Notes

- Fashion has highest commission at 18% on Flipkart.
- Electronics is slightly higher than Amazon at 9% vs 8%.
- Closing fee is flat Rs.35 for most categories.
- GST at 18% is charged on all Flipkart fees.

---

## Meesho Commission Rates

Meesho charges zero commission on most categories making it the most
affordable platform for sellers with tight margins.

| Category | Commission % | Closing Fee | Shipping Fee |
|---|---|---|---|
| Fashion | 0% | Rs.0 | Rs.0 |
| Electronics | 2% | Rs.10 | Rs.0 |
| Beauty and Personal Care | 0% | Rs.0 | Rs.0 |
| Home and Kitchen | 0% | Rs.0 | Rs.0 |
| Sports and Outdoors | 1% | Rs.0 | Rs.0 |
| Books and Stationery | 0% | Rs.0 | Rs.0 |
| Toys and Baby | 0% | Rs.0 | Rs.0 |
| Health and Wellness | 0% | Rs.0 | Rs.0 |
| Automotive | 1% | Rs.0 | Rs.0 |

### Meesho Environment Variables

REACT_APP_MEESHO_COMMISSION_DEFAULT=0.0
REACT_APP_MEESHO_COMMISSION_FASHION=0.0
REACT_APP_MEESHO_COMMISSION_ELECTRONICS=0.02
REACT_APP_MEESHO_SHIPPING_FEE=0
REACT_APP_MEESHO_CLOSING_FEE=0


### Meesho Commission Notes

- Meesho charges zero commission on most categories.
- Shipping is handled by Meesho at no extra charge to sellers.
- Electronics has a small 2% commission.
- Payment timeline is 14 days vs 7 days for Amazon and Flipkart.
- Return rate is highest at 15% - factor this into profit calculations.

---

## Jiomart Commission Rates

Jiomart is backed by Reliance and is strongest for grocery and FMCG.
It has competitive rates and the lowest return rate at 7%.

| Category | Commission % | Closing Fee | Shipping Fee |
|---|---|---|---|
| Fashion | 12% | Rs.20 | Rs.40 |
| Electronics | 6% | Rs.20 | Rs.40 |
| Beauty and Personal Care | 8% | Rs.20 | Rs.40 |
| Home and Kitchen | 10% | Rs.20 | Rs.40 |
| Sports and Outdoors | 9% | Rs.20 | Rs.40 |
| Books and Stationery | 4% | Rs.10 | Rs.40 |
| Toys and Baby | 10% | Rs.20 | Rs.40 |
| Health and Wellness | 7% | Rs.20 | Rs.40 |
| Automotive | 7% | Rs.20 | Rs.40 |

### Jiomart Environment Variables

REACT_APP_JIOMART_COMMISSION_DEFAULT=0.12
REACT_APP_JIOMART_COMMISSION_ELECTRONICS=0.06
REACT_APP_JIOMART_COMMISSION_FASHION=0.12
REACT_APP_JIOMART_SHIPPING_FEE=40
REACT_APP_JIOMART_CLOSING_FEE=20


### Jiomart Commission Notes

- Jiomart has lowest closing fee at Rs.20 vs Rs.30-35 for Amazon and Flipkart.
- Electronics commission is lowest at 6%.
- Return rate is best at 7% making it reliable for inventory management.
- Platform is strongest in Western India and growing nationally.

---

## Platform Score Calculation

The Platform Score (out of 100) is calculated using a weighted formula:

| Factor | Weight | Source |
|---|---|---|
| Profit Margin | 40% | Calculated from inputs |
| Customer Reach | 25% | Fixed per platform |
| Trust Score | 20% | Fixed per platform |
| Return Rate | 10% | Fixed per platform |
| Payment Speed | 5% | Fixed per platform |

### Platform Scores (Fixed Values)

| Platform | Customer Reach | Trust Score | Return Rate | Payment Days |
|---|---|---|---|---|
| Amazon | 95/100 | 95/100 | 8% | 7 days |
| Flipkart | 80/100 | 85/100 | 10% | 7 days |
| Meesho | 55/100 | 60/100 | 15% | 14 days |
| Jiomart | 60/100 | 70/100 | 7% | 10 days |

---

## How to Verify Commission Rates

Commission rates change periodically. To verify current rates:

1. **Amazon**: Login to Seller Central at sellercentral.amazon.in
   Go to Help, search "Referral Fee Schedule"

2. **Flipkart**: Login to Seller Hub at seller.flipkart.com
   Go to Payments, then Fee Structure

3. **Meesho**: Login to Meesho Supplier Panel at supplier.meesho.com
   Go to Payments, then Commission Structure

4. **Jiomart**: Login to Jiomart Seller Portal
   Go to Help, then Fee Schedule

---

## GST on Marketplace Fees

All marketplaces charge 18% GST on their fees. This is calculated on:
- Referral Fee
- Closing Fee
- Shipping Fee (where applicable)

The GST amount is automatically included in all BaazarIQ calculator results.

---

*Last updated: January 2025*
*Maintained by: BaazarIQ Team*
*For questions: hello@baazariq.in*