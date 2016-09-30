# Getting Started Notes

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
# wait a while … installing enyo-config, react, ... :allthethings:
```

You'll probably want to `npm link` the enact modules into your app (e.g. rigby). Once the bootstrap is complete, you can link everything up with this command. It tells the local lerna (`npm run lerna --`) to execute (`exec --`) the `npm link` command on every module in `packages/`.

```shell
npm run lerna -- exec -- npm link
```

Then from your app, you can link everything in and then install dependencies:

```shell
npm link @enact/core @enact/ui @enact/i18n @enact/spotlight @enact/moonstone
npm install
```

# Troubleshooting

## Node/NPM versions

Noticing some intermittent errors depending on your node/npm version. We've seen it work with node 4.4.7 and npm 2.15.8 and node 6.5.0 and npm 3.10.3. Worth trying if you're seeing errors on bootstrap.
