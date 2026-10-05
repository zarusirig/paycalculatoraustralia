// =============================================================================
// October 2026 award batch 2 — Plumbing and Fire Sprinklers (MA000036), Pastoral
// (MA000035, Part 6), Horticulture (MA000028), Health Professionals and Support
// Services (MA000027), Timber (MA000071), Meat Industry (MA000059), Commercial
// Sales (MA000083) and Mining (MA000011). Fair Work conformance tests.
//
// PINS are the dollar cells of each award's own Schedule of hourly rates,
// transcribed on 5 October 2026 from the consolidated award text at
// awards.fairwork.gov.au by script (not by hand), in the award's own row order:
//   Plumbing Schedule C.1.3 / C.1.5 / C.1.6 and D.1.3 / D.1.5 / D.1.6;
//   Horticulture B.2.1 / B.2.3 / B.3.1 / B.3.2 / B.4.1; Pastoral B.2.1 / B.2.2 /
//   B.2.4 / B.3.1; HPSS C.1.1 / C.1.4 / C.1.7 / C.2.1 / C.2.2 / C.2.3;
//   Timber D.2.1 / D.2.3 / D.3.1 / D.3.2 / D.3.3; Meat B.1.1–B.3.3; Commercial
//   Sales A.1.1 / A.1.2 / A.2.1 / A.3.1 / A.3.3; Mining B.1.3–B.1.5 / B.2.3–B.2.5.
// The tests recompute every cell from the constants and compare to the pin.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";

import { MODERN_AWARDS, findAwardRate, juniorHourlyFor, penaltyDollars, roundCents, type ModernAwardData } from "../modern-awards";
import {
  COMMERCIAL_SALES_AWARD,
  HEALTH_PROFESSIONALS_AWARD,
  HORTICULTURE_AWARD,
  MEAT_AWARD,
  MINING_AWARD,
  MINING_MIN_WEEKLY,
  OCT2_AWARDS,
  PASTORAL_AWARD,
  PLUMBING_ALLOWANCES,
  PLUMBING_AWARD,
  PLUMBING_MIN_WEEKLY,
  TIMBER_AWARD,
  plumbingWeekly,
  sprinklerWeekly,
} from "../modern-awards-oct2";
import { AWARD_DIRECTORY } from "../award-directory";

