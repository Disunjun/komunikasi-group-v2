FROM node:22-bookworm-slim

WORKDIR /app

# Python runtime for Piper TTS
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       python3-venv \
       ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install production Node dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Dedicated Piper environment
RUN python3 -m venv /opt/piper-venv \
    && /opt/piper-venv/bin/pip install --no-cache-dir piper-tts==1.7.0

# Download Indonesian Piper voice into the image
RUN mkdir -p /app/piper-voices \
    && /opt/piper-venv/bin/python -m piper.download_voices \
       id_ID-news_tts-medium \
       --data-dir /app/piper-voices

# Copy application source
COPY . .

ENV PIPER_PYTHON=/opt/piper-venv/bin/python
ENV PIPER_DATA_DIR=/app/piper-voices
ENV PIPER_VOICE=id_ID-news_tts-medium
ENV PIPER_MAX_CHARS=3000
ENV PIPER_TIMEOUT_MS=30000

CMD ["node", "server.js"]