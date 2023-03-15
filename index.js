import { get } from "node:https";
import fs from "node:fs";
import path from "node:path";
import axios from "axios";

const BREACH_URL = "https://haveibeenpwned.com/api/v3/breaches";

const { data: breaches } = await axios.get(BREACH_URL);
const domains = breaches
  .map((breach) => breach.Domain.toLowerCase())
  .filter((domain) => domain.length);

const promises = domains.map(domain => {
  return new Promise((resolve, reject) => {
    const logoUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    get(logoUrl, res => {
      if (res.statusCode !== 200) {
        const err = new Error(domain);
        err.statusCode = res.statusCode;
        err.url = logoUrl;
        return reject(err);
      }
      const logoPath = path.join("logo_cache", `${domain}.png`);
      const file = fs.createWriteStream(logoPath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
      });
      resolve([domain, logoPath]);
    });
  });
});

Promise.allSettled(promises).then(res => {
  const grouped = res.reduce((acc, p) => {
    const status = p.status;
    if (!acc[status]) acc[status] = []
    acc[status].push(p);
    return acc;
  }, {});

  console.log(grouped.rejected.map(err => err.reason.message).join("\n"));
  // for (const r of res) {
  //   if (r.status === "rejected") {
  //     console.error (r.reason.message);
  //   }
  // }
});
