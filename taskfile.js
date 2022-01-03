
export async function compile (task, opts) {
  await task.source(opts.src || 'src/**/*.js').babel().target('dist/')
}

export async function build (task) {
  await task.serial(['lint', 'compile'])
}

export async function lint (task) {
  await task.source('src/**/*.js').standard()
}

export async function release (task) {
  await task.clear('dist').start('build')
}
