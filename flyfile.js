
export async function build(fly, opts) {
  await fly.source(opts.src || 'src/**/*.js').babel().target('dist/')
}

export default async function (fly) {
  await fly.start('build')
}
