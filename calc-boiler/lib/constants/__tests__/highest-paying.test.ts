import assert from "node:assert/strict";
import { test } from "node:test";

import { OCCUPATIONS } from "../../data/job-pay-rates";
import { ALL_OCCUPATIONS_MEDIAN_WEEKLY, rankedJobs } from "../highest-paying";

test("ranking is sorted by median weekly pay, highest first, ranks 1..n", () => {
  const jobs = rankedJobs();
  assert.ok(jobs.length >= 40);
  jobs.forEach((j, i) => assert.equal(j.rank, i + 1));
  for (let i = 1; i < jobs.length; i++) assert.ok(jobs[i - 1].medianWeekly >= jobs[i].medianWeekly);
});

test("every ranked job is an occupation page with a published median, nothing extra", () => {
  const jobs = rankedJobs();
  const withMedian = OCCUPATIONS.filter((o) => o.median !== null);
  assert.equal(jobs.length, withMedian.length);
  for (const j of jobs) {
    const occ = OCCUPATIONS.find((o) => o.slug === j.slug);
    assert.ok(occ?.median);
    assert.equal(j.medianWeekly, occ!.median!.medianWeekly);
  }
});

test("net is below gross and the take-home link is a real tax-on/take-home page path", () => {
  for (const j of rankedJobs()) {
    assert.ok(j.annualNet > 0 && j.annualNet < j.annualGross, j.slug);
    assert.equal(j.annualGross, j.medianWeekly * 52);
    assert.match(j.takeHomeHref, /^\/take-home-pay-on\/\d+\/$/);
  }
});

test("occupations that share an ANZSCO group are flagged as sharing a median", () => {
  const jobs = rankedJobs();
  const radiographer = jobs.find((j) => j.slug === "radiographer");
  assert.ok(radiographer?.sharesMedianWith.includes("Sonographer"));
  const nurse = jobs.find((j) => j.slug === "nurse");
  assert.equal(nurse?.sharesMedianWith.length, 0);
});

test("comparison with the all-occupations median", () => {
  const jobs = rankedJobs();
  const top = jobs[0];
  assert.equal(top.vsAllOccupations, Math.round((top.medianWeekly / ALL_OCCUPATIONS_MEDIAN_WEEKLY) * 100) / 100);
  assert.ok(top.vsAllOccupations > 1);
});
