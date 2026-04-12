import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("you just built a server in node.js");
});

server.listen(3000, () =>
  console.log("server is running on port http://localhost:3000"),
);
