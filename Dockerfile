FROM node:22

RUN apt-get update && apt-get install -y curl

WORKDIR /app

RUN cd /tmp && \
    curl -L https://github.com/official-stockfish/Stockfish/releases/latest/download/stockfish-ubuntu-x86-64-avx2.tar -o stockfish.tar.gz && \
    tar xf stockfish.tar.gz && \
    cd stockfish && \
    mv /tmp/stockfish/stockfish-ubuntu-x86-64-avx2 /usr/local/bin/stockfish && \
    rm -rf /tmp/*

COPY package.json yarn.lock ./
RUN yarn install

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

CMD ["yarn", "dev"]