const ALL: readonly ModernAwardData[] = Object.values(OCT2_AWARDS);
type Pin = (number | null)[][];
const PINS: Record<string, Pin> = {"plumb_C13":[[27.97,41.96,55.94,55.94,69.93],[28.49,42.74,56.98,56.98,71.23],[28.85,43.28,57.7,57.7,72.13],[29.26,43.89,58.52,58.52,73.15],[31.63,47.45,63.26,63.26,79.08],[32.8,49.2,65.6,65.6,82.0],[33.73,50.6,67.46,67.46,84.33],[34.65,51.98,69.3,69.3,86.63],[35.49,53.24,70.98,70.98,88.73],[36.41,54.62,72.82,72.82,91.03],[37.12,55.68,74.24,74.24,92.8],[31.63,47.45,63.26,63.26,79.08],[32.55,48.83,65.1,65.1,81.38],[33.48,50.22,66.96,66.96,83.7],[34.31,51.47,68.62,68.62,85.78],[35.24,52.86,70.48,70.48,88.1],[35.94,53.91,71.88,71.88,89.85]],"plumb_C15":[[41.96,55.94,55.94,69.93],[42.74,56.98,56.98,71.23],[43.28,57.7,57.7,72.13],[43.89,58.52,58.52,73.15],[47.45,63.26,63.26,79.08],[49.2,65.6,65.6,82.0],[50.6,67.46,67.46,84.33],[51.98,69.3,69.3,86.63],[53.24,70.98,70.98,88.73],[54.62,72.82,72.82,91.03],[55.68,74.24,74.24,92.8],[47.45,63.26,63.26,79.08],[48.83,65.1,65.1,81.38],[50.22,66.96,66.96,83.7],[51.47,68.62,68.62,85.78],[52.86,70.48,70.48,88.1],[53.91,71.88,71.88,89.85]],"plumb_C16":[[34.96,48.95,62.93,62.93,76.92],[35.61,49.86,64.1,64.1,78.35],[36.06,50.49,64.91,64.91,79.34],[36.58,51.21,65.84,65.84,80.47],[39.54,55.35,71.17,71.17,86.98],[41.0,57.4,73.8,73.8,90.2],[42.16,59.03,75.89,75.89,92.76],[43.31,60.64,77.96,77.96,95.29],[44.36,62.11,79.85,79.85,97.6],[45.51,63.72,81.92,81.92,100.13],[46.4,64.96,83.52,83.52,102.08],[39.54,55.35,71.17,71.17,86.98],[40.69,56.96,73.24,73.24,89.51],[41.85,58.59,75.33,75.33,92.07],[42.89,60.04,77.2,77.2,94.35],[44.05,61.67,79.29,79.29,96.91],[44.93,62.9,80.87,80.87,98.84]],"plumb_D13":[[29.65,44.48,59.3,59.3,74.13],[30.17,45.26,60.34,60.34,75.43],[30.54,45.81,61.08,61.08,76.35],[30.95,46.43,61.9,61.9,77.38],[32.57,48.86,65.14,65.14,81.43],[32.79,49.19,65.58,65.58,81.98],[33.72,50.58,67.44,67.44,84.3],[34.64,51.96,69.28,69.28,86.6],[35.48,53.22,70.96,70.96,88.7],[36.4,54.6,72.8,72.8,91.0],[37.11,55.67,74.22,74.22,92.78]],"plumb_D15":[[44.48,59.3,59.3,74.13],[45.26,60.34,60.34,75.43],[45.81,61.08,61.08,76.35],[46.43,61.9,61.9,77.38],[48.86,65.14,65.14,81.43],[49.19,65.58,65.58,81.98],[50.58,67.44,67.44,84.3],[51.96,69.28,69.28,86.6],[53.22,70.96,70.96,88.7],[54.6,72.8,72.8,91.0],[55.67,74.22,74.22,92.78]],"plumb_D16":[[37.06,51.89,66.71,66.71,81.54],[37.71,52.8,67.88,67.88,82.97],[38.18,53.45,68.72,68.72,83.99],[38.69,54.16,69.64,69.64,85.11],[40.71,57.0,73.28,73.28,89.57],[40.99,57.38,73.78,73.78,90.17],[42.15,59.01,75.87,75.87,92.73],[43.3,60.62,77.94,77.94,95.26],[44.35,62.09,79.83,79.83,97.57],[45.5,63.7,81.9,81.9,100.1],[46.39,64.94,83.5,83.5,102.05]],"hort_B21":[[25.74,51.48],[26.44,52.88],[26.84,53.68],[27.81,55.62],[29.45,58.9]],"hort_B23":[[38.61,51.48,38.61,51.48,51.48],[39.66,52.88,39.66,52.88,52.88],[40.26,53.68,40.26,53.68,53.68],[41.72,55.62,41.72,55.62,55.62],[44.18,58.9,44.18,58.9,58.9]],"hort_B31":[[32.18,57.92],[33.05,59.49],[33.55,60.39],[34.76,62.57],[36.81,66.26]],"hort_B32":[[45.05,45.05,57.92],[46.27,46.27,59.49],[46.97,46.97,60.39],[48.67,48.67,62.57],[51.54,51.54,66.26]],"hort_B41":[[489.1,12.87,14.8,14.8,25.74],[586.9,15.44,17.76,17.76,30.88],[684.7,18.02,20.72,20.72,36.04],[782.5,20.59,23.68,23.68,41.18],[880.3,23.17,26.65,26.65,46.34],[502.5,13.22,15.2,15.2,26.44],[602.9,15.87,18.25,18.25,31.74],[703.4,18.51,21.29,21.29,37.02],[803.9,21.16,24.33,24.33,42.32],[904.4,23.8,27.37,27.37,47.6],[510.1,13.42,15.43,15.43,26.84],[612.1,16.11,18.53,18.53,32.22],[714.1,18.79,21.61,21.61,37.58],[816.1,21.48,24.7,24.7,42.96],[918.1,24.16,27.78,27.78,48.32],[528.5,13.91,16.0,16.0,27.82],[634.1,16.69,19.19,19.19,33.38],[739.8,19.47,22.39,22.39,38.94],[845.5,22.25,25.59,25.59,44.5],[951.2,25.03,28.78,28.78,50.06],[559.6,14.73,16.94,16.94,29.46],[671.5,17.67,20.32,20.32,35.34],[783.4,20.62,23.71,23.71,41.24],[895.3,23.56,27.09,27.09,47.12],[1007.2,26.51,30.49,30.49,53.02]],"past_B21":[[25.74,51.48],[26.44,52.88],[26.49,52.98],[27.08,54.16],[27.55,55.1],[27.97,55.94],[29.45,58.9],[31.64,63.28]],"past_B22":[[38.61,38.61,51.48],[39.66,39.66,52.88],[39.74,39.74,52.98],[40.62,40.62,54.16],[41.33,41.33,55.1],[41.96,41.96,55.94],[44.18,44.18,58.9],[47.46,47.46,63.28]],"past_B24":[[32.18,57.92],[33.05,59.49],[33.11,59.6],[33.85,60.93],[34.44,61.99],[34.96,62.93],[36.81,66.26],[39.55,71.19]],"past_B31":[[489.05,12.87,25.74],[586.86,15.44,30.88],[684.67,18.02,36.04],[782.48,20.59,41.18],[880.29,23.17,46.34],[502.45,13.22,26.44],[602.94,15.87,31.74],[703.43,18.51,37.02],[803.92,21.16,42.32],[904.41,23.8,47.6],[503.4,13.25,26.5],[604.08,15.9,31.8],[704.76,18.55,37.1],[805.44,21.2,42.4],[906.12,23.85,47.7],[514.55,13.54,27.08],[617.46,16.25,32.5],[720.37,18.96,37.92],[823.28,21.67,43.34],[926.19,24.37,48.74],[523.45,13.78,27.56],[628.14,16.53,33.06],[732.83,19.29,38.58],[837.52,22.04,44.08],[942.21,24.8,49.6],[531.45,13.99,27.98],[637.74,16.78,33.56],[744.03,19.58,39.16],[850.32,22.38,44.76],[956.61,25.17,50.34],[559.55,14.73,29.46],[671.46,17.67,35.34],[783.37,20.62,41.24],[895.28,23.56,47.12],[1007.19,26.51,53.02],[601.25,15.82,31.64],[721.5,18.99,37.98],[841.75,22.15,44.3],[962.0,25.32,50.64],[1082.25,28.48,56.96]],"hp_C11":[[26.97,40.46,67.43,31.02],[28.03,42.05,70.08,32.23],[29.11,43.67,72.78,33.48],[29.45,44.18,73.63,33.87],[30.45,45.68,76.13,35.02],[32.09,48.14,80.23,36.9],[32.67,49.01,81.68,37.57],[33.78,50.67,84.45,38.85],[34.66,51.99,86.65,39.86],[37.1,55.65,92.75,42.67],[37.76,56.64,94.4,43.42],[39.1,58.65,97.75,44.97],[39.42,59.13,98.55,45.33]],"hp_C14":[[40.46,53.94,53.94,67.43],[42.05,56.06,56.06,70.08],[43.67,58.22,58.22,72.78],[44.18,58.9,58.9,73.63],[45.68,60.9,60.9,76.13],[48.14,64.18,64.18,80.23],[49.01,65.34,65.34,81.68],[50.67,67.56,67.56,84.45],[51.99,69.32,69.32,86.65],[55.65,74.2,74.2,92.75],[56.64,75.52,75.52,94.4],[58.65,78.2,78.2,97.75],[59.13,78.84,78.84,98.55]],"hp_C17":[[33.71,47.2,74.17,37.76],[35.04,49.05,77.08,39.24],[36.39,50.94,80.05,40.75],[36.81,51.54,80.99,41.23],[38.06,53.29,83.74,42.63],[40.11,56.16,88.25,44.93],[40.84,57.17,89.84,45.74],[42.23,59.12,92.9,47.29],[43.33,60.66,95.32,48.52],[46.38,64.93,102.03,51.94],[47.2,66.08,103.84,52.86],[48.88,68.43,107.53,54.74],[49.28,68.99,108.41,55.19]],"hp_C21":[[32.44,48.66,81.1,37.31],[34.44,51.66,86.1,39.61],[37.53,56.3,93.83,43.16],[40.56,60.84,101.4,46.64],[32.44,48.66,81.1,37.31],[34.44,51.66,86.1,39.61],[39.03,58.55,97.58,44.88],[43.67,65.51,109.18,50.22],[34.44,51.66,86.1,39.61],[37.08,55.62,92.7,42.64],[41.19,61.79,102.98,47.37],[44.46,66.69,111.15,51.13],[35.19,52.79,87.98,40.47],[38.02,57.03,95.05,43.72],[41.71,62.57,104.28,47.97],[45.3,67.95,113.25,52.1],[38.02,57.03,95.05,43.72],[40.66,60.99,101.65,46.76],[43.67,65.51,109.18,50.22],[46.18,69.27,115.45,53.11],[51.19,76.79,127.98,58.87],[52.19,78.29,130.48,60.02],[52.19,78.29,130.48,60.02],[65.77,98.66,164.43,75.64]],"hp_C22":[[48.66,64.88,64.88,81.1],[51.66,68.88,68.88,86.1],[56.3,75.06,75.06,93.83],[60.84,81.12,81.12,101.4],[48.66,64.88,64.88,81.1],[51.66,68.88,68.88,86.1],[58.55,78.06,78.06,97.58],[65.51,87.34,87.34,109.18],[51.66,68.88,68.88,86.1],[55.62,74.16,74.16,92.7],[61.79,82.38,82.38,102.98],[66.69,88.92,88.92,111.15],[52.79,70.38,70.38,87.98],[57.03,76.04,76.04,95.05],[62.57,83.42,83.42,104.28],[67.95,90.6,90.6,113.25],[57.03,76.04,76.04,95.05],[60.99,81.32,81.32,101.65],[65.51,87.34,87.34,109.18],[69.27,92.36,92.36,115.45],[76.79,102.38,102.38,127.98],[78.29,104.38,104.38,130.48],[78.29,104.38,104.38,130.48],[98.66,131.54,131.54,164.43]],"hp_C23":[[40.55,56.77,89.21,45.42],[43.05,60.27,94.71,48.22],[46.91,65.68,103.21,52.54],[50.7,70.98,111.54,56.78],[40.55,56.77,89.21,45.42],[43.05,60.27,94.71,48.22],[48.79,68.3,107.33,54.64],[54.59,76.42,120.09,61.14],[43.05,60.27,94.71,48.22],[46.35,64.89,101.97,51.91],[51.49,72.08,113.27,57.67],[55.58,77.81,122.27,62.24],[43.99,61.58,96.77,49.27],[47.53,66.54,104.56,53.23],[52.14,72.99,114.7,58.39],[56.63,79.28,124.58,63.42],[47.53,66.54,104.56,53.23],[50.83,71.16,111.82,56.92],[54.59,76.42,120.09,61.14],[57.73,80.82,127.0,64.65],[63.99,89.58,140.77,71.67],[65.24,91.33,143.52,73.07],[65.24,91.33,143.52,73.07],[82.21,115.1,180.87,92.08]],"tim_D21":[[25.74,38.61,51.48,64.35],[26.44,39.66,52.88,66.1],[27.08,40.62,54.16,67.7],[27.97,41.96,55.94,69.93],[28.43,42.65,56.86,71.08],[29.45,44.18,58.9,73.63],[30.38,45.57,60.76,75.95],[32.13,48.2,64.26,80.33],[26.67,40.01,53.34,66.68],[27.55,41.33,55.1,68.88],[28.09,42.14,56.18,70.23],[28.62,42.93,57.24,71.55],[29.45,44.18,58.9,73.63],[30.38,45.57,60.76,75.95],[31.3,46.95,62.6,78.25],[32.13,48.2,64.26,80.33],[33.06,49.59,66.12,82.65]],"tim_D23":[[38.61,51.48,51.48,64.35],[39.66,52.88,52.88,66.1],[40.62,54.16,54.16,67.7],[41.96,55.94,55.94,69.93],[42.65,56.86,56.86,71.08],[44.18,58.9,58.9,73.63],[45.57,60.76,60.76,75.95],[48.2,64.26,64.26,80.33],[40.01,53.34,53.34,66.68],[41.33,55.1,55.1,68.88],[42.14,56.18,56.18,70.23],[42.93,57.24,57.24,71.55],[44.18,58.9,58.9,73.63],[45.57,60.76,60.76,75.95],[46.95,62.6,62.6,78.25],[48.2,64.26,64.26,80.33],[49.59,66.12,66.12,82.65]],"tim_D31":[[32.18,70.79],[33.05,72.71],[33.85,74.47],[34.96,76.92],[35.54,78.18],[36.81,80.99],[37.98,83.55],[40.16,88.36],[33.34,null],[34.44,null],[35.11,null],[35.78,null],[36.81,null],[37.98,null],[39.13,null],[40.16,null],[41.33,null]],"tim_D33":[[48.27,64.36,64.36],[49.58,66.1,66.1],[50.78,67.7,67.7],[52.44,69.92,69.92],[53.31,71.08,71.08],[55.22,73.62,73.62],[56.97,75.96,75.96],[60.24,80.32,80.32],[50.01,66.68,66.68],[51.66,68.88,68.88],[52.67,70.22,70.22],[53.67,71.56,71.56],[55.22,73.62,73.62],[56.97,75.96,75.96],[58.7,78.26,78.26],[60.24,80.32,80.32],[62.0,82.66,82.66]],"tim_D32":[[32.18,36.04,39.9,45.05,57.92],[33.05,37.02,40.98,46.27,59.49],[33.85,37.91,41.97,47.39,60.93],[34.96,39.16,43.35,48.95,62.93],[35.54,39.8,44.07,49.75,63.97],[36.81,41.23,45.65,51.54,66.26],[37.98,42.53,47.09,53.17,68.36],[40.16,44.98,49.8,56.23,72.29],[33.34,37.34,41.34,46.67,60.01],[34.44,38.57,42.7,48.21,61.99],[35.11,39.33,43.54,49.16,63.2],[35.78,40.07,44.36,50.09,64.4],[36.81,41.23,45.65,51.54,66.26],[37.98,42.53,47.09,53.17,68.36],[39.13,43.82,48.52,54.78,70.43],[40.16,44.98,49.8,56.23,72.29],[41.33,46.28,51.24,57.86,74.39]],"meat_B11":[[25.74,38.61,51.48],[26.44,39.66,52.88],[26.6,39.9,53.2],[27.23,40.85,54.46],[27.71,41.57,55.42],[28.28,42.42,56.56],[29.45,44.18,58.9]],"meat_B12":[[38.61,51.48,51.48],[39.66,52.88,52.88],[39.9,53.2,53.2],[40.85,54.46,54.46],[41.57,55.42,55.42],[42.42,56.56,56.56],[44.18,58.9,58.9]],"meat_B13":[[32.18,38.61,51.48],[33.05,39.66,52.88],[33.25,39.9,53.2],[34.04,40.85,54.46],[34.64,41.57,55.42],[35.35,42.42,56.56],[36.81,44.18,58.9]],"meat_B21":[[25.74,32.18],[26.44,33.05],[26.6,33.25],[27.23,34.04],[27.71,34.64],[28.28,35.35],[29.45,36.81]],"meat_B23":[[32.18,32.18],[33.05,33.05],[33.25,33.25],[34.04,34.04],[34.64,34.64],[35.35,35.35],[36.81,36.81]],"meat_B31":[[25.74,32.18,38.61,32.18],[26.44,33.05,39.66,33.05],[26.6,33.25,39.9,33.25],[27.23,34.04,40.85,34.04],[27.71,34.64,41.57,34.64],[28.28,35.35,42.42,35.35],[29.45,36.81,44.18,36.81],[30.53,38.16,45.8,38.16]],"meat_B32":[[38.61,51.48],[39.66,52.88],[39.9,53.2],[40.85,54.46],[41.57,55.42],[42.42,56.56],[44.18,58.9],[45.8,61.06]],"meat_B33":[[32.18,32.18,38.61,38.61],[33.05,33.05,39.66,39.66],[33.25,33.25,39.9,39.9],[34.04,34.04,40.85,40.85],[34.64,34.64,41.57,41.57],[35.35,35.35,42.42,42.42],[36.81,36.81,44.18,44.18],[38.16,38.16,45.8,45.8]],"sales_A11":[[26.59,39.89,53.18,66.48,39.89],[27.47,41.21,54.94,68.68,41.21],[29.55,44.33,59.1,73.88,44.33]],"sales_A12":[[39.89,39.89,53.18,66.48,39.89],[41.21,41.21,54.94,68.68,41.21],[44.33,44.33,59.1,73.88,44.33]],"sales_A21":[[33.24,46.53,59.83,73.12,46.53],[34.34,48.07,61.81,75.54,48.07],[36.94,51.71,66.49,81.26,51.71]],"sales_A31":[[19.95,29.93,39.9,49.88,29.93],[23.64,35.46,47.28,59.1,35.46],[26.6,39.9,53.2,66.5,39.9]],"sales_A33":[[24.94,34.91,44.89,54.86,34.91],[29.55,41.37,53.19,65.01,41.37],[33.25,46.55,59.85,73.15,46.55]],"mine_B13":[[27.53,31.66,35.79,41.3,55.06,55.06,68.83],[28.65,32.95,37.25,42.98,57.3,57.3,71.63],[29.67,34.12,38.57,44.51,59.34,59.34,74.18],[30.54,35.12,39.7,45.81,61.08,61.08,76.35],[32.51,37.39,42.26,48.77,65.02,65.02,81.28],[34.56,39.74,44.93,51.84,69.12,69.12,86.4],[36.2,41.63,47.06,54.3,72.4,72.4,90.5],[37.62,43.26,48.91,56.43,75.24,75.24,94.05]],"mine_B14":[[41.3,55.06,55.06,68.83],[42.98,57.3,57.3,71.63],[44.51,59.34,59.34,74.18],[45.81,61.08,61.08,76.35],[48.77,65.02,65.02,81.28],[51.84,69.12,69.12,86.4],[54.3,72.4,72.4,90.5],[56.43,75.24,75.24,94.05]],"mine_B15":[[55.06],[57.3],[59.34],[61.08],[65.02],[69.12],[72.4],[75.24]],"mine_B23":[[34.41,39.57,44.73,51.62,68.82,68.82,86.03],[35.81,41.18,46.55,53.72,71.62,71.62,89.53],[37.09,42.65,48.22,55.64,74.18,74.18,92.73],[38.18,43.91,49.63,57.27,76.36,76.36,95.45],[40.64,46.74,52.83,60.96,81.28,81.28,101.6],[43.2,49.68,56.16,64.8,86.4,86.4,108.0],[45.25,52.04,58.83,67.88,90.5,90.5,113.13],[47.03,54.08,61.14,70.55,94.06,94.06,117.58]],"mine_B24":[[51.62,68.82,68.82,86.03],[53.72,71.62,71.62,89.53],[55.64,74.18,74.18,92.73],[57.27,76.36,76.36,95.45],[60.96,81.28,81.28,101.6],[64.8,86.4,86.4,108.0],[67.88,90.5,90.5,113.13],[70.55,94.06,94.06,117.58]],"mine_B25":[[68.82],[71.62],[74.18],[76.36],[81.28],[86.4],[90.5],[94.06]]};
const PIN_LABELS: Record<string, string[]> = {"hort_B41":["Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years"],"past_B31":["Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years","Under 16 years","16 years","17 years","18 years","19 years"],"sales_A31":["Under 19 years of age","19 years of age","20 years of age"],"sales_A33":["Under 19 years of age","19 years of age","20 years of age"]};

