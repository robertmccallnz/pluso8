/ pluso/core/runtime.ts
import { Configuration } from "./config.ts";

export class Runtime {
  private static instance: Runtime;
  private config: Configuration;

  private constructor() {
    this.config = new Configuration();
  }

  public static getInstance(): Runtime {
    if (!Runtime.instance) {
      Runtime.instance = new Runtime();
    }
    return Runtime.instance;
  }
}