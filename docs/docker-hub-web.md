# Purels web console

Purels is an open-source, self-hosted URL shortener. Create short links, use
custom domains, and review click statistics from your own deployment.

This image contains the Next.js landing page and administration console. It
works with `puremixai/purels-api`; the complete stack also needs the worker,
PostgreSQL, Redis, and a reverse proxy.

## Getting started

Follow the [Docker Compose instructions](https://github.com/puremixai/purels#quick-start)
to start the complete stack using Docker Hub images or a local build. The
repository contains the SQL migrations; use migrations matching your image
version. The example Compose configuration is for local development and must
be configured for production before exposing it publicly.

The image is built to proxy API requests to `http://api:8080`. Deployments
using a different service name need an `api` network alias or a rebuilt Web
image. Set `API_PROXY_TARGET` at runtime for server-side requests as described
in the documentation.

## Image tags

Releases publish `latest`, a Git version tag, and `sha-<full-commit-sha>`.
The earlier `v0.1.0` release has no version image tag; use its SHA tag. Images are
currently built for `linux/amd64`.

[Source and documentation](https://github.com/puremixai/purels) ·
[中文文档](https://github.com/puremixai/purels/blob/main/README.zh-CN.md) ·
[Apache 2.0 license](https://github.com/puremixai/purels/blob/main/LICENSE)
