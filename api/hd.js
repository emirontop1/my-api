export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "city parametresi gerekli" });

  const OWM_KEY = "fa3f9e89b0093c7acc717eb5637cabb0";
  const WAPI_KEY = "78e6a9e7eca0441da8a93541251809";

  try {
    const [owm, wapi, meta] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_KEY}&units=metric`)
        .then(r => r.json())
        .catch(() => null),

      fetch(`https://api.weatherapi.com/v1/current.json?key=${WAPI_KEY}&q=${encodeURIComponent(city)}`)
        .then(r => r.json())
        .catch(() => null),

      (async () => { // MetaWeather
        try {
          const woe = await fetch(`https://www.metaweather.com/api/location/search/?query=${encodeURIComponent(city)}`)
            .then(r => r.json());
          if (!woe || !woe[0]) return null;
          const data = await fetch(`https://www.metaweather.com/api/location/${woe[0].woeid}/`)
            .then(r => r.json());
          return data.consolidated_weather[0];
        } catch { return null; }
      })()
    ]);

    let temps = [], hums = [], winds = [];

    if (owm && owm.main) { temps.push(owm.main.temp); hums.push(owm.main.humidity); winds.push(owm.wind.speed); }
    if (wapi && wapi.current) { temps.push(wapi.current.temp_c); hums.push(wapi.current.humidity); winds.push(wapi.current.wind_kph / 3.6); }
    if (meta) { temps.push(meta.the_temp); hums.push(meta.humidity); winds.push(meta.wind_speed); }

    if (temps.length === 0) return res.status(500).json({ error: "Hiç veri alınamadı" });

    const average = arr => arr.reduce((a,b)=>a+b,0)/arr.length;

    res.status(200).json({
      city,
      temperature: Number(average(temps).toFixed(1)),
      humidity: Number(average(hums).toFixed(1)),
      wind_speed: Number(average(winds).toFixed(1)) // m/s
    });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
}
