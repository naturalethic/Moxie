# Moxie

An experimental UI for administration of [mox](https://github.com/mjl-/mox).

---

### *Warning*

*This is a prototype for exploration, do not use it against a production mox server.*

---

### Goals

- Small package size
- Parity, at minimum, with mox built-in UI capability
- Friendly UX
- Easy static deployment
- Symbiosis with mainline Mox development

### Distribution

```
dist/index.html    0.32 kB │ gzip:  0.23 kB
dist/index.css    23.21 kB │ gzip:  5.49 kB
dist/index.js    127.64 kB │ gzip: 26.89 kB
```

### Deployment

Specific deployment instructions to a production setup TBD.  It may be as easy as copying the distribution to a folder, and pointing a Mox static web handler at it.

### Foundation

This app provides it's own UI kit, developed against a [solid](https://github.com/solidjs/solid) runtime.  It leverages [valibot](https://github.com/fabian-hiller/valibot) for form validation. These are the only runtime dependencies.

Build dependencies include [vite](https://github.com/vitejs/vite), [tailwind](https://github.com/tailwindlabs/tailwindcss), and a few others (see package.json).

### Development

Install dependencies:

`npm install`

Make sure you have golang installed and build a local test version of mox:

`npm run test:mox:build`

Run that in a separate window:

`npm run test:mox:serve`

Finally,

`npm run dev`

### Developing against a deployed instance of mox

Please don't use this configuration for production.

Configure `.env.dev` with the proper values.  `VITE_SERVER_PROXY` is the endpoint to your mox web server.

### Bundle analysis

To get a nice visual breakdown of bundle composition, run:

`npm run analyze`

### Testing

Run unit tests under the `src` folder:

`npm run test`

End to end tests are implemented with [cypress](cypress.io).

These require properly setting up and running the mox test server.

Reset the test server to a clean slate:

`npm run test:mox:clean`

Run it:

`npm run test:mox:serve`

In another terminal, first backup the mox data, this will be restored on every test run:

`npm run test:mox:backup`

To run the cypress tests from the command line:

`npm run test:e2e`

To open the gui:

`npm run test:e2e:gui`
