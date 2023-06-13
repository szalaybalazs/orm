<a id="readme-top" name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">PostgresORM</h3>

  <p align="center">
    Advanced PostgreSQL ORM and Query Builder.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/szalaybalazs/orm/issues">Report Bug</a>
    ·
    <a href="https://github.com/szalaybalazs/orm/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <!-- <li><a href="#prerequisites">Prerequisites</a></li> -->
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
    <a href="#usage">Usage</a>
      <ul>
        <li><a href="#examples">Examples</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![ORM NAME](/assets/banner.png)

A PostgreSQL ORM created to scaffold large-scale and advanced databases.

Currently only supports basic ORM functionalities, planning on added advanced features, such as multi-tenant support and trigger functions.

I am documenting the whole process of creating the package on [twitter](https://twitter.com/szalayme).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

**Coming Soon – Not yet production ready**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

List of all the currently supported commands.

```bash
# Initialise a new, empty configuration
init

# Generate new migration
migration:generate <migration name>

# Create empty migration
migration:create <migration name>

# Run all available migrations
migration:run

# Revert database to the selected migration
migration:revert

# Create a new, empty entity
entity:create

# Generated the types for the currently synced entities
types:generate
```

### Examples

The repo contains an example folder - feel free to clone and play around with it; as always, suggetions are more than welcome.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- ORM
  - [ ] CLI
    - [x] Create new, empty entity
    - [x] Create new, empty migration
    - [x] Generate migration based on entity changes
    - [x] Run all available migrations
    - [x] Revert to a specific migration
    - [ ] Handle other object depend on error when trying to replace a column which is used by a view
    - [ ] Drop migrations
      - [ ] Drop last migration
  - [x] Incremental migrations
  - [x] Keywords in default
  - [x] Indices
  - [ ] Autogenerate table names (pluralize)
  - [x] Handle primary keys
  - [ ] Orm configs
    - [x] js/ts support
    - [x] json support
    - [ ] xml support
    - [ ] yml support
    - [ ] .env support
  - [ ] Plugin manager
  - [ ] Enum support
  - [ ] Foreign key support
    - [ ] Relation support
  - [x] View support
    - [ ] Add 'with check' option
  - [ ] Function support
  - [ ] Trigger support
    - [x] Add `onInsert.set`
    - [x] Add `onUpdate.set`
    - [x] Add `onDelete.set`
    - [x] Add `beforeInsert` procedure SQL code
    - [x] Add `beforeUpdate` procedure SQL code
    - [x] Add `beforeDelete` procedure SQL code
    - [ ] Add `preventDefault` logic
    - [ ] Add conditional logic
  - [ ] GIS Support
  - [ ] Convert codebase to classes for easier maintenance
  - [ ] Handle naming conventions
  - [ ] Add warnings to operations with potential data loss
  - [ ] Add `pull` command
- Query Builder
- Graphql Types

See the [open issues](https://github.com/szalaybalazs/orm/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Balazs Szalay - [@szalayme](https://twitter.com/szalayme) - balazs@szalay.me

<p align="right">(<a href="#readme-top">back to top</a>)</p>
