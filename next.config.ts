import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { SentryBuildOptions, withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      }),
    )

    return config
  },
}

export default withSentryConfig(withNextIntl(nextConfig), createSentryConfig())

function createSentryConfig(): SentryBuildOptions {
  return {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    disableLogger: true,
    automaticVercelMonitors: true,
  }
}
