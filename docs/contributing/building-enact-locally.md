---
title: Building Enact Locally
---

The Enact CLI makes it very easy to consume Enact.  However, if you want to contribute to the project,
you will need to be able to build Enact locally.  Enact is structured as a [monorepo](https://danluu.com/monorepo/), using [Lerna](https://github.com/lerna/lerna) to manage dependencies.

To get started, clone Enact from GitHub, install dependencies and connect the modules using Lerna:

```shell
# clone the repo!
git clone git@github.com:enyojs/enact.git
# move in
cd enact
# we're using git flow so develop is our working branch
git checkout develop
# install lerna
npm install
# run the lerna bootstrap command (proxied by an npm script)
npm run bootstrap
# wait a while … installing :allthethings:
```

Once this process completes, you can begin working with Enact, run unit tests or the sampler. To use Enact with your apps, you will need to `npm link` each submodule:

```shell
npm run lerna -- exec -- npm link
```

Once this process is complete, you can use the Enact cli to link the dependencies to your app:

```shell
# from within your app directory
enact link
```
