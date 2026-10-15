// One-off edits to the trip held in THIS browser. The laptop copy is the master and republishes
// itself, so a change made only to trip.json is overwritten within seconds. Each patch runs once
// per browser (tracked by id in state.appliedPatches) once it returns true, then the app saves and
// publishes as normal.
window.TRIP_PATCHES = [
  {
    id: "2026-09-18-asia-bkk-szx-can-sya",
    run(s, { uid }) {
      const it = s.itineraries.find(i => i.name === "Asia (No Phuket, No Hong Kong)");
      if (!it) return;
      const days = it.days;
      const names = { edition: "The Sanya EDITION", atlantis: "Atlantis Sanya",
                      ritz: "The Ritz-Carlton, Shenzhen", gz: "Guangzhou Marriott Hotel Tianhe" };
      const blocks = {};
      for (const [k, v] of Object.entries(names))
        blocks[k] = days.map((d, n) => (d.hotel && d.hotel.name === v && d.date >= "2026-10-26" && d.date <= "2026-11-03") ? n : -1).filter(n => n >= 0);
      if ([blocks.edition, blocks.atlantis, blocks.ritz, blocks.gz].map(b => b.length).join() !== "2,2,2,3") return;
      const all = [].concat(blocks.ritz, blocks.gz, blocks.edition, blocks.atlantis);
      const start = Math.min(...all), end = Math.max(...all);
      if (end - start !== 8) return;
      if (days[start].hotel.name === names.ritz && days[start + 2].hotel.name === names.gz) return true;
      const legs = [];
      for (let n = start; n <= end; n++) (days[n].transports || []).forEach(t => legs.push(t));
      const bkk = legs.find(t => t.from === "BKK" && t.to === "SZX");
      const train = legs.find(t => t.type === "train" && t.from === "Shenzhen" && t.to === "Guangzhou");
      const order = [];
      for (const k of ["ritz", "gz", "edition", "atlantis"]) blocks[k].forEach(n => order.push([k, JSON.parse(JSON.stringify(days[n]))]));
      const iso = dt => dt.toISOString().slice(0, 10);
      const base = Date.UTC(2026, 9, 26), DAY = 86400000;
      const span = {};
      order.forEach(([k, dy], i) => {
        dy.date = iso(new Date(base + i * DAY)); dy.transports = []; dy.location2 = "";
        (span[k] = span[k] || []).push(i);
      });
      for (const [k, idx] of Object.entries(span)) {
        const ci = iso(new Date(base + idx[0] * DAY)), co = iso(new Date(base + (idx[idx.length - 1] + 1) * DAY));
        order.forEach(([kk, dy]) => { if (kk === k) Object.assign(dy.hotel, { checkIn: ci, checkOut: co, nights: idx.length }); });
      }
      const loc = { ritz: "Shenzhen", gz: "Guangzhou", edition: "Sanya", atlantis: "Sanya" };
      order.forEach(([k, dy]) => { dy.location = loc[k]; });
      const D = order.map(o => o[1]);
      Object.assign(D[0], { location: "Bangkok", location2: "Shenzhen", transports: bkk ? [bkk] : [] });
      Object.assign(D[2], { location: "Shenzhen", location2: "Guangzhou", transports: train ? [train] : [] });
      Object.assign(D[5], { location: "Guangzhou", location2: "Sanya", transports: [{
        id: uid(), type: "flight", from: "Guangzhou", to: "Sanya", departTime: "18:40", arriveTime: "20:25",
        overnight: false, price: 200, currency: "CAD", operator: "", business: false, businessPct: 100,
        booked: false, confirmation: "", reference: "", info: "" }] });
      days.splice(start, end - start + 1, ...D);
      return true;
    }
  },
  {
    // JP 2026-10-15: Sanya's 4 nights go straight after Hong Kong (from Nov 2), then Shenzhen,
    // Guangzhou, and Guilin on Nov 11 as before. Everything from Nov 11 on is untouched.
    id: "2026-10-15-sanya-after-hong-kong",
    run(s, { uid }) {
      // Only the laptop holds the master copy. A phone takes the result from the next publish;
      // patching it locally would make it look edited and stop it auto-taking that publish.
      if (location.protocol !== "file:" && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) return true;
      const it = s.itineraries.find(i => i.id === "zeg7dcyp")
              || s.itineraries.find(i => i.name === "Asia (No Phuket, No Hong Kong)");
      if (!it) return;
      const days = it.days;
      const names = { edition: "The Sanya EDITION", atlantis: "Atlantis Sanya",
                      ritz: "The Ritz-Carlton, Shenzhen", gz: "Guangzhou Marriott Hotel Tianhe" };
      const blocks = {};
      for (const [k, v] of Object.entries(names))
        blocks[k] = days.map((d, n) => (d.hotel && d.hotel.name === v && d.date >= "2026-11-02" && d.date <= "2026-11-10") ? n : -1).filter(n => n >= 0);
      if ([blocks.edition, blocks.atlantis, blocks.ritz, blocks.gz].map(b => b.length).join() !== "2,2,2,3") return;
      const all = [].concat(blocks.edition, blocks.atlantis, blocks.ritz, blocks.gz);
      const start = Math.min(...all), end = Math.max(...all);
      if (end - start !== 8) return;
      if (days[start].hotel.name === names.edition) return true;
      const legs = [];
      for (let n = start; n <= end; n++) (days[n].transports || []).forEach(t => legs.push(t));
      const train = legs.find(t => t.type === "train" && t.from === "Shenzhen" && t.to === "Guangzhou");
      const order = [];
      for (const k of ["edition", "atlantis", "ritz", "gz"]) blocks[k].forEach(n => order.push([k, JSON.parse(JSON.stringify(days[n]))]));
      const iso = dt => dt.toISOString().slice(0, 10);
      const base = Date.UTC(2026, 10, 2), DAY = 86400000;
      const span = {};
      order.forEach(([k, dy], i) => {
        dy.date = iso(new Date(base + i * DAY)); dy.transports = []; dy.location2 = "";
        (span[k] = span[k] || []).push(i);
      });
      for (const [k, idx] of Object.entries(span)) {
        const ci = iso(new Date(base + idx[0] * DAY)), co = iso(new Date(base + (idx[idx.length - 1] + 1) * DAY));
        order.forEach(([kk, dy]) => { if (kk === k) Object.assign(dy.hotel, { checkIn: ci, checkOut: co, nights: idx.length }); });
      }
      const loc = { edition: "Sanya", atlantis: "Sanya", ritz: "Shenzhen", gz: "Guangzhou" };
      order.forEach(([k, dy]) => { dy.location = loc[k]; });
      const D = order.map(o => o[1]);
      const leg = (o) => Object.assign({ id: uid(), overnight: false, business: false, businessPct: 100,
        booked: false, confirmation: "", reference: "", info: "" }, o);
      Object.assign(D[0], { location: "HKG", location2: "Sanya", transports: [leg({ type: "flight",
        from: "HKG", to: "SYX", departTime: "08:45", arriveTime: "10:30", price: 125, currency: "CAD",
        operator: "Hong Kong Express" })] });
      Object.assign(D[4], { location: "Sanya", location2: "Shenzhen", transports: [leg({ type: "flight",
        from: "Sanya", to: "Shenzhen", departTime: "18:40", arriveTime: "20:25", price: 200, currency: "CAD",
        operator: "" })] });
      Object.assign(D[6], { location: "Shenzhen", location2: "Guangzhou", transports: train ? [train] : [] });
      days.splice(start, end - start + 1, ...D);
      // Nov 11 used to follow Sanya and had no way to Guilin at all; it now leaves Guangzhou.
      const nov11 = days[start + 9];
      if (nov11 && nov11.date === "2026-11-11"
          && !(nov11.transports || []).some(t => t.from === "Guangzhou" && t.to === "Guilin")) {
        nov11.transports = (nov11.transports || []).concat(leg({ type: "train", from: "Guangzhou",
          to: "Guilin", departTime: "12:25", arriveTime: "14:28", price: 40, currency: "USD",
          operator: "First Class", business: true, businessPct: 50 }));
        Object.assign(nov11, { location: "Guangzhou", location2: "Guilin" });
      }
      return true;
    }
  }
];
