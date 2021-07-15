
export async function compile (task, opts) {
  await task.source(opts.src || 'src/**/*.js').babel().target('dist/')
  await task.source(opts.src || 'cli/**/*.js').babel().target('dist/cli')
}

export async function bin (task, opts) {
  await task.source(opts.src || 'bin/**/*').babel().target('dist/bin', { mode: 0o755 })
}

export async function build (task) {
  await task.serial(['lint', 'bin', 'compile'])
}

export async function lint (task) {
  await task.source('src/**/*.js').standard()
}

export async function release (task) {
  await task.clear('dist').start('build')
}
