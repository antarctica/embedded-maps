# BAS Embedded Maps Service - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

* Scale bar control 
  [#10](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/10)
* Theme support based on user OS preferences 
  [#14](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/14)
* Fullscreen map control 
  [#11](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/11)
* Parameter for showing asset popup 
  [#25](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/25)
* Added end-to-end tests for map 
  [#12](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/12)

### Changed

* Refactored query parameters to use kebab-case
* Enabled resampling on basemap layers to prevent disappearing from view 
  [#17](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/17)
* Using profiles for passing AWS credentials in Terraform
  [#29](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/29)
* Switching to production assets layer
  [#20](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/20)
* Hiding non-selected assets when filtering rather than showing as faded
  [#30](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/30)
* Reimplementing health check within React app
  [#7](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/7)
* Updating dependencies
  [#32](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/32)
* Updating documentation
  [#26](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/26)

### Fixed

* Globe overview now matches basemap rotation for polar coordinate systems 
  [#15](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/15)
* Support for bounding box marker on globe overview 
  [#16](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/16)
* S3 CORS configuration
  [#28](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/28)

### Removed
* Outdated testing documentation

## [0.1.3] 2025-02-11

### Added

* Query parameters for `center`, `zoom`, `scale`, `bbox`, `globe_overview`, `asset_id`, `hide_ui`, `show_region`
* Playwright end to end tests
* Unit tests for bbox logic
* Basemap config

### Fixed

* Asset icon headings in polar projections

### Changed

* Refactored embeded map component to use arcgis and react

## [0.1.2] 2025-01-16

### Added

* Test pages for hosted environments
  [#6](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/6)
* Continuous Deployment environments
  [#5](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/5)
* Automated GitLab releases via Continuous Deployment
  [#4](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/4)

### Changed

* Updating project name to 'Embedded Maps Service' (rather than 'Embedded Maps')

## [0.1.1] 2024-11-06

### Fixed

* Hiding CSS overflows

## [0.1.0] 2024-11-06

### Added

* Minimal app implementation using static images for Well Known Extents only
  [#2](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/2)
* Initial project setup
  [#1](https://gitlab.data.bas.ac.uk/MAGIC/embedded-maps/-/issues/1)
