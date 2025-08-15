function minMaxNumbers(nums) {
  if (!nums || nums.length === 0) return { min: null, max: null };
  let min = nums[0], max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < min) min = nums[i];
    if (nums[i] > max) max = nums[i];
  }
  return { min, max };
}

function latestByDate(reports) {
  if (!reports || reports.length === 0) return null;
  let latest = reports[0];
  for (let i = 1; i < reports.length; i++) {
    if (new Date(reports[i].date) > new Date(latest.date)) latest = reports[i];
  }
  return latest;
}

function iconForCode(code) {
  const c = Number(code);
  if (c >= 200 && c < 300) return "11d"; // thunderstorm
  if (c >= 300 && c < 400) return "09d"; // drizzle
  if (c >= 500 && c < 600) return "10d"; // rain
  if (c >= 600 && c < 700) return "13d"; // snow
  if (c >= 700 && c < 800) return "50d"; // mist/etc
  if (c === 800) return "01d";
  if (c === 801) return "02d";
  if (c === 802) return "03d";
  return "04d";
}
