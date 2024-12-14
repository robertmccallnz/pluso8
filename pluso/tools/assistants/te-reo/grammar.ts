// /src/tools/te-reo-assistant.ts/grammar.ts

export interface TeReoGrammarRule {
    pattern: string;
    description: string;
    examples: Array<{
      reo: string;
      english: string;
    }>;
  }
  
  export const basicPatterns: TeReoGrammarRule[] = [
    {
      pattern: "[subject] + [verb]",
      description: "Basic sentence structure where the subject comes before the verb",
      examples: [
        {
          reo: "Kei te kai ahau",
          english: "I am eating"
        },
        {
          reo: "Kei te moe ia",
          english: "He/she is sleeping"
        }
      ]
    },
    {
      pattern: "tēnei/tēnā/tērā + [noun]",
      description: "Demonstratives (this, that, that over there) with nouns",
      examples: [
        {
          reo: "tēnei whare",
          english: "this house"
        },
        {
          reo: "tērā tangata",
          english: "that person over there"
        }
      ]
    }
  ];
  
  export const verbTenses = {
    present: {
      marker: "kei te",
      example: "Kei te haere au - I am going",
      usage: "Used for actions happening right now"
    },
    past: {
      marker: "i",
      example: "I haere au - I went",
      usage: "Used for completed actions"
    },
    future: {
      marker: "ka",
      example: "Ka haere au - I will go",
      usage: "Used for future actions"
    }
  };
  
  export const particles = {
    a: {
      usage: "Personal article used before proper nouns",
      example: "a Mere - Mary"
    },
    i: {
      usage: "Marks past tense or object of verb",
      example: "i haere au ki te kura - I went to school"
    },
    ki: {
      usage: "To, towards (directional)",
      example: "ki te whare - to the house"
    },
    ko: {
      usage: "Focus particle, used in identification",
      example: "Ko wai tōu ingoa? - What is your name?"
    }
  };
  
  export const possessives = {
    singular: {
      first: {
        a_category: "tāku/tōku",
        o_category: "taku/toku",
        usage: "my"
      },
      second: {
        a_category: "tāu/tōu",
        o_category: "tau/tou",
        usage: "your"
      },
      third: {
        a_category: "tāna/tōna",
        o_category: "tana/tona",
        usage: "his/her"
      }
    },
    plural: {
      first: {
        a_category: "ā mātou/ō mātou",
        o_category: "a mātou/o mātou",
        usage: "our (exclusive)"
      },
      second: {
        a_category: "ā koutou/ō koutou",
        o_category: "a koutou/o koutou",
        usage: "your (plural)"
      },
      third: {
        a_category: "ā rātou/ō rātou",
        o_category: "a rātou/o rātou",
        usage: "their"
      }
    }
  };
  
  export const questions = {
    who: {
      particle: "ko wai",
      example: "Ko wai tēnā? - Who is that?"
    },
    what: {
      particle: "he aha",
      example: "He aha tēnei? - What is this?"
    },
    where: {
      particle: "kei hea",
      example: "Kei hea te whare? - Where is the house?"
    },
    when: {
      particle: "āhea",
      example: "Āhea koe haere ai? - When are you going?"
    },
    why: {
      particle: "he aha ai",
      example: "He aha ai koe i haere mai ai? - Why did you come?"
    }
  };
  
  export const sentencePatterns = {
    verbal: {
      tenseMarker: "[tense particle]",
      verb: "[verb]",
      subject: "[subject]",
      object: "[object]",
      example: "Kei te kai au i te āporo - I am eating the apple"
    },
    equative: {
      subject: "[subject]",
      particle: "he",
      complement: "[complement]",
      example: "He nui te whare - The house is big"
    },
    locative: {
      particle: "kei",
      location: "[location]",
      subject: "[subject]",
      example: "Kei te whare au - I am at the house"
    }
  };
  
  export function checkGrammarPattern(sentence: string): {
    isValid: boolean;
    pattern?: string;
    errors?: string[];
  } {
    // Basic implementation - can be expanded
    const errors: string[] = [];
    const words = sentence.toLowerCase().split(' ');
  
    // Check for basic patterns
    if (words[0] === 'kei' && words[1] === 'te') {
      return {
        isValid: true,
        pattern: "present continuous",
      };
    }
  
    if (words[0] === 'i' || words[0] === 'ka') {
      return {
        isValid: true,
        pattern: words[0] === 'i' ? "past tense" : "future tense",
      };
    }
  
    return {
      isValid: false,
      errors: ["Unrecognized sentence pattern"]
    };
  }
  
  export function suggestCorrection(sentence: string): string {
    const check = checkGrammarPattern(sentence);
    if (!check.isValid) {
      // Basic correction suggestions
      if (sentence.startsWith('ka te')) {
        return sentence.replace('ka te', 'kei te');
      }
    }
    return sentence;
  }