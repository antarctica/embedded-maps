# BAS Embedded Maps

Embeddable maps for visualising a feature on a suitable base map.

## Overview

**Note:** This project is focused on needs within the British Antarctic Survey. It has been open-sourced in case it is
of interest to others. Some resources, indicated with a '🛡' or '🔒' symbol, can only be accessed by BAS staff or
project members respectively. Contact the [Project Maintainer](#project-maintainer) to request access.

This project provides a service applications can use to embed simple maps via an iframe of a single feature's geometry 
given by a query string parameter. 

These maps use a suitable basemap based on the feature geometry (i.e. Antarctic/Arctic/World/etc.) is used, with fixed 
and minimal map controls and feature symbology. 

Where a geometry is known to give a poor result (such as a bounding box covering Antarctica), a densified polygon will
be substituted automatically.

### Status

The initial version of this service:

- has very limited support for a fixed set of geometries only
- is intended for use in the [ADD Metadata Toolbox 🛡️](https://gitlab.data.bas.ac.uk/MAGIC/add-metadata-toolbox) only

## Usage

For an Antarctic map:

```html
<iframe src="https://embedded-maps.data.bas.ac.uk/v1/?geom=%5B%5B%5B-180%2C%20-90%5D%2C%5B180%2C%20-90%5D%2C%5B180%2C%20-60%5D%2C%5B-180%2C%20-60%5D%2C%5B-180%2C%20-90%5D%5D%5D" style="border:none;"></iframe>
```

For a sub-Antarctic map:

```html
<iframe src="https://embedded-maps.data.bas.ac.uk/v1/?geom=geom=%5B%5B%5B-180%2C-60%5D%2C%5B180%2C-60%5D%2C%5B180%2C-50%5D%2C%5B-180%2C-50%5D%2C%5B-180%2C-60%5D%5D%5D" style="border:none;"></iframe>
```

**Note:** Requests for any other geometries will return a null response (grey square).

## Implementation

### App

A very simple placeholder app is used to parse the geometry query string value and use this to set the href of an 
`<img>` element. I.e. if the geom matches the [Well Known Extent](#well-known-extents) for Antarctica, the href to an 
image of map with the relevant extent shown is used.

`public/index.html` acts as the app entry point and template. `public/assets/js/main.js` contains all logic, including
locally defined [Well Known Extents](#well-known-extents).

### Basemaps

This service uses basemaps as determined by [MAGIC/esri#86 🛡️](https://gitlab.data.bas.ac.uk/MAGIC/esri/-/issues/86).

### Well Known Regions

Well Known Regions represent commonly referenced and understood areas of the world.

Supported regions are currently defined indirectly via their extents locally within `public/assets/js/main.js`.

### Well Known Extents

Well Known Extents represent commonly (if not officially) agreed upon bounding extents for 
[Well Known Regions](#well-known-extents). They consist of a bounding box expressed as a GeoJSON formatted geometry.

Supported extents are currently defined locally within `public/assets/js/main.js`.

## Setup

### Terraform

[Terraform](https://terraform.io) resources are defined in [`provisioning/terraform/`](/provisioning/terraform/).

Access to the [BAS AWS account 🛡️](https://gitlab.data.bas.ac.uk/WSF/bas-aws) is required to provision these resources.
Docker and Docker Compose are recommended but not required for running Terraform.

```shell
$ cd provisioning/terraform
$ docker compose run terraform

$ terraform init
$ terraform ...
```

#### Terraform remote state

State information for this project is stored remotely using a
[Backend](https://www.terraform.io/docs/backends/index.html).

Specifically the [AWS S3](https://www.terraform.io/docs/backends/types/s3.html) backend as part of the
[BAS Terraform Remote State 🛡️](https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state) project.

Remote state storage will be automatically initialised when running `terraform init`. Any changes to remote state will
be automatically saved to the remote backend, there is no need to push or pull changes.

##### Remote state authentication

Permission to read and/or write remote state information for this project is restricted to authorised users. Contact
the [BAS Web & Applications Team](mailto:servicedesk@bas.ac.uk) to request access.

See the [BAS Terraform Remote State 🛡️](https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state) project for how these
permissions to remote state are enforced.

## Developing

```
$ python -m http.server 9000 --directory public
```

## Testing

For local testing, with the app running locally run in a separate terminal:

```
$ python -m http.server 9001 --directory tests
```

For remote testing, manually visit:

- `$ENDPOINT/?geom=%5B%5B%5B-180%2C%20-90%5D%2C%5B180%2C%20-90%5D%2C%5B180%2C%20-60%5D%2C%5B-180%2C%20-60%5D%2C%5B-180%2C%20-90%5D%5D%5D` (Antarctica)
- `$ENDPOINT/?geom=%5B%5B%5B-180%2C-60%5D%2C%5B180%2C-60%5D%2C%5B180%2C-50%5D%2C%5B-180%2C-50%5D%2C%5B-180%2C-60%5D%5D%5D` (Sub Antarctica)

Where `$ENDPOINT` is:

- `https://embedded-maps-testing.bas.ac.uk/v1/` (integration)
- `https://embedded-maps.bas.ac.uk/v1/` (integration)

These URLs should return an expected map of each of these [Well Known Regions](#well-known-regions) based on their 
[Well Known Extents](#well-known-extents).

### Health monitoring

`$ENDPOINT/meta/health.json` provides service health information formatted according to the 
[api-health-check](https://inadarei.github.io/rfc-healthcheck/) specification. This endpoint should be used to monitor
the health of this service.

## Deployment

The application will be automatically deployed to S3 using [Continuous Deployment](#continuous-deployment).

### Continuous Deployment

A Continuous Deployment process using GitLab's CI/CD platform is configured in [`.gitlab-ci.yml`](/.gitlab-ci.yml). 

## Project maintainer

British Antarctic Survey ([BAS](https://www.bas.ac.uk)) Mapping and Geographic Information Centre
([MAGIC](https://www.bas.ac.uk/teams/magic)). Contact [magic@bas.ac.uk](mailto:magic@bas.ac.uk).

The project lead is [@felnne](https://www.bas.ac.uk/profile/felnne).

## License

Copyright (c) 2024 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
