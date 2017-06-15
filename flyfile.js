
export async function compile(fly, opts) {
  await fly.source(opts.src || 'src/**/*.js').babel().target('dist/')
}

export async function bin(fly, opts) {
   await fly.source(opts.src || 'bin/**/*').babel().target('dist/bin', {mode: 0o755})
}

export async function build(fly) {
  await fly.serial(['bin', 'compile'])
}

export default async function (fly) {
  await fly.start('build')
  await fly.watch('src/**/*.js', 'compile')
  await fly.watch('bin/**/*', 'bin')
}
