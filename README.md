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

Edit `vite.config.ts` and update the `proxy` configuration to point to your mox admin api.

Install dependencies:

`npm install`

As there is no token mechanism for authentication with mox yet, basic auth is used.  If you want to auto-fill your username and password, create a `.env` file with these keys:

```sh
VITE_USERNAME=
VITE_PASSWORD=
```

Run:

`npm run dev`

Analyze package composition:

`npm run analyze`
