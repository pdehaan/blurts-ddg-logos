import _groupBy from "lodash.groupby";

import stats from "./stats.json" assert { type: "json" };

const DELIMITER = "×";

const res = stats.results;
const dimensions = _groupBy(res, "dimensions");

const keys = Object.keys(dimensions).sort((a, b) => {
  const [aWidth, aHeight] = a.split(DELIMITER);
  const [bWidth, bHeight] = b.split(DELIMITER);
  return aWidth * aHeight - bWidth * bHeight;
});

console.log(`DIMENSIONS | COUNT | PCT\n|:----:|----:|----:|`);
for (const key of keys) {
  const value = dimensions[key];
  const pct = pctFormat(value.length / res.length);
  console.log(`${key} | ${value.length} | ${pct}`);
}

function pctFormat(number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(number);
}