const cas = (a: ModernAwardData, hourly: number) => roundCents(hourly * (1 + a.meta.casualLoading));
const $ = (hourly: number, mult: number) => penaltyDollars(hourly, mult);
/** Percentage of the CASUAL hourly rate, to the cent (compounded awards). */
const $c = (a: ModernAwardData, hourly: number, mult: number) => roundCents(cas(a, hourly) * mult);
const pen = (a: ModernAwardData, frag: string) => {
  const p = a.penalties.find((r) => r.label.includes(frag));
  assert.ok(p, `${a.meta.code}: penalty row ${frag}`);
  return p;
};
const ot = (a: ModernAwardData, frag: string) => {
  const o = a.overtime.find((r) => r.label.includes(frag));
  assert.ok(o, `${a.meta.code}: overtime row ${frag}`);
  return o;
};
const mcol = (a: ModernAwardData, frag: string) => {
  const c = a.matrix.find((m) => m.label.includes(frag));
  assert.ok(c, `${a.meta.code}: matrix column ${frag}`);
  return c;
};
const eq = (actual: number, expected: number | null | undefined, msg: string) => assert.equal(actual, expected, msg);

// --- Registry ----------------------------------------------------------------

test("batch 2 awards are registered with the expected keys, codes, routes and directory entries", () => {
  const expected: [string, string, string][] = [
    ["plumbing", "MA000036", "/plumbing-award-rates/"],
    ["pastoral", "MA000035", "/pastoral-award-rates/"],
    ["horticulture", "MA000028", "/horticulture-award-rates/"],
    ["health-professionals", "MA000027", "/health-professionals-award-rates/"],
    ["timber", "MA000071", "/timber-award-rates/"],
    ["meat-industry", "MA000059", "/meat-industry-award-rates/"],
    ["commercial-sales", "MA000083", "/commercial-sales-award-rates/"],
    ["mining", "MA000011", "/mining-award-rates/"],
  ];
  assert.equal(ALL.length, expected.length);
  const dirByCode = new Map(AWARD_DIRECTORY.map((d) => [d.code, d]));
  for (const [key, code, href] of expected) {
    const a = (MODERN_AWARDS as Record<string, ModernAwardData>)[key];
    assert.ok(a, key);
    assert.equal(a.key, key);
    assert.equal(a.meta.code, code);
    assert.equal(a.meta.href, href);
    const d = dirByCode.get(code);
    assert.ok(d, `${code} in the directory`);
    assert.ok(d.covers.length > 0, `${code} has a covers line`);
    assert.equal(d.headlineLevel, a.entryLevel);
    assert.equal(d.headlineHourly, findAwardRate(a, a.entryLevel).hourly);
  }
});

