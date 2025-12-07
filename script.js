document.getElementById("planBtn").addEventListener("click", async () => {
  const planBtn = document.getElementById("planBtn");
  const destinationEl = document.getElementById("destination");
  const daysEl = document.getElementById("days");
  const itineraryDiv = document.getElementById("itinerary");

  const destination = (destinationEl.value || "").trim();
  const days = parseInt(daysEl.value, 10);

  if (!destination || !days || isNaN(days) || days < 1) {
    alert("Please enter a destination and a valid number of days (1 or more).");
    return;
  }

  planBtn.disabled = true;
  itineraryDiv.innerHTML = "Generating itinerary...";

  document.getElementById("map").src =
    `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`;

  const prompt = `Create a ${days}-day travel itinerary for ${destination}.
Format it clearly as:
Day 1:
  Time - Activity (with exact location or landmark)
  Time - Activity (with exact location or landmark)

Make sure every activity has a specific location (restaurant name, street, landmark, or area).
Include sightseeing, local food, cultural activities, and travel tips.
Do not use tables or markdown. Use plain text with line breaks.`;

  try {
    // NOTE: It's unsafe to put API keys in frontend code. Replace with a server-side proxy.
    const API_KEY = "REPLACE_WITH_SERVER_SIDE_KEY";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    let resultText = null;
    if (response.ok) {
      const data = await response.json();
      console.log("API Response:", data);

      // Try multiple possible response shapes from generative APIs
      resultText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.[0]?.text ||
        data?.candidates?.[0]?.content?.text ||
        data?.candidates?.[0]?.output?.[0]?.content?.parts?.[0]?.text ||
        data?.output?.[0]?.content?.[0]?.text;
    }

    if (!resultText) {
      // Fallback: local generator so the app still works without the API
      resultText = generateLocalItinerary(destination, days);
    }

    itineraryDiv.innerHTML = escapeHtml(resultText).replace(/\n/g, "<br>");
  } catch (error) {
    console.error(error);
    const fallback = generateLocalItinerary(destination, days);
    itineraryDiv.innerHTML = escapeHtml(fallback).replace(/\n/g, "<br>");
  } finally {
    planBtn.disabled = false;
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateLocalItinerary(destination, days) {
  const templates = {
    morning: [
      "9:00 AM - Breakfast at Sunrise Cafe (Main St)",
      "10:30 AM - Visit Central Park (near the fountain)",
      "11:30 AM - Explore Old Town Market (Market St)"
    ],
    afternoon: [
      "1:00 PM - Lunch at Local Bites (123 Food Ave)",
      "2:30 PM - Museum of History (45 Museum Rd)",
      "4:30 PM - Coffee at Corner Roastery (Corner of 2nd & Pine)"
    ],
    evening: [
      "6:30 PM - Dinner at Harbor Grill (Waterfront)",
      "8:30 PM - Attend a local performance at City Theater (Main Square)",
      "10:30 PM - Night stroll along River Walk (Riverfront Promenade)"
    ]
  };

  let out = `Suggested ${days}-day itinerary for ${destination}:\n\n`;
  for (let d = 1; d <= days; d++) {
    out += `Day ${d}:\n`;
    out += `${templates.morning[(d - 1) % templates.morning.length]}\n`;
    out += `${templates.afternoon[(d - 1) % templates.afternoon.length]}\n`;
    out += `${templates.evening[(d - 1) % templates.evening.length]}\n\n`;

  }

  out += `Travel tips:\n- Carry local currency for small vendors.\n- Try the local specialty dishes mentioned above.\n- Check opening hours and book popular attractions in advance.`;
  return out;
}


window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-ERPM0F9H8X');