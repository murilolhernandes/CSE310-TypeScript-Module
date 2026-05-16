export default class Cooking {
  #apiKey;
  #apiUrl = "https://food-unit-of-measurement-converter.p.rapidapi.com/convert";

  // Initializes the Cooking API converter with the provided API key.
  constructor(apiKey: string) {
    if (!apiKey) throw new Error("API key is required.");
    this.#apiKey = apiKey;
  }

  // Fetches conversion data from the Food Unit of Measurement API for a specific value, unit, and ingredient.
  async convert(value: string | number, unit: string, ingredient: string): Promise<any> {
    try {
      const url = new URL(this.#apiUrl);
      url.searchParams.append("value", value.toString());
      url.searchParams.append("unit", unit);
      url.searchParams.append("ingredient", ingredient);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.#apiKey,
          "X-RapidAPI-Host": "food-unit-of-measurement-converter.p.rapidapi.com",
        }
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${await response.text() || "No details"}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error: any) {
      throw new Error(`API request failed: ${error.message}`, { cause: error });
    }
  }
}