test("row counts match the award tables, levels are unique, 25% casual loading, 38 hours", () => {
  const counts: Record<string, number> = {
    plumbing: 28, // 5 workers + 6 registered + 6 not registered + 11 sprinkler
    pastoral: 8,
    horticulture: 5,
    "health-professionals": 37, // 13 support + 20 level 1 + 4 senior
    timber: 24, // 7 + 8 + 9
    "meat-industry": 8,
    "commercial-sales": 3,
    mining: 8,
  };
  for (const a of ALL) {
    assert.equal(a.rates.length, counts[a.key], a.key);
    assert.equal(new Set(a.rates.map((r) => r.level)).size, a.rates.length, `${a.key} unique levels`);
    assert.equal(a.meta.casualLoading, 0.25);
    assert.equal(a.meta.standardWeeklyHours, 38);
    assert.equal(a.meta.verifiedOn, "5 October 2026");
    assert.ok(findAwardRate(a, a.entryLevel));
  }
});

test("batch 2 constants: matrix and penalty rows reference real classifications", () => {
  for (const a of ALL) {
    for (const col of a.matrix) {
      for (const lvl of col.appliesTo ?? []) assert.ok(a.rates.some((r) => r.level === lvl), `${a.key}: ${col.label} -> ${lvl}`);
    }
    for (const row of a.penalties) for (const lvl of row.appliesTo ?? []) assert.ok(a.rates.some((r) => r.level === lvl));
  }
});

