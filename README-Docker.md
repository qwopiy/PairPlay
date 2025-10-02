# PairPlay — Docker (Static ES Modules via Node + serve)

This app is a static website (no backend) that uses ES module scripts. The Docker image serves it using Node.js and the `serve` package.

## Files
- `Dockerfile` — builds a small Node image and serves the current directory with `serve`.
- `.dockerignore` — trims build context.

## Build and run (Windows cmd)

```cmd
REM Build the image
docker build -t pairplay:static .

REM Run the container on port 8080
docker run --rm -p 8080:80 pairplay:static
```

Open http://localhost:8080

## Notes
- ES modules: `serve` sets correct MIME types for `.js`/`.mjs` out of the box.
- SPA fallback (optional): To enable fallback to `index.html` for unknown routes, add `-s` to the command.
  - Example entrypoint: `CMD ["serve", "-s", "-l", "80", "."]`
- Static-only: There’s no PHP or database in this image.

## Dev mode (no rebuild)
Serve your working directory directly with stock Node + `serve` (no Dockerfile):
```cmd
docker run --rm -p 8080:80 -v %cd%:/app:ro node:20-alpine sh -c "npm i -g serve && serve -l 80 /app"
```
Edit files and refresh the browser; the container serves directly from your local folder.
