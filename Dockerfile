# build client
FROM node:24 AS client
WORKDIR /app
COPY client .
RUN npm i && npm run build

# build server
FROM golang:1.25 AS server
WORKDIR /app
COPY server .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server.exe cmd/server.go

# prod container
FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=server /app/server.exe .
COPY --from=client /app/dist ./client
ENTRYPOINT ["./server.exe"]
