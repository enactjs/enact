---
title: Building Enact Locally
---

The Enact CLI makes it very easy to consume Enact.  However, if you want to contribute to the project,
you will need to be able to build Enact locally.  Enact is structured as a [monorepo](https://danluu.com/monorepo/), using [pnpm workspaces](https://pnpm.io/workspaces) to install and link packages. [Lerna](https://github.com/lerna/lerna) is still used for versioning and publishing.

To get started, clone Enact from GitHub and install the workspace with pnpm:

```shell
# clone the repo!
git clone git@github.com:enactjs/enact.git
# move in
cd enact
# we're using git flow so develop is our working branch
git checkout develop
# enable Corepack so the repo's packageManager pin is used
corepack enable
# install all workspace packages and link local @enact/* dependencies
pnpm install
```

Once this process completes, you can begin working with Enact, run unit tests, or run the sampler. To use the local Enact install with your apps or our theme libraries like Sandstone, you will first need to `npm link` each submodule manually or use the `link-all` task:

```shell
pnpm run link-all
```

Once this process is complete, you can use the Enact CLI to link the dependencies to your app or our theme libraries:

```shell
# from within your app/our theme libraries directory
enact link
```

Please note that the Enact CLI provides a command `enact bootstrap` to install dependencies and link Enact packages in one step:

```shell
# from within your app/our theme libraries directory
enact bootstrap
```
