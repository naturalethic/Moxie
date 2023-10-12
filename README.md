# Moxie

An experimental UI for administration of [mox](https://github.com/mjl-/mox).

### ** Warning **

This is a prototype for exploration, do not use it against a production mox server.

### Development

Edit `vite.config.ts` and update the `proxy` configuration to point to your mox admin api.

Install dependencies:

`npm install`

As there is no token mechanism for authentication with mox yet, basic auth is used, however I don't want to store passwords in client cookies or storage.  If you want to auto-fill your username and password, create a `.env` file with these keys:

```sh
VITE_USERNAME=
VITE_PASSWORD=
```

Run:

`npm run dev`
