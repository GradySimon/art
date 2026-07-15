import {asWorkImplementation} from "./runtime";
import {SUNDANCE_DEFAULTS, sundance} from "./scenes";

export const {mount} = asWorkImplementation(sundance, {
  controls: {
    title: "Sundance",
    defaults: SUNDANCE_DEFAULTS,
    fields: [
      {key: "innerCount", label: "Inner count", min: 2, max: 16, step: 1, format: "integer"},
      {key: "middleCount", label: "Middle count", min: 2, max: 16, step: 1, format: "integer"},
      {key: "outerCount", label: "Outer count", min: 2, max: 16, step: 1, format: "integer"},
      {key: "innerVelocity", label: "Inner spin", min: -2, max: 2, step: 0.05, format: "multiplier"},
      {key: "middleVelocity", label: "Middle spin", min: -2, max: 2, step: 0.05, format: "multiplier"},
      {key: "outerVelocity", label: "Outer spin", min: -2, max: 2, step: 0.05, format: "multiplier"},
      {key: "pulse", label: "Pulse", min: 0, max: 0.16, step: 0.005},
      {key: "haloSize", label: "Blob size", min: 0.5, max: 1.6, step: 0.05, format: "multiplier"},
    ],
  },
});
