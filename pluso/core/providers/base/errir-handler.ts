/ core/providers/base/error-handler.ts
export class ModelErrorHandler {
  async handleError(error: Error, context: RequestContext): Promise<RecoveryStrategy> {
    if (error instanceof RateLimitError) {
      return this.handleRateLimit(error);
    }
    if (error instanceof TokenLimitError) {
      return this.handleTokenLimit(error, context);
    }
    // Handle other error types
  }

  private async handleRateLimit(error: RateLimitError): Promise<RecoveryStrategy> {
    // Implement rate limit recovery logic
  }
}