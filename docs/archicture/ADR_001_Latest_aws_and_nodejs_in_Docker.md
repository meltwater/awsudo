# ADR 001: Latest aws and nodejs in Docker

## Context

Stated in issue [#67]

> As of version 1.7.1, the Docker image includes woefully out-of-date versions of nodejs (v12/erbium) and the AWS CLI (v1.18.106).

It's useful to include these:

* nodejs is a runtime dependency of awsudo itself
* `aws` is central to most uses of awsudo

Due to its relatively short (30 month) LTS cycle, it's useful to support multiple versions of nodejs.

AWS CLI v2 has been the latest version for over 2 years and maintains backward compatibility within its major version.

Docker images are often the basis of other images which rely on OS features (e.g. package management tools)

## Decision

* Docker images are tagged to specify
    * awsudo version
    * nodejs version (by LTS codename)
    * Ex: `:v1.7.2-gallium` 
* Unspecified tag values "slide" to the latest version
     * Ex: these tags would be equivalent:
         * `:v1.7.2`
         * `:gallium`
         * `:latest`
* Docker images are produced for every nodejs version until their [end-of-life][nodejs releases]
* The most recent `aws` version (at build time) is included
* The Docker image is based on the equivalent [node image]

## Status

[Trial application][Generate Docker images based on node] while [seeking feedback][#67]

## Consequences

* Docker images with current dependencies will be available 
* Sliding versions may break dependents that directly rely on the unspecific dependency

[#67]: https://github.com/meltwater/awsudo/issues/67
[node image]: https://hub.docker.com/_/node
[nodejs releases]: https://nodejs.org/en/about/releases/
[Generate Docker images based on node]: https://github.com/meltwater/awsudo/pull/66
