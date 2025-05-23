# BAS Embedded Maps Service

Embeddable maps for visualising simple features on a suitable basemap.

## Overview

This service allows basic maps to be created using URL parameters.

Features include:

- an optional 3D locator globe
- optional interactive controls (such as toggling full-screen mode)
- focusing on a given point, bounding box, or latest position of a BAS asset (ship, plane, etc.)
- using a suitable basemap and projection for the map extent (e.g. an Antarctic stereographic basemap if in Antarctica)
- support for embedding within other applications or websites using an iframe (to avoid large dependencies)

Examples:

<table style="width: 100%; table-layout: fixed; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/antarctica/embedded-maps/blob/v0.2.0/docs/example-1.png" alt="example-antarctica" style="width: 100%; height: auto;" />
    </td>
    <td style="width: 50%; text-align: center;">
      <img src="https://github.com/antarctica/embedded-maps/blob/v0.2.0/docs/example-2.png" alt="example-ship-tracking" style="width: 100%; height: auto;" />
    </td>
  </tr>
  <tr>
    <td style="width: 50%; text-align: center; word-wrap: break-word;">
      <code>https://embedded-maps.data.bas.ac.uk/v1/?bbox=[-180, -90, 180, -60]</code>
    </td>
    <td style="width: 50%; text-align: center; word-wrap: break-word;">
      <code>https://embedded-maps.data.bas.ac.uk/v1/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&amp;scale=500000&amp;globe-overview</code>
    </td>
  </tr>
</table>