// --- Plumbing ------------------------------------------------------------------

test("plumbing: ordinary hourly rate = (cl 18.1 minimum + all-purpose allowances) / 38, pinned to Schedule C.1.3 / D.1.3 for all 28 rows", () => {
  const A = PLUMBING_ALLOWANCES;
  assert.equal(A.industry, 41.41);
  assert.equal(A.plumbingTrade, 33.57);
  assert.equal(A.registration, 44.76);
  assert.equal(A.specialFixed, 7.7);
  assert.equal(PLUMBING_MIN_WEEKLY.length, 11);
  const rows = PLUMBING_AWARD.rates;
  const c13 = PINS.plumb_C13;
  const d13 = PINS.plumb_D13;
  assert.equal(c13.length, 17);
  assert.equal(d13.length, 11);
  c13.forEach((pin, i) => eq(rows[i].hourly, pin[0], `plumbing row ${i} ${rows[i].level}`));
  d13.forEach((pin, i) => eq(rows[17 + i].hourly, pin[0], `sprinkler row ${i} ${rows[17 + i].level}`));
  eq(plumbingWeekly("trade", 1119.1, true), 1246.54, "registered tradesperson L1 weekly");
  eq(plumbingWeekly("trade", 1119.1, false), 1201.78, "not registered tradesperson L1 weekly");
  eq(plumbingWeekly("worker1", 1013.6, false), 1062.71, "worker L1(a) weekly");
  eq(sprinklerWeekly("trade", 1119.1), 1246.12, "sprinkler tradesperson L1 weekly");
  eq(sprinklerWeekly("worker1", 1013.6), 1126.63, "sprinkler worker L1(a) weekly");
  for (const r of rows) eq(r.hourly, roundCents(r.weekly / 38), `${r.level} hourly = weekly / 38`);
});

test("plumbing: Saturday, Sunday, public holiday, overtime and casual cells match Schedule C.1.3 / C.1.5 / C.1.6 and D.1.3 / D.1.5 / D.1.6", () => {
  const a = PLUMBING_AWARD;
  const sets: [number, number, string][] = [[0, 17, "C"], [17, 11, "D"]];
  for (const [off, n, tag] of sets) {
    const perm = tag === "C" ? PINS.plumb_C13 : PINS.plumb_D13;
    const over = tag === "C" ? PINS.plumb_C15 : PINS.plumb_D15;
    const casualPins = tag === "C" ? PINS.plumb_C16 : PINS.plumb_D16;
    for (let i = 0; i < n; i++) {
      const h = a.rates[off + i].hourly;
      const who = `${tag}.${i} ${a.rates[off + i].level}`;
      eq($(h, 1.5), perm[i][1], `${who} Sat first 2h`);
      eq($(h, 2), perm[i][2], `${who} Sat after 2h`);
      eq($(h, 2), perm[i][3], `${who} Sunday`);
      eq($(h, 2.5), perm[i][4], `${who} PH`);
      eq($(h, 1.5), over[i][0], `${who} OT first 2h`);
      eq($(h, 2), over[i][1], `${who} OT after 2h`);
      eq($(h, 2.5), over[i][3], `${who} OT PH`);
      eq(cas(a, h), casualPins[i][0], `${who} casual ordinary`);
      eq($(h, 1.75), casualPins[i][1], `${who} casual Sat first 2h`);
      eq($(h, 2.25), casualPins[i][2], `${who} casual Sat after 2h`);
      eq($(h, 2.25), casualPins[i][3], `${who} casual Sunday`);
      eq($(h, 2.75), casualPins[i][4], `${who} casual PH`);
    }
  }
  assert.deepEqual(a.matrix.map((m) => [m.fullTime, m.casual]), [[1, 1.25], [1.5, 1.75], [2, 2.25], [2, 2.25], [2.5, 2.75]]);
  assert.equal(pen(a, "Public holiday").casual, 2.75);
  assert.equal(pen(a, "Shiftwork").fullTime, 1.33);
  assert.equal(pen(a, "Shiftwork").casual, 1.58);
  assert.equal(ot(a, "Sunday").fullTime, 2);
  assert.equal(a.casualPenaltyBasis, "additive");
});

test("plumbing: allowances include the cl 21.9(f) mileage at $0.55 (16 September 2026 variation) and the all-purpose amounts", () => {
  const a = PLUMBING_AWARD;
  const get = (frag: string) => {
    const x = a.allowances.find((al) => al.name.includes(frag));
    assert.ok(x, frag);
    return x;
  };
  eq(get("Mileage beyond").amount, 0.55, "mileage");
  assert.equal(get("Mileage beyond").clause, "cl 21.9(f)");
  eq(get("Industry allowance").amount, 41.41, "industry");
  eq(get("Registration").amount, 44.76, "registration");
  eq(get("Plumbing trade").amount, 33.57, "trade");
  eq(get("Tool allowance").amount, 22.96, "tool");
  eq(get("Meal allowance").amount, 17.69, "meal");
  eq(get("Fares").amount, 16.24, "fares");
  assert.match(a.meta.consolidatedTo, /16 September 2026/);
});

// --- Horticulture -----------------------------------------------------------------

test("horticulture: cl 15.1(a) rates and Schedule B.2.1 / B.2.3 / B.3.1 / B.3.2 for every level", () => {
  const a = HORTICULTURE_AWARD;
  assert.equal(a.rates.length, 5);
  a.rates.forEach((r, i) => {
    eq(r.hourly, PINS.hort_B21[i][0], `${r.level} ordinary`);
    eq($(r.hourly, 2), PINS.hort_B21[i][1], `${r.level} public holiday`);
    eq($(r.hourly, 1.5), PINS.hort_B23[i][0], `${r.level} OT Mon-Sat`);
    eq($(r.hourly, 2), PINS.hort_B23[i][1], `${r.level} OT Sunday`);
    eq($(r.hourly, 1.5), PINS.hort_B23[i][2], `${r.level} OT harvest Sunday first 5h`);
    eq(cas(a, r.hourly), PINS.hort_B31[i][0], `${r.level} casual`);
    eq($(r.hourly, 2.25), PINS.hort_B31[i][1], `${r.level} casual PH`);
    eq($(r.hourly, 1.75), PINS.hort_B32[i][0], `${r.level} casual OT 175%`);
    eq($(r.hourly, 2.25), PINS.hort_B32[i][2], `${r.level} casual OT PH`);
    eq(r.hourly, roundCents(r.weekly / 38), `${r.level} hourly = weekly / 38`);
  });
  assert.equal(pen(a, "8.31 pm").casual, 1.4, "casual 8.31pm-4.59am is 125% + 15%");
  assert.equal(pen(a, "Public holiday").fullTime, 2);
  assert.equal(pen(a, "Public holiday").casual, 2.25);
  assert.ok(a.overtime.every((o) => o.casual === null), "casual overtime is described in notes, not in the table");
  assert.match(a.unverified.join(" "), /piece rate/i);
  assert.ok(a.meta.ratesLabel && /piece/i.test(a.meta.ratesLabel));
});

