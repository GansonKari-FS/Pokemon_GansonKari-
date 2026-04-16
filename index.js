async function getPokemonData(id) {
  try {
    // First API call: get the main Pokemon data
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
    );

    if (!pokemonResponse.ok) {
      throw new Error(
        `Pokemon request failed with status ${pokemonResponse.status}`,
      );
    }

    const pokemonData = await pokemonResponse.json();

    // Grab the species URL from the first response
    const speciesUrl = pokemonData.species.url;

    // Second API call: get species data
    const speciesResponse = await fetch(speciesUrl);

    if (!speciesResponse.ok) {
      throw new Error(
        `Species request failed with status ${speciesResponse.status}`,
      );
    }

    const speciesData = await speciesResponse.json();

    // Find English flavor text
    const englishFlavorEntry = speciesData.flavor_text_entries.find((entry) => {
      return entry.language.name === "en";
    });

    // Clean up flavor text if found
    const flavorText = englishFlavorEntry
      ? englishFlavorEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
      : "No flavor text available";

    // Build and return the required object
    return {
      name: pokemonData.name,
      height: pokemonData.height,
      weight: pokemonData.weight,
      types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
      flavorText: flavorText,
      habitat: speciesData.habitat ? speciesData.habitat.name : "Unknown",
      isLegendary: speciesData.is_legendary,
    };
  } catch (error) {
    console.error("Error fetching Pokemon data:", error.message);
    return null;
  }
}

async function assignmentTask() {
  try {
    // Random number between 1 and 151
    const randomId = Math.floor(Math.random() * 151) + 1;

    console.log(`Random Pokemon ID: ${randomId}`);

    const pokemon = await getPokemonData(randomId);

    if (pokemon) {
      console.log("Pokemon Data:");
      console.log(pokemon);
    } else {
      console.log("Could not retrieve Pokemon data.");
    }
  } catch (error) {
    console.error("Error in assignmentTask:", error.message);
  }
}

assignmentTask();
