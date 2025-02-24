# BAS Embedded Maps Service

Simple embeddable maps for visualising a feature on a suitable basemap.

## Overview

**Note:** This project is focused on needs within the British Antarctic Survey. It has been open-sourced in case it is
of interest to others. Some resources, indicated with a '🛡' or '🔒' symbol, can only be accessed by BAS staff or
project members respectively. Contact the [Project Maintainer](#project-maintainer) to request access.

This project provides a service for applications to embed simple maps of the Polar Regions.
- maps are embedded via an iframe and the display of features is controlled by query parameters
- maps use a basemap based on the feature geometry (i.e. if in the Antarctic, an Antarctic basemap)
- maps use fixed and minimal map controls and feature symbology

### Status
The initial version of this service is intended for use in the [ADD Metadata Toolbox 🛡️](https://gitlab.data.bas.ac.uk/MAGIC/add-metadata-toolbox) only

## Usage
The service supports four map projections that are automatically selected based on the provided geometry:

- Antarctic projection (latitude ≤ -60°)
- Arctic projection (latitude ≥ 60°)
- World projection (latitudes between -60° and 60°)
- South Georgia projection (latitude between -55.200717 and -53.641972 and longitude between -38.643677 and -35.271423)

Maps can be configured using the following query parameters:

**View Configuration:**
- `center`: Initial center coordinates [longitude, latitude] `array[number, number]`
- `zoom`: Initial zoom level `number`
- `scale`: Initial scale level `number`
- `bbox`: Bounding box coordinates [minX, minY, maxX, maxY] `array[number, number, number, number]`
- `show-region`: Whether to zoom to the basemap region `boolean`

**Asset Display:**
- `asset-id`: Asset ID to display on the map `string`
- `show-asset-popup`: Whether to show the asset popup `boolean`

**UI Controls:**
- `globe-overview`: Whether to show a globe overview `boolean`
- `hide-ui`: Whether to hide the map controls `boolean`
- `show-full-screen`: Whether to enable fullscreen mode `boolean`

For an Antarctic map:

```html
<iframe 
  src="https://embedded-maps.data.bas.ac.uk/v1/?center=[-180, -90]&zoom=6&globe_overview=true" 
  style="border:none;"
  allowfullscreen="true"
  allow="fullscreen">
</iframe>
```

**Note:** To enable fullscreen functionality, the `allowfullscreen` and `allow="fullscreen"` attributes must be added to the iframe element.

## Implementation

### App

The application is built using React and the ArcGIS Maps SDK for JavaScript. Key features include:

- Automatic projection selection based on geometry location
- Support for different basemaps optimized for Antarctic, Arctic, and World views
- Built-in map controls (zoom, home)
- Optional globe overview
- Loading states and error handling

### Basemaps

This service uses basemaps as determined by [MAGIC/esri#86 🛡️](https://gitlab.data.bas.ac.uk/MAGIC/esri/-/issues/86).

Each projection comes with an optimized basemap and view configuration for the best visualization of features in that region.

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

To set up the project locally, follow these steps:

```shell
npm install
npm run dev
```

**Note:** Node.js is required to run the project.

### Health monitoring

`$ENDPOINT/meta/health.json` provides service health information formatted according to the 
[api-health-check](https://inadarei.github.io/rfc-healthcheck/) specification. This endpoint should be used to monitor
the health of this service.

## Deployment

The application will be automatically deployed to S3 using [Continuous Deployment](#continuous-deployment).

### Continuous Deployment

A Continuous Deployment process using GitLab's CI/CD platform is configured in [`.gitlab-ci.yml`](/.gitlab-ci.yml). 

## Project maintainer

Mapping and Geographic Information Centre ([MAGIC](https://www.bas.ac.uk/teams/magic)), British Antarctic Survey
([BAS](https://www.bas.ac.uk)).

Project lead: [@felnne](https://www.bas.ac.uk/profile/felnne).

## License

Copyright (c) 2024-2025 UK Research and Innovation (UKRI), British Antarctic Survey (BAS).

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
