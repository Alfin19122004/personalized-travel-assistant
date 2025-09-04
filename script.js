document.getElementById("planBtn").addEventListener("click", async () => {
  const destination = document.getElementById("destination").value;
  const days = document.getElementById("days").value;
  const itineraryDiv = document.getElementById("itinerary");

  if (!destination || !days) {
    alert("Please enter destination and number of days!");
    return;
  }

  itineraryDiv.innerHTML = " Generating itinerary...";

  
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
  
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDbnF4-sqI5kzfj_nH67249YuT6w8FG_-U",
      {
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
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

   
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response from AI.";

    itineraryDiv.innerHTML = result.replace(/\n/g, "<br>");
  } catch (error) {
    console.error(error);
    itineraryDiv.innerHTML = "❌ Error generating itinerary.";
  }
});


window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-ERPM0F9H8X');