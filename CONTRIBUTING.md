# Contribution Guidelines

## Table of Contents

- [Development workflow](#development-workflow)
    - [Install dependencies](#install-dependencies)
- [How to contribute](#how-to-contribute)

## Development workflow

We use [pnpm](https://pnpm.js.org/) as our package manager.

### Install dependencies

```bash
git clone git@github.com:pedakihq/pedaki.git
cd pedaki
pnpm install
```

## How to contribute

### Recommended workflow

Open two terminals:
1. In the first one, run `pnpm dev` to start the development server.
2. On the second one, run `pnpm build` to rebuild the project when you make changes.
   1. To sync your changes I recommend to use [yalc](https://github.com/wclr/yalc) to publish your local changes to your local npm registry. (`yalk push` in the packages you want to sync, `yalk add <package-name>` in the project you want to use the local version of the package)

### Useful commands

| Command              | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `pnpm build`         | Build the project   <br/>(add --filter [package] to build only one package) |
| `pnpm build:watch`   | Build the project   (add --filter [package] to build only one package)      |
| `pnpm dev`           | Start the development server                                                |
| `pnpm test`          | Run the tests                                                               |
| `pnpm test:watch`    | Run the tests                                                               |
| `pnpm test:coverage` | Run the tests                                                               |
| `pnpm lint`          | Run the linter                                                              |
| `pnpm check`         | Run the tests and the linter                                                |

### Usefull scripts

You can use the `./bin/init-test` script to create the db environment for the tests.
Or manually start the docker-compose file and apply the migrations.

### Prerequisites

Before you submit your pull request, start by [opening an issue](https://github.com/PedakiHQ/pedaki/issues/new/choose)
describing the problem you want to solve.\
This will allow us to discuss this change and make sure it's not already being worked on.

### When you are done

Check that your code passes the tests and linting:

```bash
pnpm check
```

Finally, push your changes and open a pull request.


