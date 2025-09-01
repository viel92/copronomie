[17:10:46.423] Running build in Washington, D.C., USA (East) – iad1
[17:10:46.424] Build machine configuration: 2 cores, 8 GB
[17:10:46.465] Cloning github.com/viel92/copronomie (Branch: main, Commit: 601a049)
[17:10:46.728] Previous build caches not available
[17:10:47.033] Cloning completed: 567.000ms
[17:10:47.541] Running "vercel build"
[17:10:47.927] Vercel CLI 46.1.1
[17:10:48.245] Installing dependencies...
[17:10:52.287] npm warn deprecated @supabase/auth-helpers-shared@0.6.3: This package is now deprecated - please use the @supabase/ssr package instead.
[17:10:53.017] npm warn deprecated @supabase/auth-helpers-nextjs@0.8.7: This package is now deprecated - please use the @supabase/ssr package instead.
[17:10:53.886] npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
[17:10:54.115] npm warn deprecated gm@1.25.1: The gm module has been sunset. Please migrate to an alternative. https://github.com/aheckmann/gm?tab=readme-ov-file#2025-02-24-this-project-is-not-maintained
[17:11:08.444] 
[17:11:08.446] added 419 packages in 20s
[17:11:08.446] 
[17:11:08.446] 150 packages are looking for funding
[17:11:08.446]   run `npm fund` for details
[17:11:08.576] Detected Next.js version: 15.5.2
[17:11:08.577] Running "npm run build"
[17:11:08.686] 
[17:11:08.686] > copronomie-saas@0.1.0 build
[17:11:08.686] > next build --turbopack
[17:11:08.687] 
[17:11:09.471] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[17:11:09.472] This information is used to shape Next.js' roadmap and prioritize features.
[17:11:09.472] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[17:11:09.472] https://nextjs.org/telemetry
[17:11:09.472] 
[17:11:09.523]    ▲ Next.js 15.5.2 (Turbopack)
[17:11:09.524]    - Environments: .env.production
[17:11:09.524] 
[17:11:09.593]    Creating an optimized production build ...
[17:11:10.253]  ⚠ Webpack is configured while Turbopack is not, which may cause problems.
[17:11:10.254]  ⚠ See instructions if you need to configure Turbopack:
[17:11:10.254]   https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
[17:11:10.254] 
[17:11:33.651]  ✓ Finished writing to disk in 37ms
[17:11:33.688]  ✓ Compiled successfully in 23.4s
[17:11:33.693]    Linting and checking validity of types ...
[17:11:40.297] 
[17:11:40.298] ./src/app/api/comparisons/route.ts
[17:11:40.298] 5:27  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.298] 
[17:11:40.298] ./src/app/api/consultations/[id]/route.ts
[17:11:40.298] 5:6  Warning: 'Consultation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.298] 
[17:11:40.298] ./src/app/api/consultations/route.ts
[17:11:40.299] 5:6  Warning: 'Consultation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.299] 9:54  Warning: 'user' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.299] 
[17:11:40.299] ./src/app/api/coproprietes/route.ts
[17:11:40.299] 4:27  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.299] 
[17:11:40.299] ./src/app/api/upload/route.ts
[17:11:40.299] 49:21  Warning: 'uploadData' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.300] 
[17:11:40.300] ./src/app/auth/logout/route.ts
[17:11:40.300] 5:28  Warning: 'request' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.300] 
[17:11:40.300] ./src/app/auth/register/page.tsx
[17:11:40.300] 26:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.300] 30:9  Warning: 'supabase' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 63:14  Warning: 'err' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 
[17:11:40.301] ./src/app/companies/page.tsx
[17:11:40.301] 8:3  Warning: 'Filter' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 11:3  Warning: 'Shield' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 18:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 19:3  Warning: 'ChevronDown' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.301] 27:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.302] 45:6  Warning: React Hook useEffect has a missing dependency: 'loadCompanies'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.302] 
[17:11:40.302] ./src/app/comparateur/page.tsx
[17:11:40.302] 54:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.302] 190:52  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.302] 203:24  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.302] 333:23  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.304] 444:26  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.304] 
[17:11:40.304] ./src/app/comparator/page.tsx
[17:11:40.304] 13:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.305] 16:3  Warning: 'Save' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.305] 205:69  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.306] 246:58  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.306] 292:34  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.307] 305:29  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.309] 372:83  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.310] 392:94  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.310] 
[17:11:40.311] ./src/app/comparator-v2/page.tsx
[17:11:40.311] 3:27  Warning: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.311] 11:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.311] 12:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.312] 283:14  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.312] 385:59  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.313] 
[17:11:40.313] ./src/app/consultations/[id]/page.tsx
[17:11:40.313] 15:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.318] 16:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.319] 24:9  Warning: 'router' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.320] 229:90  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.320] 
[17:11:40.320] ./src/app/consultations/new/page.tsx
[17:11:40.321] 11:3  Warning: 'Building' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.321] 14:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.322] 15:3  Warning: 'CheckCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.322] 30:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.322] 75:31  Warning: 'isDraft' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.322] 244:43  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.322] 
[17:11:40.322] ./src/app/consultations/page.tsx
[17:11:40.322] 18:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.322] 43:10  Warning: 'error' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.322] 50:6  Warning: React Hook useEffect has a missing dependency: 'loadConsultations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.322] 54:6  Warning: React Hook useEffect has a missing dependency: 'loadConsultations'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.322] 70:22  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.322] 87:36  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.322] 
[17:11:40.322] ./src/app/contracts/page.tsx
[17:11:40.322] 16:3  Warning: 'Calendar' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.323] 19:3  Warning: 'TrendingUp' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.323] 22:3  Warning: 'X' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.323] 26:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.323] 54:6  Warning: React Hook useEffect has missing dependencies: 'authLoading' and 'loadContracts'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.323] 60:6  Warning: React Hook useEffect has a missing dependency: 'loadContracts'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.323] 
[17:11:40.324] ./src/app/dashboard/page.tsx
[17:11:40.324] 27:3  Warning: 'Vote' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 28:3  Warning: 'Brain' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 29:3  Warning: 'Target' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 30:3  Warning: 'Camera' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 31:3  Warning: 'Megaphone' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 32:16  Warning: 'Analytics' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 33:3  Warning: 'Presentation' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 60:10  Warning: 'stats' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.324] 140:6  Warning: React Hook useEffect has a missing dependency: 'showToast'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.325] 301:18  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.325] 
[17:11:40.325] ./src/app/page.tsx
[17:11:40.325] 22:92  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.325] 45:92  Warning: `'` can be escaped with `&apos;`, `&lsquo;`, `&#39;`, `&rsquo;`.  react/no-unescaped-entities
[17:11:40.325] 
[17:11:40.325] ./src/app/reports/page.tsx
[17:11:40.325] 13:3  Warning: 'Euro' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.325] 16:3  Warning: 'PieChart' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.325] 17:3  Warning: 'Users' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.326] 18:3  Warning: 'Clock' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.326] 27:11  Warning: 'profile' is assigned a value but never used.  @typescript-eslint/no-unused-vars
[17:11:40.326] 56:6  Warning: React Hook useEffect has missing dependencies: 'authLoading' and 'loadReports'. Either include them or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.326] 62:6  Warning: React Hook useEffect has a missing dependency: 'loadReports'. Either include it or remove the dependency array.  react-hooks/exhaustive-deps
[17:11:40.326] 348:27  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[17:11:40.327] 348:43  Warning: `"` can be escaped with `&quot;`, `&ldquo;`, `&#34;`, `&rdquo;`.  react/no-unescaped-entities
[17:11:40.327] 
[17:11:40.327] ./src/components/Layout.tsx
[17:11:40.327] 25:3  Warning: 'MessageCircle' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.327] 
[17:11:40.327] ./src/lib/supabase/server-client.ts
[17:11:40.327] 36:53  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.327] 39:32  Warning: 'options' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.327] 39:41  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.327] 
[17:11:40.327] ./src/lib/supabase/server.ts
[17:11:40.327] 18:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.327] 25:20  Warning: 'error' is defined but never used.  @typescript-eslint/no-unused-vars
[17:11:40.327] 
[17:11:40.327] ./src/middleware.ts
[17:11:40.327] 20:51  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 37:39  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 
[17:11:40.328] ./src/services/consultations.service.ts
[17:11:40.328] 8:18  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 9:11  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 10:15  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 
[17:11:40.328] ./src/services/coproprietes.service.ts
[17:11:40.328] 12:14  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.328] 
[17:11:40.328] ./src/services/reports.service.ts
[17:11:40.328] 12:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.333] 31:16  Warning: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
[17:11:40.334] 
[17:11:40.334] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
[17:11:43.987] Failed to compile.
[17:11:43.987] 
[17:11:43.987] ./src/app/consultations/page.tsx:315:51
[17:11:43.987] Type error: Property 'nb_lots' does not exist on type '{ id: string; nom: string; adresse: string; }'.
[17:11:43.987] 
[17:11:43.987] [0m [90m 313 |[39m                       [33m<[39m[33mspan[39m className[33m=[39m[32m"text-slate-500"[39m[33m>[39m[33mCopropriété[39m[33m:[39m[33m<[39m[33m/[39m[33mspan[39m[33m>[39m
[17:11:43.987]  [90m 314 |[39m                       [33m<[39m[33mp[39m className[33m=[39m[32m"font-medium text-slate-900"[39m[33m>[39m{consultation[33m.[39mcoproprietes[33m?[39m[33m.[39mnom [33m||[39m [32m'Non définie'[39m}[33m<[39m[33m/[39m[33mp[39m[33m>[39m
[17:11:43.988] [31m[1m>[22m[39m[90m 315 |[39m                       {consultation[33m.[39mcoproprietes[33m?[39m[33m.[39mnb_lots [33m&&[39m (
[17:11:43.988]  [90m     |[39m                                                   [31m[1m^[22m[39m
[17:11:43.988]  [90m 316 |[39m                         [33m<[39m[33mp[39m className[33m=[39m[32m"text-xs text-slate-600"[39m[33m>[39m{consultation[33m.[39mcoproprietes[33m.[39mnb_lots} lots[33m<[39m[33m/[39m[33mp[39m[33m>[39m
[17:11:43.988]  [90m 317 |[39m                       )}
[17:11:43.988]  [90m 318 |[39m                     [33m<[39m[33m/[39m[33mdiv[39m[33m>[39m[0m
[17:11:44.012] Next.js build worker exited with code: 1 and signal: null
[17:11:44.036] Error: Command "npm run build" exited with 1