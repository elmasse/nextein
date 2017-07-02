
export async function compile(task, opts) {
  await task.source(opts.src || 'src/**/*.js').babel().target('dist/')
}

export async function bin(task, opts) {
   await task.source(opts.src || 'bin/**/*').babel().target('dist/bin', {mode: 0o755})
}

export async function build(task) {
  await task.serial(['bin', 'compile'])
}

export default async function (task) {
  await task.start('build')
  await task.watch('src/**/*.js', 'compile')
  await task.watch('bin/**/*', 'bin')
}

export async function release (task) {
  await task.clear('dist').start('build')
}