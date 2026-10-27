# Purels API and worker

Purels is an open-source, self-hosted URL shortener. Create short links, use
custom domains, and review click statistics from your own deployment.

This image contains the Go API, redirect handler, and background worker. Its
default entrypoint starts the API; set the entrypoint to `/app/purels-worker`
to run the worker. The complete stack also needs PostgreSQL, Redis, the
`puremixai/purels-web` image, and a reverse proxy.

## Getting started

Follow the [Docker Compose instructions](https://github.com/puremixai/purels#quick-start)
to start the complete stack using Docker Hub images or a local build. The
repository contains the SQL migrations; use migrations matching your image
version. The example Compose configuration is for local development and must
be configured for production before exposing it publicly.

## Image tags

Releases publish `latest`, a Git version tag, and `sha-<full-commit-sha>`.
The earlier `v0.1.0` release has no version image tag; use its SHA tag. Images are
currently built for `linux/amd64` and `linux/arm64`.

[Source and documentation](https://github.com/puremixai/purels) ·
[中文文档](https://github.com/puremixai/purels/blob/main/README.zh-CN.md) ·
[Apache 2.0 license](https://github.com/puremixai/purels/blob/main/LICENSE)
