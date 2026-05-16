import Cooking from "./Cooking";
import { 
  findBestIngredientMatch, 
  getIngredientSuggestions,
  VALID_INGREDIENTS_SET 
} from "./Ingredients";


// TYPESCRIPT INTERFACE:
// Strictly types the expected shape of the data returned by our RegEx parser
// so that TypeScript can validate our variables throughout the class.
interface ParsedInput {
  value: string;
  unit: string;
  ingredient: string;
  targetUnit: string | null;
}

export default class CookingCore {
  #converter: Cooking;
  #cache: Map<string, any> = new Map();

  // Initializes the cooking conversion wrapper, setting up the API client and a local cache.
  constructor(apiKey: string) {
    this.#converter = new Cooking(apiKey);
  }

  // Parses a natural language cooking query into its components: value, unit, ingredient, and target unit.
  parseConvertInput(input: string): ParsedInput {
    // More flexible regex to handle multi-word ingredients
    const match = input.match(/^(\d+\.?\d*)\s+(\w+)\s+(.+?)(?:\s+to\s+(\w+))?$/i);
    if (!match) {
      throw new Error(`Invalid format. Use: "2 cups flour" or "2 cups flour to grams"`);
    }
    return {
      value: match[1],
      unit: match[2],
      ingredient: match[3].trim(),
      targetUnit: match[4] || null
    };
  }

  // Standardizes the ingredient name using the local ingredients matching utility.
  normalizeIngredient(ingredient: string): string {
    return findBestIngredientMatch(ingredient);
  }

  // Ensures the ingredient exists in our valid ingredient set, throwing helpful errors with suggestions if not.
  validateIngredient(normalizedIngredient: string): void {
    if (!VALID_INGREDIENTS_SET.has(normalizedIngredient)) {
      // Get suggestions for user
      const suggestions = getIngredientSuggestions(normalizedIngredient.replace(/_/g, " "))
        .map(s => s.display)
        .slice(0, 3);
      
      if (suggestions.length > 0) {
        throw new Error(`Unknown ingredient "${normalizedIngredient.replace(/_/g, " ")}". Did you mean: ${suggestions.join(", ")}?`);
      } else {
        throw new Error(`Unknown ingredient "${normalizedIngredient.replace(/_/g, " ")}". Try common ingredients like flour, sugar, salt, etc.`);
      }
    }
  }

  // Orchestrates the end-to-end process of validating, caching, and calling the API to convert a cooking measurement.
  async convertUnit(input: string): Promise<string> {
    const { value, unit, ingredient, targetUnit } = this.parseConvertInput(input);
    const normalizedUnit = this.normalizeUnit(unit);
    const normalizedIngredient = this.normalizeIngredient(ingredient);
    
    // Validate ingredient
    this.validateIngredient(normalizedIngredient);
    
    const cacheKey = `${value}-${normalizedUnit}-${normalizedIngredient}-${targetUnit || ""}`.toLowerCase();

    // PERFORMANCE OPTIMIZATION: 
    // Check if we have already made this exact API call recently. If so, return 
    // the cached result to save network bandwidth and API quota limits.
    if (this.#cache.has(cacheKey)) {
      const result = this.#cache.get(cacheKey);
      return this.formatResult(value, normalizedUnit, normalizedIngredient, result, targetUnit);
    }

    let conversions: any;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        conversions = await this.#converter.convert(value, normalizedUnit, normalizedIngredient);
        break;
      } catch (error) {
        if (attempt === 3) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    if (!conversions || Object.keys(conversions).length === 0 || conversions.error) {
      throw new Error("No valid conversions returned from API");
    }

    // Process result
    let result;
    if (targetUnit) {
      const normalizedTargetUnit = this.normalizeUnit(targetUnit);
      result = conversions[normalizedTargetUnit] || conversions[targetUnit.toLowerCase()];
      
      if (result === undefined) {
        // Check if target unit exists in any form
        const possibleUnits = Object.keys(conversions);
        const suggestions = possibleUnits.slice(0, 3).map(u => u.replace(/_/g, " "));
        throw new Error(`Cannot convert to ${targetUnit}. Available units: ${suggestions.join(", ")}`);
      }
      
    } else {
      result = conversions;
    }

    // Store in cache
    this.#cache.set(cacheKey, result);
    return this.formatResult(value, normalizedUnit, normalizedIngredient, result, targetUnit);
  }

  // Normalizes unit names, standardizing abbreviations and mapping singulars to plurals for API consistency.
  normalizeUnit(unit: string): string {
    const unitMap: Record<string, string> = {
      // Singular to plural mappings
      "cup": "cups",
      "teaspoon": "teaspoons",
      "tsp": "teaspoons",
      "tablespoon": "tablespoons",
      "tbsp": "tablespoons",
      "ounce": "oz",
      "ounces": "oz",
      "pound": "lbs",
      "pounds": "lbs",
      "milliliter": "milliliters",
      "ml": "milliliters",
      "liter": "liters",
      "l": "liters",
      "gram": "grams",
      "g": "grams",
      "quart": "quarts",
      "qt": "quarts",
      "pint": "pints",
      "pt": "pints",
      "fl oz": "fl_oz",
      "fluid ounce": "fl_oz",
      "fluid ounces": "fl_oz"
    };
    
    const normalized = unit.toLowerCase().trim();
    return unitMap[normalized] || normalized;
  }

  // Constructs a readable string output from the raw API conversion result.
  formatResult(value: string, unit: string, ingredient: string, result: any, targetUnit: string | null): string {
    const readableIngredient = ingredient.replace(/_/g, " ");
    
    if (typeof result === "object" && result !== null) {
      // Format multiple conversions
      const conversions = Object.entries(result)
        .map(([unit, val]) => {
          const readableUnit = unit.replace(/_/g, " ");
          return `${parseFloat(String(val)).toFixed(2)} ${readableUnit}`;
        })
        .join(", ");
      
      return `${value} ${unit} ${readableIngredient} = ${conversions}`;
    }
    
    // Single conversion
    const readableTargetUnit = targetUnit ? targetUnit.replace(/_/g, " ") : "";
    return `${value} ${unit} ${readableIngredient} = ${parseFloat(result).toFixed(2)} ${readableTargetUnit}`.trim();
  }

  // New method to get ingredient suggestions for autocomplete
  getSuggestions(partial: string) {
    return getIngredientSuggestions(partial);
  }

  // Clear cache method
  clearCache(): void {
    this.#cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.#cache.size,
      entries: Array.from(this.#cache.keys())
    };
  }
}