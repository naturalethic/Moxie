# Moxie

An experimental UI for administration of [mox](https://github.com/mjl-/mox).

---

### *Warning*

*This is a prototype for exploration, do not use it against a production mox server.*

---

### Goals

- Small package size (currently 123k, 26k gzipped)
- Parity, at minimum, with mox built-in UI capability
- Friendly UX
- Easy static deployment
- Symbiosis with mainline Mox development

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
