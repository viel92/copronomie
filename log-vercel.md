[17:14:35.366] Running build in Washington, D.C., USA (East) – iad1
[17:14:35.366] Build machine configuration: 2 cores, 8 GB
[17:14:35.402] Cloning github.com/viel92/copronomie (Branch: main, Commit: eb399c1)
[17:14:35.796] Previous build caches not available
[17:14:35.947] Cloning completed: 545.000ms
[17:14:36.295] Running "vercel build"
[17:14:36.714] Vercel CLI 46.1.1
[17:14:37.057] Installing dependencies...
[17:14:40.676] npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
[17:14:41.058] npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
[17:14:42.214] npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
[17:14:42.411] npm warn deprecated gm@1.25.1: The gm module has been sunset. Please migrate to an alternative. https://github.com/aheckmann/gm?tab=readme-ov-file#2025-02-24-this-project-is-not-maintained
[17:14:56.662] 
[17:14:56.663] added 419 packages in 19s
[17:14:56.664] 
[17:14:56.664] 150 packages are looking for funding
[17:14:56.664]   run `npm fund` for details
[17:14:56.910] Detected Next.js version: 15.5.2
[17:14:56.912] Running "npm run build"
[17:14:57.027] 
[17:14:57.028] > copronomie-saas@0.1.0 build
[17:14:57.028] > next build --turbopack
[17:14:57.028] 
[17:14:57.838] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[17:14:57.838] This information is used to shape Next.js' roadmap and prioritize features.
[17:14:57.838] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[17:14:57.838] https://nextjs.org/telemetry
[17:14:57.839] 
[17:14:57.892]    ▲ Next.js 15.5.2 (Turbopack)
[17:14:57.893]    - Environments: .env.production
[17:14:57.894] 
[17:14:57.987]    Creating an optimized production build ...
[17:14:58.694]  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
[17:14:58.695]  ⚠ See instructions if you need to configure Turbopack:
[17:14:58.695]   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
[17:14:58.695] 
[17:15:24.232]  ✓ Finished writing to disk in 39ms
[17:15:24.294]  ✓ Compiled successfully in 25.6s
[17:15:24.304]    Linting and checking validity of types ...
[17:15:31.258] 
[17:15:31.261] ./src/app/api/comparisons/route.ts
[17:15:31.261] 5:27  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.261] 
[17:15:31.261] ./src/app/api/consultations/[id]/route.ts
[17:15:31.261] 5:6  Warning: 'Consultation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.261] 
[17:15:31.262] ./src/app/api/consultations/route.ts
[17:15:31.262] 5:6  Warning: 'Consultation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.262] 9:54  Warning: 'user' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.262] 
[17:15:31.262] ./src/app/api/coproprietes/route.ts
[17:15:31.262] 4:27  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.262] 
[17:15:31.262] ./src/app/api/upload/route.ts
[17:15:31.262] 49:21  Warning: 'uploadData' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.262] 
[17:15:31.262] ./src/app/auth/logout/route.ts
[17:15:31.263] 5:28  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.263] 
[17:15:31.263] ./src/app/auth/register/page.tsx
[17:15:31.263] 26:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.263] 30:9  Warning: 'supabase' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.263] 63:14  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.263] 
[17:15:31.263] ./src/app/companies/page.tsx
[17:15:31.263] 8:3  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 11:3  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 18:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 19:3  Warning: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 27:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 45:6  Warning: React Hook useEffect has a missing dependency: 'loadCompanies'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.264] 
[17:15:31.264] ./src/app/comparateur/page.tsx
[17:15:31.264] 54:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.264] 190:52  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.265] 203:24  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.265] 333:23  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.265] 444:26  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.265] 
[17:15:31.265] ./src/app/comparator/page.tsx
[17:15:31.265] 13:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.265] 16:3  Warning: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.266] 205:69  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.266] 246:58  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.266] 292:34  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.267] 305:29  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.267] 372:83  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.268] 392:94  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.268] 
[17:15:31.268] ./src/app/comparator-v2/page.tsx
[17:15:31.275] 3:27  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.275] 11:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.275] 12:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.276] 283:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.276] 385:59  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.276] 
[17:15:31.276] ./src/app/consultations/[id]/page.tsx
[17:15:31.276] 15:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.276] 16:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.276] 24:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.276] 229:90  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.276] 
[17:15:31.276] ./src/app/consultations/new/page.tsx
[17:15:31.277] 11:3  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.277] 14:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.278] 15:3  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.278] 30:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.278] 75:31  Warning: 'isDraft' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.278] 244:43  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.278] 
[17:15:31.278] ./src/app/consultations/page.tsx
[17:15:31.278] 18:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.279] 44:10  Warning: 'error' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.279] 51:6  Warning: React Hook useEffect has a missing dependency: 'loadConsultations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.279] 55:6  Warning: React Hook useEffect has a missing dependency: 'loadConsultations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.279] 71:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.281] 88:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.281] 
[17:15:31.281] ./src/app/contracts/page.tsx
[17:15:31.282] 16:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.282] 19:3  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.282] 22:3  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.282] 26:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.282] 54:6  Warning: React Hook useEffect has missing dependencies: 'authLoading' and 'loadContracts'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.282] 60:6  Warning: React Hook useEffect has a missing dependency: 'loadContracts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.282] 
[17:15:31.282] ./src/app/dashboard/page.tsx
[17:15:31.282] 27:3  Warning: 'Vote' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.282] 28:3  Warning: 'Brain' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 29:3  Warning: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 30:3  Warning: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 31:3  Warning: 'Megaphone' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 32:16  Warning: 'Analytics' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 33:3  Warning: 'Presentation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 60:10  Warning: 'stats' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.283] 140:6  Warning: React Hook useEffect has a missing dependency: 'showToast'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.283] 301:18  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.283] 
[17:15:31.283] ./src/app/page.tsx
[17:15:31.284] 22:92  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.284] 45:92  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:15:31.284] 
[17:15:31.284] ./src/app/reports/page.tsx
[17:15:31.284] 13:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.284] 16:3  Warning: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.284] 17:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.284] 18:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.284] 27:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:15:31.284] 56:6  Warning: React Hook useEffect has missing dependencies: 'authLoading' and 'loadReports'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.284] 62:6  Warning: React Hook useEffect has a missing dependency: 'loadReports'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:15:31.284] 348:27  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[17:15:31.285] 348:43  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[17:15:31.285] 
[17:15:31.285] ./src/components/Layout.tsx
[17:15:31.285] 25:3  Warning: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.285] 
[17:15:31.285] ./src/lib/supabase/server-client.ts
[17:15:31.285] 36:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.285] 39:32  Warning: 'options' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.285] 39:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.285] 
[17:15:31.285] ./src/lib/supabase/server.ts
[17:15:31.285] 18:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.286] 25:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:15:31.286] 
[17:15:31.286] ./src/middleware.ts
[17:15:31.286] 20:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.286] 37:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.286] 
[17:15:31.286] ./src/services/consultations.service.ts
[17:15:31.286] 8:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.286] 9:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.286] 10:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.286] 
[17:15:31.291] ./src/services/coproprietes.service.ts
[17:15:31.291] 12:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.291] 
[17:15:31.291] ./src/services/reports.service.ts
[17:15:31.292] 12:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.292] 31:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:15:31.293] 
[17:15:31.293] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[17:15:35.286] Failed to compile.
[17:15:35.287] 
[17:15:35.287] ./src/app/contracts/page.tsx:356:74
[17:15:35.287] Type error: Type '{ className: string; title: string; }' is not assignable to type 'IntrinsicAttributes & Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>'.
[17:15:35.288]   Property 'title' does not exist on type 'IntrinsicAttributes & Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>'.
[17:15:35.288] 
[17:15:35.288] [0m [90m 354 |[39m                           {getAlertBadge(contract[33m.[39malertLevel [33m||[39m [32m'normal'[39m[33m,[39m contract[33m.[39mdaysLeft)}
[17:15:35.288]  [90m 355 |[39m                           {contract[33m.[39mauto_renewal [33m&&[39m (
[17:15:35.288] [31m[1m>[22m[39m[90m 356 |[39m                             [33m<[39m[33mRefreshCw[39m className[33m=[39m[32m"h-3 w-3 text-blue-500"[39m title[33m=[39m[32m"Renouvellement auto"[39m [33m/[39m[33m>[39m
[17:15:35.288]  [90m     |[39m                                                                          [31m[1m^[22m[39m
[17:15:35.290]  [90m 357 |[39m                           )}
[17:15:35.290]  [90m 358 |[39m                         [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m
[17:15:35.290]  [90m 359 |[39m                       [33m<[39m[33m/[39m[33mtd[39m[33m>[39m[0m
[17:15:35.316] Next.js build worker exited with code: 1 and signal: null
[17:15:35.345] Error: Command "npm run build" exited with 1