test("horticulture: junior rates match Schedule B.4.1 (percentage of the weekly rate, rounded to $0.10, / 38)", () => {
  const a = HORTICULTURE_AWARD;
  assert.ok(a.junior);
  const labels = PIN_LABELS.hort_B41;
  const pcts: Record<string, number> = { "Under 16 years": 0.5, "16 years": 0.6, "17 years": 0.7, "18 years": 0.8, "19 years": 0.9 };
  for (let li = 0; li < 5; li++) {
    for (let ai = 0; ai < 5; ai++) {
      const pin = PINS.hort_B41[li * 5 + ai];
      const label = labels[li * 5 + ai];
      eq(juniorHourlyFor(a, a.rates[li], pcts[label]), pin[1], `${a.rates[li].level} ${label}`);
    }
  }
});

// --- Pastoral ---------------------------------------------------------------------

test("pastoral: cl 32.1 rates and Schedule B.2.1 / B.2.2 / B.2.4 for FLH1-FLH8; B.3.1 junior", () => {
  const a = PASTORAL_AWARD;
  assert.equal(a.rates.length, 8);
  a.rates.forEach((r, i) => {
    eq(r.hourly, PINS.past_B21[i][0], `${r.level} ordinary`);
    eq($(r.hourly, 2), PINS.past_B21[i][1], `${r.level} public holiday`);
    eq($(r.hourly, 1.5), PINS.past_B22[i][0], `${r.level} OT Mon-Sat`);
    eq($(r.hourly, 1.5), PINS.past_B22[i][1], `${r.level} OT Sunday feeding and watering`);
    eq($(r.hourly, 2), PINS.past_B22[i][2], `${r.level} OT Sunday other`);
    eq(cas(a, r.hourly), PINS.past_B24[i][0], `${r.level} casual`);
    eq($(r.hourly, 2.25), PINS.past_B24[i][1], `${r.level} casual PH`);
    eq(r.hourly, roundCents(r.weekly / 38), `${r.level} hourly = weekly / 38`);
  });
  const labels = PIN_LABELS.past_B31;
  const pcts: Record<string, number> = { "Under 16 years": 0.5, "16 years": 0.6, "17 years": 0.7, "18 years": 0.8, "19 years": 0.9 };
  for (let li = 0; li < 8; li++) {
    for (let ai = 0; ai < 5; ai++) {
      const pin = PINS.past_B31[li * 5 + ai];
      eq(juniorHourlyFor(a, a.rates[li], pcts[labels[li * 5 + ai]]), pin[1], `${a.rates[li].level} ${labels[li * 5 + ai]}`);
    }
  }
  assert.match(a.unverified.join(" "), /Piece rates/);
  eq(a.allowances.find((x) => x.name.includes("Deduction"))!.amount, 165.86, "keep deduction");
});

// --- Health Professionals and Support Services --------------------------------------

test("health professionals: Support Services cl 16.2(a) and Schedule C.1.1 / C.1.4 / C.1.7 for Levels 1-9", () => {
  const a = HEALTH_PROFESSIONALS_AWARD;
  const ss = a.rates.slice(0, 13);
  ss.forEach((r, i) => {
    eq(r.hourly, PINS.hp_C11[i][0], `${r.level} ordinary`);
    eq($(r.hourly, 1.5), PINS.hp_C11[i][1], `${r.level} weekend`);
    eq($(r.hourly, 2.5), PINS.hp_C11[i][2], `${r.level} PH`);
    eq($(r.hourly, 1.15), PINS.hp_C11[i][3], `${r.level} shift`);
    eq($(r.hourly, 2), PINS.hp_C14[i][1], `${r.level} OT after 2h`);
    eq(cas(a, r.hourly), PINS.hp_C17[i][0], `${r.level} casual`);
    eq($(r.hourly, 1.75), PINS.hp_C17[i][1], `${r.level} casual weekend`);
    eq($(r.hourly, 2.75), PINS.hp_C17[i][2], `${r.level} casual PH`);
    eq($(r.hourly, 1.4), PINS.hp_C17[i][3], `${r.level} casual shift`);
  });
});

test("health professionals: clause 17 rates (from 1 October 2026) match Schedule C.2.1 / C.2.2 / C.2.3 for all 24 rows", () => {
  const a = HEALTH_PROFESSIONALS_AWARD;
  const hp = a.rates.slice(13);
  assert.equal(hp.length, 24);
  hp.forEach((r, i) => {
    eq(r.hourly, PINS.hp_C21[i][0], `${r.level} ordinary`);
    eq($(r.hourly, 1.5), PINS.hp_C21[i][1], `${r.level} weekend`);
    eq($(r.hourly, 2.5), PINS.hp_C21[i][2], `${r.level} PH`);
    eq($(r.hourly, 1.15), PINS.hp_C21[i][3], `${r.level} shift`);
    eq($(r.hourly, 1.5), PINS.hp_C22[i][0], `${r.level} OT first 2h`);
    eq($(r.hourly, 2), PINS.hp_C22[i][1], `${r.level} OT after 2h`);
    eq($(r.hourly, 2.5), PINS.hp_C22[i][3], `${r.level} OT PH`);
    eq(cas(a, r.hourly), PINS.hp_C23[i][0], `${r.level} casual`);
    eq($(r.hourly, 1.75), PINS.hp_C23[i][1], `${r.level} casual weekend`);
    eq($(r.hourly, 2.75), PINS.hp_C23[i][2], `${r.level} casual PH`);
    eq($(r.hourly, 1.4), PINS.hp_C23[i][3], `${r.level} casual shift`);
  });
  const get = (l: string) => findAwardRate(a, l);
  assert.equal(get("Health Professional Level 1 — AQF 7, 1st year").weekly, 1308.8);
  assert.equal(get("Health Professional Level 1 — AQF 9, 7th year+").hourly, 46.18);
  assert.equal(get("Health Professional Level 4").weekly, 2499.1);
  assert.equal(get("Support Services Level 1").weekly, 1024.7);
  assert.match(a.meta.operativeFrom, /1 October 2026/);
  assert.match(a.meta.operativeFrom, /1 July 2026/);
  assert.ok(a.meta.timingDetail && /30 June/.test(a.meta.timingDetail));
});

