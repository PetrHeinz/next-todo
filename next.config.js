const { withLogtail } = require('@logtail/next');

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withLogtail(nextConfig);
