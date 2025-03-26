# BAS Embedded Maps Service

Embeddable maps for visualising simple features on a suitable basemap.

## Overview

**Note:** This project is focused on needs within the British Antarctic Survey. It has been open-sourced in case it is
of interest to others. Some resources, indicated with a '🛡' or '🔒' symbol, can only be accessed by BAS staff or
project members respectively. Contact the [Project Maintainer](#project-maintainer) to request access.

This project allows users to create basic maps via URL parameters that:

- can include a 3D locator globe
- can include common UI controls (such full-screen mode)
- can focus on a given point and zoom level, a bounding box, or the latest position of a BAS asset
- use a suitable basemap for the map extent (e.g. an Antarctic sterographic basemap if in Antarctica)
- can be embedded within other applications or websites using an iframe (to avoid large dependencies)

### Status

This a beta service and is available for general use but may contain bugs. We welcome feedback from end-users on their
experiences and suggestions on how it can be made better.

## Usage

The service is accessed via a URL endpoint with one or more URL parmeters to specify the target location, feature or 
asset, UI elements and any other options:

Base endpoint: https://embedded-maps.data.bas.ac.uk/v1/

### Basemaps

A suitable basemap and projection is used based on the map extent:

- For latitudes ≤ -60°, an Antarctic projection
- For latitudes ≥ 60°, an Arctic projection
- For latitudes between -60° and 60°, a World projection
- For latitudes between -55.200717 and -53.641972, longitude between -38.643677 and -35.271423: a South Georgia projection

### Parameters

Maps are configured using query parameters. If no parameters are set, a default map centre and zoom will be used.

#### View parameters

Global options:

| Parameter | Description        | Default     | Example     |
|-----------|--------------------|-------------|-------------|
| `zoom`    | Initial zoom level | 0           | 6           |
| `scale`   | Initial map scale  | -           | 500,000     |

Set these parameters to show a specific location:

| Parameter | Description                        | Default     | Example     |
|-----------|------------------------------------|-------------|-------------|
| `centre`  | A [longitude, latitude] coordinate | [-180, -90] | [-180, -90] |

Set these parameters to visualise a 2D bounding box:

| Parameter                    | Description                                  | Default     | Example                    |
|------------------------------|----------------------------------------------|-------------|----------------------------|
| `bbox`                       | Bounding box [minX, minY, maxX, maxY]        | -           | [-180.0,-90.0,180.0,-60.0] |
| `bbox-force-regional-extent` | Ensure `bbox` is shown in a regional context | false       | true                       |

**Note:** A `bbox` value will override the `centre`, `scale` and `zoom`  parameters if set.

**Note:** Setting `bbox-force-regional-extent` without a value evaulates to true. Use `bbox-force-regional-extent=false` to override.

#### UI control parameters

Set these parameters to enable or disable map controls:

| Parameter         | Description                    | Default | Example |
|-------------------|--------------------------------|---------|---------|
| `ctrl-zoom`       | Show zoom in/out control       | true    | true    |
| `ctrl-reset`      | Show view reset (home) control | true    | true    |
| `ctrl-fullscreen` | Show fullscreen view control   | false   | true    |

**Note:** Setting a parameter without a value evaulates to true. Use `{parameter}=false` to override.

**Note:** All maps will also include scale and attribution UI controls which cannot be disabled.

#### Globe overview parameters

Set these parameters to enable or disable a 3D locator globe:

| Parameter        | Description           | Default | Example |
|------------------|-----------------------|---------|---------|
| `globe-overview` | Show 3D locator scene | false   | true    |

**Note:** Setting `globe-overview` without a value evaulates to true. Use `globe-overview=false` to override.

#### Asset Tracking Service parameters

Set these parameters to visualise the last known position of an asset tracked by the BAS 
[Assets Tracking Service](https://github.com/antarctica/assets-tracking-service):

| Parameter           | Description                     | Default | Example                      |
|---------------------|---------------------------------|---------|------------------------------|
| `asset-id`          | ID of the asset to visualise    | -       | `01JDRYA29AR6PFGXVCZ40V8C74` |
| `asset-force-popup` | Open popup for asset by default | false   | true                         |

**Note:** Values for `asset-id` can be found in the
[Latest Assets Position](https://data.bas.ac.uk.item/260298c6-8b63-4def-b0c3-964986a8bd24) dataset.

**Note:** Setting `asset-force-popup` without a value evaulates to true. Use `asset-force-popup=false` to override.

#### Examples

Centre map at a specific location and zoom level:

```
https://embedded-maps.data.bas.ac.uk/v1/?centre=[0.1218,52.2053]&zoom=4
```

Show a bounding box:

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[10.0, 74.0, 35.0, 81.0]
```

Show a bounding box, ensuring the surrounding region is show (useful for bounding boxes covering small areas):

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[-68.3359,-67.5894,-68.0677,-67.4869]&ensure-regional-extent
```

Enable all optional map controls:

```
https://embedded-maps.data.bas.ac.uk/v1/?ctrl-zoom&ctrl-reset&ctrl-fullscreen
```

Disable all optional map controls:

```
https://embedded-maps.data.bas.ac.uk/v1/?ctrl-zoom=false&ctrl-reset=false&ctrl-fullscreen=false
```

Enable globe overview:

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[-69.36,-67.84,-66.72,-66.56]&globe-overview
```

Show the latest position of the SDA:

```
https://embedded-maps.data.bas.ac.uk/v1/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&scale=500000&globe-overview
```

Show the latest position of the SDA on a non-interactive display:

```
https://embedded-maps.data.bas.ac.uk/v1/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&globe-overview&ctrl-zoom=false&ctrl-reset=false&ctrl-fullscreen=false
```

### Embedding

Maps can be embedded in other applications and websites using an iframe.

For example:

```html
<iframe src="https://embedded-maps.data.bas.ac.uk/v1/?center=[-180, -90]&zoom=6&globe_overview=true" style="border:none;"></iframe>
```

**Note:** Some websites or platforms (such as SharePoint) restrict which domains can be embedded and may need adjusting to enable.

**Note:** If the fullscreen UI control is enabled, the `allowfullscreen` and `allow="fullscreen"` attributes must be included in the iframe. For example:

```html
<iframe 
  src="https://embedded-maps.data.bas.ac.uk/v1/?center=[-180, -90]&zoom=6&globe_overview=true" 
  style="border:none;"
  allowfullscreen="true"
  allow="fullscreen"
>
</iframe>
```

## Implementation

### App

The application is built using React and the ArcGIS Maps SDK for JavaScript.

### Basemaps

This service uses basemaps as determined by [MAGIC/esri#86 🛡️](https://gitlab.data.bas.ac.uk/MAGIC/esri/-/issues/86).

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

To set a local development environment (with NodeJS installed):

```shell
npm install
npm run dev
```

## Testing

This project uses Playwright for end-to-end testing, including [Visual Regression Testing](#visual-regression-testing). 

Tests will be run automatically using [Continuous Integration](#continuous-integration).

### Continuous Integration

A Continuous Integration process using GitLab's CI/CD platform is configured in [`.gitlab-ci.yml`](/.gitlab-ci.yml). 

Tests run in a containerized environment that includes a virtual framebuffer 
([xvfb](https://www.x.org/archive/X11R7.7/doc/man/man1/Xvfb.1.xhtml)) to support WebGL for testing the ArcGIS JS SDK.

### Running Tests manually

```shell
# Run all tests
npm run test:e2e

# Update snapshots when UI changes are expected
npm run test:e2e:update

# Run specific tests using grep patterns
TEST_GREP="Map Controls and Parameters" npm run test:e2e    # Run a test suite
TEST_GREP="MapControls.spec" npm run test:e2e               # Run a specific file
TEST_GREP="@accessibility" npm run test:e2e                 # Run tests with a specific tag
```

The `TEST_GREP` environment variable supports:

- Test suite names (e.g., "Map Controls and Parameters")
- Test file names (e.g., "MapControls.spec")
- Test tags (e.g., "@accessibility")
- Regular expressions for more complex patterns

All these patterns can also be used with `npm run test:e2e:update` to update snapshots for specific tests.

### Visual Regression Testing

The project includes visual regression testing where screenshots are compared against stored snapshots. When making UI changes:

1. Make your UI changes
2. Run tests (`npm run test:e2e`)
3. If tests fail due to visual differences:
   - Review the differences in the test report
   - If changes are expected, update snapshots: `npm run test:e2e:update`
   - If changes are unexpected, fix the UI issues

Snapshots are stored in `.test/spec/snapshots` and must be explicitly updated when UI changes are intended.

## Deployment

The application will be automatically deployed to S3 using [Continuous Deployment](#continuous-deployment).

### Continuous Deployment

A Continuous Deployment process using GitLab's CI/CD platform is configured in [`.gitlab-ci.yml`](/.gitlab-ci.yml). 

### Health monitoring

`$ENDPOINT/meta/health.json` provides service health information formatted according to the 
[api-health-check](https://inadarei.github.io/rfc-healthcheck/) specification. This endpoint should be used to monitor
the health of this service.

## Release process

1. change `version` in `package.json`
1. run `npm install` to reflect change in `package-lock.json`
1. run `npm run update-health-check` to reject change in `public/meta/health.json`
1. create version in `CHANGELOG.md`
1. commit and tag in GitLab

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

