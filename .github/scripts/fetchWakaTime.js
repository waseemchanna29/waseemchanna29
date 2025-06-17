const axios = require('axios');
const fs = require('fs');

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
const RANGE = 'last_7_days';

async function fetchWakaTimeTotal() {
  try {
    const response = await axios.get(`https://wakatime.com/api/v1/users/current/summaries?range=${RANGE}`, {
      auth: { username: WAKATIME_API_KEY, password: '' }
    });

    const data = response.data.data;
    const total = data.reduce((acc, day) => acc + (day.grand_total.total_seconds || 0), 0);

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);

    const content = `🕒 Total Development Time (${RANGE.replace(/_/g, ' ')}): ${hours} hrs ${minutes} mins`;

    const readmePath = 'README.md';
    const readme = fs.readFileSync(readmePath, 'utf8');

    const updated = readme.replace(
      /<!--waka-start-->(.|\n)*<!--waka-end-->/gm,
      `<!--waka-start-->\n${content}\n<!--waka-end-->`
    );

    fs.writeFileSync(readmePath, updated);
    console.log('✅ README updated with WakaTime stats.');
  } catch (err) {
    console.error('❌ Error fetching WakaTime:', err.message);
  }
}

fetchWakaTimeTotal();
