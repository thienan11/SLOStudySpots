export default {
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
      "/study-spots": "http://localhost:3000"
    }
  }
};