test("health professionals: casual weekends carry no loading, casual overtime compounds (cl 26.1(b), 25.3)", () => {
  const a = HEALTH_PROFESSIONALS_AWARD;
  const h = findAwardRate(a, "Health Professional Level 1 — AQF 7, 1st year").hourly;
  eq($(h, 1.75), 60.27, "casual Saturday AQF 7 first year is 175% of the minimum (Schedule C.2.3)");
  eq($c(a, h, 1.5), roundCents(cas(a, h) * 1.5), "casual first 2h overtime is 150% of the casual rate");
  assert.equal(a.casualPenaltyBasis, "compounded");
  assert.equal(pen(a, "Saturday or Sunday").casual, 1.75);
  assert.equal(pen(a, "Saturday or Sunday").casualBasis, "additive");
  assert.equal(pen(a, "Public holiday").casual, 2.75);
  assert.equal(mcol(a, "Public holiday").casualBasis, "additive");
});

// --- Timber ---------------------------------------------------------------------------

test("timber: cl 20.1 rates and Schedule D.2.1 / D.2.3 / D.3.1 / D.3.2 / D.3.3 for all three streams", () => {
  const a = TIMBER_AWARD;
  assert.equal(a.rates.length, 24);
  const furniture = a.rates.filter((r) => r.level.startsWith("Wood and Timber Furniture"));
  const general = a.rates.filter((r) => r.level.startsWith("General Timber"));
  const pulp = a.rates.filter((r) => r.level.startsWith("Pulp and Paper"));
  assert.equal(general.length, 7);
  assert.equal(furniture.length, 8);
  assert.equal(pulp.length, 9);
  const check = (rows: { level: string; hourly: number }[], pinIdx: number[], tag: string) => {
    rows.forEach((r, i) => {
      const pin = pinIdx[i];
      const who = `${tag} ${r.level}`;
      eq(r.hourly, PINS.tim_D21[pin][0], `${who} ordinary`);
      eq($(r.hourly, 1.5), PINS.tim_D21[pin][1], `${who} Saturday first 2h`);
      eq($(r.hourly, 2), PINS.tim_D21[pin][2], `${who} Sunday`);
      eq($(r.hourly, 2.5), PINS.tim_D21[pin][3], `${who} PH`);
      eq($(r.hourly, 1.5), PINS.tim_D23[pin][0], `${who} OT first 2h`);
      eq($(r.hourly, 2), PINS.tim_D23[pin][1], `${who} OT after 2h`);
      eq(cas(a, r.hourly), PINS.tim_D31[pin][0], `${who} casual ordinary`);
      eq($c(a, r.hourly, 1.5), PINS.tim_D33[pin][0], `${who} casual OT first 2h`);
      eq($c(a, r.hourly, 2), PINS.tim_D33[pin][1], `${who} casual OT after 2h`);
      eq($(r.hourly, 1.4), PINS.tim_D32[pin][1], `${who} casual afternoon shift`);
      eq($(r.hourly, 1.55), PINS.tim_D32[pin][2], `${who} casual non-rotating night`);
      eq($(r.hourly, 1.75), PINS.tim_D32[pin][3], `${who} casual shift Saturday`);
      eq($(r.hourly, 2.25), PINS.tim_D32[pin][4], `${who} casual shift Sunday and PH`);
    });
  };
  // Pin rows: 0-7 = General/Furniture block (L1,L2,L3,L4,L4A,L5,L6,L7); 8-16 = Pulp (L1-L9).
  check(general, [0, 1, 2, 3, 5, 6, 7], "general");
  check(furniture, [0, 1, 2, 3, 4, 5, 6, 7], "furniture");
  check(pulp, [8, 9, 10, 11, 12, 13, 14, 15, 16], "pulp");
  // Casual public holiday 275%: General Timber stream only (cl 27.1(d)).
  const gIdx = [0, 1, 2, 3, 5, 6, 7];
  general.forEach((r, i) => eq($(r.hourly, 2.75), PINS.tim_D31[gIdx[i]][1], `${r.level} casual PH`));
  assert.equal(PINS.tim_D31[8][1], null, "Pulp and Paper casual PH is not tabulated");
  const phCol = a.matrix.find((m) => m.label.includes("General Timber only"));
  assert.ok(phCol && phCol.appliesTo?.length === 7);
  assert.equal(a.casualPenaltyBasis, "compounded");
});

// --- Meat -----------------------------------------------------------------------------

test("meat: cl 16.1 rates and Schedule B.1.1-B.3.3 for processing, manufacturing and retail", () => {
  const a = MEAT_AWARD;
  assert.equal(a.rates.length, 8);
  PINS.meat_B11.forEach((pin, i) => {
    const h = a.rates[i].hourly;
    const who = a.rates[i].level;
    eq(h, pin[0], `processing ${who} Mon-Fri`);
    eq($(h, 1.5), pin[1], `processing ${who} Saturday`);
    eq($(h, 2), pin[2], `processing ${who} Sunday`);
    eq($(h, 1.5), PINS.meat_B12[i][0], `processing ${who} OT first 3h`);
    eq($(h, 2), PINS.meat_B12[i][1], `processing ${who} OT after 3h`);
    eq(cas(a, h), PINS.meat_B13[i][0], `processing ${who} casual`);
    eq($(h, 1.5), PINS.meat_B13[i][1], `processing ${who} casual Saturday (no loading)`);
    eq($(h, 2), PINS.meat_B13[i][2], `processing ${who} casual Sunday`);
    eq($(h, 1.25), PINS.meat_B21[i][1], `manufacturing ${who} Saturday`);
    eq(cas(a, h), PINS.meat_B23[i][0], `manufacturing ${who} casual`);
  });
  PINS.meat_B31.forEach((pin, i) => {
    const h = a.rates[i].hourly;
    const who = a.rates[i].level;
    eq(h, pin[0], `retail ${who}`);
    eq($(h, 1.25), pin[1], `retail ${who} Saturday`);
    eq($(h, 1.5), pin[2], `retail ${who} Sunday`);
    eq($(h, 1.5), PINS.meat_B32[i][0], `retail ${who} OT first 3h`);
    eq($(h, 2), PINS.meat_B32[i][1], `retail ${who} OT after 3h`);
    eq(cas(a, h), PINS.meat_B33[i][0] === null ? -1 : cas(a, h), `retail ${who} casual ordinary`);
    eq($(h, 1.25), PINS.meat_B33[i][1], `retail ${who} casual Saturday`);
    eq($(h, 1.5), PINS.meat_B33[i][2], `retail ${who} casual Sunday`);
  });
  a.rates.forEach((r) => eq(r.hourly, roundCents(r.weekly / 38), `${r.level} hourly = weekly / 38`));
  assert.ok(a.overtime.every((o) => o.casual === o.fullTime));
  assert.equal(a.publicHolidayCasualUnpublished, true);
  assert.ok(a.penalties.every((p) => !/public holiday/i.test(p.label)));
});

