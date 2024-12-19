FROM denoland/deno:1.38.3

WORKDIR /app

# Cache dependencies
COPY deps.ts .
RUN deno cache deps.ts

# Copy source code
COPY . .

# Cache the rest of the application
RUN deno cache main.ts

# Compile the project
RUN deno task build

# Expose ports
EXPOSE 8000
EXPOSE 9090

# Create volume for metrics
VOLUME ["/app/metrics"]

# Start the application with monitoring
CMD ["run", "-A", "--unstable", "main.ts"]
