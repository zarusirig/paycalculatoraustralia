import type { Faq } from "./t3-shared";

// Shared by the page body and the FAQPage JSON-LD. Every statement traces to the
// FWC's Interim On-Demand Delivery Employee-like Worker Minimum Standards Order
// or the Fair Work Ombudsman's pages on it (read 5 October 2026); see
// lib/constants/delivery-minimum-pay.ts.

export const DELIVERY_DRIVER_FAQS: Faq[] = [
  {
    q: "What is the minimum pay rate for delivery drivers in Australia?",
    a: "From 17 August 2026 the Fair Work Commission's first Minimum Standards Order sets an hourly floor for on-demand delivery workers: $31.30 for people with no vehicle, on a pedal bike, an e-bike or an e-scooter, $31.50 on a motorcycle or petrol scooter, and $32 in a car or small van. From 1 January 2027 the rates rise to $31.80, $32 and $32.50.",
  },
  {
    q: "Does the $31.30 an hour apply to DoorDash and Uber Eats?",
    a: "The order covers workers engaged through an app run by a digital labour platform operator to mainly collect food, drink, alcohol or groceries and deliver them as soon as possible. DoorDash, Uber Eats and similar food and grocery delivery apps are the kind of platform the order is aimed at, but coverage turns on the work you do for the platform. If you are unsure, ask the platform or call the Fair Work Infoline on 13 13 94.",
  },
  {
    q: "Is the delivery minimum paid per hour logged in or per hour on a delivery?",
    a: "Per hour of engaged time, not time logged in. Engaged time runs from when you accept an order until you complete it, as recorded in the app. Waiting for an order to come in, and time you choose to take away from the app, is not engaged time and is not paid under the floor.",
  },
  {
    q: "Is the $31.30 before or after expenses?",
    a: "Before. The order says the delivery worker pays for their own vehicle, registration, fuel and running costs, repairs, insurance, licences and any fines, so the hourly rate is not a take-home figure. Your costs and tax come out of it.",
  },
  {
    q: "How does the top-up work if my payout is under the floor?",
    a: "The platform multiplies your hours of engaged time in the earnings period by the hourly rate for your vehicle. If what it paid you is less, it must pay the difference as a top-up in the next earnings period or within 7 days after that period. An earnings period can be up to 21 days.",
  },
  {
    q: "What time does not count as engaged time?",
    a: "Time after a customer has cancelled and you have been told (apart from returning items the platform requires), time after you abandon the engagement, time lost to breakdowns, accidents or breaks, and non-engaged time. Non-engaged time covers unreasonable delays or routes, such as a stop of more than 5 minutes unrelated to the delivery, and only counts against you after the platform has issued two notifications with its evidence.",
  },
  {
    q: "Do tips count towards the minimum?",
    a: "The order text does not say, and we have not found official guidance that does. It says you must be paid no less overall than the earnings floor for the period. Check your platform's earnings statement to see how it treats tips and ask the Fair Work Infoline on 13 13 94 if it is unclear.",
  },
  {
    q: "Do delivery riders get super, sick leave or annual leave?",
    a: "The order sets minimum pay and a set of conditions, including a right to unpaid time away, dispute resolution, insurance and record-keeping. It does not turn contractors into employees, and it does not give them annual leave or sick leave. If you are a true employee of a restaurant, you are paid under an award and get those entitlements instead.",
  },
  {
    q: "Do delivery drivers need an ABN and to register for GST?",
    a: "Delivery workers who are independent contractors usually work under an ABN. GST registration is only required once your GST turnover reaches $75,000, which is different from rideshare driving where registration is required from the first trip. Report all delivery income in your tax return either way.",
  },
  {
    q: "When do the delivery minimum rates go up?",
    a: "The order sets higher rates from 1 January 2027, then adjusts them from 1 January 2028 and each year after by the percentage the Fair Work Commission adds to the National Minimum Wage in its annual wage review. The Commission will also review the order if it publishes a draft for the other last-mile delivery applications it is considering.",
  },
];
