// /src/tools/te-reo-assistant/phrases.ts
export const CommonPhrases = {
    greetings: [
      'Kia ora',
      'Tēnā koe',
      'Mōrena',
      'Tēnā koutou'
    ],
  
    farewells: [
      'Ka kite anō',
      'Haere rā',
      'Noho ora mai',
      'Hei konā mai'
    ],
  
    basic: [
      'kia ora',
      'ka pai',
      'aroha',
      'whānau',
      'kai'
    ],
  
    getForContext(context: string): string[] {
      const contextMap = {
        greeting: this.greetings,
        farewell: this.farewells,
        food: ['Kei te hiakai ahau', 'He kai tēnei'],
        family: ['Ko tōku whānau tēnei', 'Ko mātou te whānau']
      };
  
      return contextMap[context as keyof typeof contextMap] || [];
    }
  };