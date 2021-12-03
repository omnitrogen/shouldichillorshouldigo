FROM rust:latest AS builder
LABEL stage=builder
COPY . .
RUN cargo install --path .

FROM debian:buster-slim AS runner
RUN apt-get update \
    && apt-get install -y ca-certificates libssl-dev \
    && rm -rf /var/lib/apt/lists/*
RUN update-ca-certificates
COPY --from=builder /usr/local/cargo/bin/api /usr/local/bin/api
ENV ROCKET_ADDRESS=0.0.0.0
EXPOSE 8000
CMD ["api"]