> [!TIP]
> See the [Examples](#examples) section for additional examples.

This service is operated by the [Mapping and Geographic Information Centre](https://www.bas.ac.uk/teams/magic) (MAGIC),
who provide geospatial information, expertise and services to the [British Antarctic Survey](https://www.bas.ac.uk) 
(BAS) and wider UK activity in the polar regions.

> [!NOTE]
> This project is focused on needs within the British Antarctic Survey. It has been open-sourced in case it is
of interest to others. Some resources, indicated with a '🛡' or '🔒' symbol, can only be accessed by BAS staff or
project members respectively. Contact the [Project Maintainer](#project-maintainer) to request access.

### Status

> [!IMPORTANT]
> This is a beta service and is available for general use but may contain bugs.
>
> We [welcome feedback](mailto:magic@bas.ac.uk) from users on how it can be made better.

## Usage

This service is accessed from a base endpoint and configured using one or more [Parameters](#parameters), including the 
target location / feature / asset for the map and which UI controls are visible.

Base endpoint: https://embedded-maps.data.bas.ac.uk/v1/

[OpenAPI schema](/docs/openapi.yml).

### Basemaps

A suitable basemap and projection is used based on the map extent:

- For latitudes ≤ -50°, an Antarctic projection
- For latitudes ≥ 60°, an Arctic projection
- For latitudes between -50° and 60°, a World projection
- For latitudes between -55.200717 to -53.641972 and longitudes between -38.643677 to -35.271423, a South Georgia projection

> [!TIP]
> The basemaps used for these projections are either created or recommended by 
> [MAGIC](https://www.bas.ac.uk/teams/magic) for general use.

### Parameters

Maps are configured using query parameters. If no parameters are set, a default map centre and zoom will be used.

#### Global parameters

| Parameter | Description        | Default     | Example     |
|-----------|--------------------|-------------|-------------|
| `zoom`    | Initial zoom level | 0           | 6           |
| `scale`   | Initial map scale  | -           | 500,000     |

> [!NOTE]
> If both `zoom` and `scale` are set, `zoom` will be used as it sets a scale internally.

#### Location parameters

Set these parameters to show a specific location:

| Parameter | Description                        | Default     | Example     |
|-----------|------------------------------------|-------------|-------------|
| `centre`  | A [longitude, latitude] coordinate | [-180, -90] | [-180, -90] |

#### Bounding box parameters

Set these parameters to visualise a 2D bounding box:

| Parameter                    | Description                                      | Default     | Example                    |
|------------------------------|--------------------------------------------------|-------------|----------------------------|
| `bbox`                       | Single bounding box [minX, minY, maxX, maxY] or array of bounding boxes | -           | [-180.0,-90.0,180.0,-60.0] or [[-180.0,-90.0,180.0,-60.0], [-68.3359,-67.5894,-68.0677,-67.4869]] |
| `bbox-force-regional-extent` | Ensure `bbox` is shown at the full basemap extent | false       | true                       |

When defining a bounding box that crosses the antimeridian (180°/-180° longitude), use a larger value for the western edge (minX) than the eastern edge (maxX). For example:

```
[170.0, -70.0, -170.0, -60.0]  # Single bbox crossing antimeridian (valid)
[-170.0, -70.0, 170.0, -60.0]  # Single bbox not crossing antimeridian (valid)
[[170.0, -70.0, -170.0, -60.0], [-68.3359,-67.5894,-68.0677,-67.4869]]  # Multiple bboxes (valid)
```

This follows the OGC API Features specification for handling bounding boxes that cross the antimeridian.

> [!NOTE]
> A `bbox` value will override the `centre`, `scale` and `zoom`  parameters if set.
>
> Setting `bbox-force-regional-extent` without a value evaluates to true. Use `bbox-force-regional-extent=false` to override.


#### Point parameters

Set these parameters to visualize one or more points on the map:

| Parameter | Description                                      | Default     | Example                    |
|-----------|--------------------------------------------------|-------------|----------------------------|
| `points`  | Single point or array of points. Each point can be either a [longitude, latitude] coordinate pair or an object with `longitude`, `latitude`, optional `color`, and optional `size` properties | -           | `[[-90, -0]]` or `[{"longitude": 106.8, "latitude": -75.1, "color": "green", "size": 15}]` |



> [!NOTE]
> When using styled points, the `color` property accepts any valid CSS color value, and `size` is specified in pts.
> Multiple points can be mixed between coordinate pairs and styled points in the same array.



#### UI control parameters

Set these parameters to enable or disable map controls:

| Parameter         | Description                    | Default | Example |
|-------------------|--------------------------------|---------|---------|
| `ctrl-zoom`       | Show zoom in/out control       | true    | true    |
| `ctrl-reset`      | Show view reset (home) control | true    | true    |
| `ctrl-fullscreen` | Show fullscreen view control   | false   | true    |
| `graticule`       | Show graticule grid lines      | false   | true    |

> [!NOTE]
> Setting a parameter without a value evaluates to true. Use `{parameter}=false` to override.
>
> All maps will also include scale and attribution UI controls which cannot be disabled.

#### Overview parameters

Set these parameters to enable or disable a 3D locator globe:

| Parameter        | Description           | Default | Example |
|------------------|-----------------------|---------|---------|
| `globe-overview` | Show 3D locator scene | false   | true    |

> [!NOTE]
> Setting `globe-overview` without a value evaluates to true. Use `globe-overview=false` to override.

#### Asset Tracking Service parameters

Set these parameters to visualise the last known position of an asset tracked by the BAS 
[Assets Tracking Service](https://github.com/antarctica/assets-tracking-service):

| Parameter           | Description                     | Default | Example                      |
|---------------------|---------------------------------|---------|------------------------------|
| `asset-id`          | ID of the asset to visualise    | -       | `01JDRYA29AR6PFGXVCZ40V8C74` |
| `asset-type`        | Type code to filter assets by   | -       | `98` (Snowmobile), `62` (Aeroplane) |
| `asset-force-popup` | Open popup for asset by default | false   | true                         |

> [!TIP]
> Values for `asset-id` can be found in the
[Latest Assets Position](https://data.bas.ac.uk.item/260298c6-8b63-4def-b0c3-964986a8bd24) dataset.

> [!NOTE]
> Setting `asset-force-popup` without a value evaluates to true. Use `asset-force-popup=false` to override.

### Examples

Centre map at a specific location and zoom level:

```
https://embedded-maps.data.bas.ac.uk/v1/?centre=[0.1218,52.2053]&zoom=4
```

Show a bounding box with a globe overview for orientation:

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[-68.3359,-67.5894,-68.0677,-67.4869]&globe-overview
```

Show multiple bounding boxes with a globe overview:

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[[-68.3359,-67.5894,-68.0677,-67.4869],[-67.5894,-66.5894,-67.0677,-66.4869]]&globe-overview
```

Show a bounding box, zoomed out to show the full basemap:

```
https://embedded-maps.data.bas.ac.uk/v1/?bbox=[10.0,74.0,35.0,81.0]&bbox-force-regional-extent
```

Show multiple points with different styles and a globe overview:

```
https://embedded-maps.data.bas.ac.uk/v1/?points=[[-68.3359,-67.5894],{"longitude":106.8,"latitude":-75.1,"color":"green","size":15}]&globe-overview
```

Enable all available map controls (zoom and reset are also shown by default):

```
https://embedded-maps.data.bas.ac.uk/v1/?ctrl-zoom&ctrl-reset&ctrl-fullscreen
```

Disable all optional map controls:

```
https://embedded-maps.data.bas.ac.uk/v1/?ctrl-zoom=false&ctrl-reset=false&ctrl-fullscreen=false
```

Show the latest position of the SDA:

```
https://embedded-maps.data.bas.ac.uk/v1/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&scale=500000&globe-overview
```

Show the latest position of the SDA on a non-interactive display:

```
https://embedded-maps.data.bas.ac.uk/v1/?asset-id=01JDRYA29AR6PFGXVCZ40V8C74&asset-force-popup&scale=500000&globe-overview&ctrl-zoom=false&ctrl-reset=false&ctrl-fullscreen=false
```

Show all snowmobiles with a globe overview:

```
https://embedded-maps.data.bas.ac.uk/v1/?asset-type=98&globe-overview
```

### Embedding

Maps can be embedded in other applications and websites using an iframe.

For example:

```html
<iframe src="https://embedded-maps.data.bas.ac.uk/v1/?center=[-180, -90]" style="border:none;"></iframe>
```

> [!IMPORTANT]
> If the fullscreen UI control is enabled, the `allowfullscreen` and `allow="fullscreen"` attributes must be included 
> in the iframe. For example:

```html
<iframe 
  src="https://embedded-maps.data.bas.ac.uk/v1/?center=[-180, -90]&zoom=6&globe_overview=true" 
  style="border:none;" allowfullscreen="true" allow="fullscreen"
></iframe>
```

> [!NOTE]
> Some websites or platforms (such as SharePoint) restrict which domains can be embedded and will need adjusting.
> We recommend allowing both `https://embedded-maps.data.bas.ac.uk` and `https://embedded-maps-testing.data.bas.ac.uk`.

> [!TIP]
> These domains are already allowed for the BAS Iceflow SharePoint site [🛡️].

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

State information for this project is stored remotely as part of the
[BAS Terraform Remote State 🛡️](https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state) project.

Changes to remote state will be automatically saved to the remote backend, there is no need to push or pull changes.

##### Remote state authentication

Permission to read and/or write remote state information for this project is restricted. See the 
[BAS Terraform Remote State 🛡️](https://gitlab.data.bas.ac.uk/WSF/terraform-remote-state) project for more information.

## Developing

To set up a local development environment (with Node.js installed):

```shell
npm install
npm run dev
```

## Testing

Playwright is used for end-to-end testing, including [Visual Regression Testing](#visual-regression-testing). 

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

These patterns can also be used with `npm run test:e2e:update` to update snapshots for specific tests.

### Visual Regression Testing

Visual regression testing using screenshot comparisons are used to guard against unexpected UI changes.
Snapshots are stored in `.test/spec/snapshots` and must be explicitly updated when UI changes are intended.

To update reference screenshots:

1. make your UI changes
2. run tests (`npm run test:e2e`)
3. if tests fail due to visual differences:
   - review the differences in the test report
   - if changes are expected, update snapshots: `npm run test:e2e:update`
   - if changes are unexpected, fix the UI issues

### Testing environment

Base endpoint for testing: https://embedded-maps-testing.data.bas.ac.uk/v1/

> [!WARNING]
> The test endpoint is used for prototyping upcoming changes and is not stable. Do not use it unless you are told to.

## Deployment

The application will be automatically deployed using [Continuous Deployment](#continuous-deployment).

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
