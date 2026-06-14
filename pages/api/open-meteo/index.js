export default async function handler(request, response) {
  const { latitude, longitude } = request.query;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
    );

    const weather = await response.json();

    response.status(200).json(weather);
  } catch (error) {
    response.status(500).json({
      error: "Failed to fetch weather data",
    });
  }
}