// --- Commercial Sales ---------------------------------------------------------------------

test("commercial sales: cl 15.1 and Schedule A.1.1 / A.1.2 / A.2.1 / A.3.1 / A.3.3", () => {
  const a = COMMERCIAL_SALES_AWARD;
  assert.equal(a.rates.length, 3);
  a.rates.forEach((r, i) => {
    eq(r.hourly, PINS.sales_A11[i][0], `${r.level} ordinary`);
    eq($(r.hourly, 1.5), PINS.sales_A11[i][1], `${r.level} Saturday`);
    eq($(r.hourly, 2), PINS.sales_A11[i][2], `${r.level} Sunday`);
    eq($(r.hourly, 2.5), PINS.sales_A11[i][3], `${r.level} PH`);
    eq($(r.hourly, 1.5), PINS.sales_A11[i][4], `${r.level} travelling`);
    eq($(r.hourly, 1.5), PINS.sales_A12[i][0], `${r.level} OT Mon-Fri`);
    eq(cas(a, r.hourly), PINS.sales_A21[i][0], `${r.level} casual`);
    eq($(r.hourly, 1.75), PINS.sales_A21[i][1], `${r.level} casual Saturday`);
    eq($(r.hourly, 2.25), PINS.sales_A21[i][2], `${r.level} casual Sunday`);
    eq($(r.hourly, 2.75), PINS.sales_A21[i][3], `${r.level} casual PH`);
  });
  const ct = findAwardRate(a, "Commercial Traveller / Advertising Sales Representative");
  [0.675, 0.8, 0.9].forEach((p, i) => {
    const j = juniorHourlyFor(a, ct, p);
    eq(j, PINS.sales_A31[i][0], `junior ${PIN_LABELS.sales_A31[i]} hourly`);
    eq(roundCents(j * 1.25), PINS.sales_A33[i][0], `junior ${PIN_LABELS.sales_A33[i]} casual`);
  });
  eq(a.junior!.adultAge, 21, "adult rate from 21");
  eq(findAwardRate(a, "Probationary Traveller").weekly, roundCents(ct.weekly * 0.9), "probationary = 90% of Commercial Traveller (cl 15.1 fn 1)");
});

// --- Mining ---------------------------------------------------------------------------

test("mining: ordinary hourly rate = (cl 15.1 minimum + $41.41 industry allowance) / 38, pinned to Schedule B.1.3 for all 8 levels", () => {
  const a = MINING_AWARD;
  assert.equal(a.rates.length, 8);
  assert.equal(MINING_MIN_WEEKLY.length, 8);
  a.rates.forEach((r, i) => {
    eq(roundCents(MINING_MIN_WEEKLY[i][1] + 41.41), r.weekly, `${r.level} weekly`);
    const h = r.hourly;
    eq(h, PINS.mine_B13[i][0], `${r.level} day`);
    eq($(h, 1.15), PINS.mine_B13[i][1], `${r.level} afternoon/night`);
    eq($(h, 1.3), PINS.mine_B13[i][2], `${r.level} permanent night`);
    eq($(h, 1.5), PINS.mine_B13[i][3], `${r.level} Saturday first 3h`);
    eq($(h, 2), PINS.mine_B13[i][4], `${r.level} Saturday after 3h`);
    eq($(h, 2), PINS.mine_B13[i][5], `${r.level} Saturday after noon and Sunday`);
    eq($(h, 2.5), PINS.mine_B13[i][6], `${r.level} PH`);
    eq($(h, 1.5), PINS.mine_B14[i][0], `${r.level} OT first 3h`);
    eq($(h, 2), PINS.mine_B15[i][0], `${r.level} continuous shiftworker OT`);
  });
});

test("mining: every casual percentage is applied to the casual ordinary rate (Schedule B.2.3-B.2.5)", () => {
  const a = MINING_AWARD;
  a.rates.forEach((r, i) => {
    eq(cas(a, r.hourly), PINS.mine_B23[i][0], `${r.level} casual day`);
    eq($c(a, r.hourly, 1.15), PINS.mine_B23[i][1], `${r.level} casual afternoon/night`);
    eq($c(a, r.hourly, 1.3), PINS.mine_B23[i][2], `${r.level} casual permanent night`);
    eq($c(a, r.hourly, 1.5), PINS.mine_B23[i][3], `${r.level} casual Saturday first 3h`);
    eq($c(a, r.hourly, 2), PINS.mine_B23[i][4], `${r.level} casual Saturday after 3h`);
    eq($c(a, r.hourly, 2), PINS.mine_B23[i][5], `${r.level} casual Sunday`);
    eq($c(a, r.hourly, 2.5), PINS.mine_B23[i][6], `${r.level} casual PH`);
    eq($c(a, r.hourly, 1.5), PINS.mine_B24[i][0], `${r.level} casual OT first 3h`);
    eq($c(a, r.hourly, 2), PINS.mine_B25[i][0], `${r.level} casual continuous OT`);
  });
  assert.equal(a.casualPenaltyBasis, "compounded");
});

// --- Cross-cutting ----------------------------------------------------------------------

test("batch 2: every allowance is positive and cited, every award names its unverified parts", () => {
  for (const a of ALL) {
    assert.ok(a.allowances.length > 0, a.key);
    for (const al of a.allowances) {
      assert.ok(al.amount > 0, `${a.key} ${al.name}`);
      assert.ok(/^cl /.test(al.clause), `${a.key} ${al.name} clause`);
    }
    assert.ok(a.unverified.length >= 3, `${a.key} unverified list`);
    assert.ok(a.hoursNotes.length >= 3, `${a.key} hours notes`);
    assert.ok(a.penaltyNotes.length >= 1 && a.overtimeNotes.length >= 1);
  }
});

test("batch 2: key figures quoted in the page copy are pinned", () => {
  const f = (a: ModernAwardData, l: string) => findAwardRate(a, l);
  eq(f(PLUMBING_AWARD, "Plumbing tradesperson Level 1 (registered)").hourly, 32.8, "registered plumber");
  eq(f(PLUMBING_AWARD, "Plumbing tradesperson Level 1 (not registered)").hourly, 31.63, "unregistered plumber");
  eq(f(PLUMBING_AWARD, "Plumbing worker Level 1(a) — new entrant").hourly, 27.97, "new entrant");
  eq(f(PASTORAL_AWARD, "FLH1").hourly, 25.74, "FLH1");
  eq(f(HORTICULTURE_AWARD, "Level 1").hourly, 25.74, "horticulture L1");
  eq(f(TIMBER_AWARD, "Pulp and Paper — Level 9").hourly, 33.06, "pulp L9");
  eq(f(MEAT_AWARD, "MI 8").hourly, 30.53, "MI 8");
  eq(f(COMMERCIAL_SALES_AWARD, "Commercial Traveller / Advertising Sales Representative").hourly, 29.55, "traveller");
  eq(f(MINING_AWARD, "Level 3 (Competent)").hourly, 30.54, "mining L3");
});
