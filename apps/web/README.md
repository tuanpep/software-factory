# Software Factory web client

Use Node.js 24 LTS and npm. From this directory:

```bash
npm ci
npm run dev
```

Open [localhost:4202](http://localhost:4202). The Factory Runs screen is not connected to GitHub yet.

- `app/` owns Next.js routes and providers.
- `modules/factory/` owns Factory screens. Keep live data access on the server when it is added.
- `modules/ui/` owns the shared header and the Mantine theme based on Arco Design.
- `messages/en.json` and `messages/vi.json` own UI copy. The locale cookie defaults to Vietnamese.

Run `npm run check` and `npm run build` for local verification. For browser tests, run `npx playwright install chromium` once, then `npm run test:e2e`.

Based on [nextjs-mantine-arco](https://github.com/tuanpep/nextjs-mantine-arco). See the [web client design](../../docs/design/software-factory-web-client.md) for the GitHub and evidence gates.
