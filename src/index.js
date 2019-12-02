const cli = require('commander')
const importCwd = require('import-cwd')
const Project = require('./commands/new')

module.exports = () => {
  cli
    .command('new [path] [repo]')
    .description('scaffold a new Maizzle project')
    .option('-d, --no-deps', `Don't install NPM dependencies`)
    .action((path, repo, cmdObj) => Project.scaffold(path, repo, cmdObj))

  cli
    .command('build [env]')
    .description(`compile email templates and output them to disk`)
    .action(env => {
      try {
        const Maizzle = importCwd('./bootstrap')
        Maizzle.build(env)
      } catch (err) {
        throw err
      }
    })

  cli
    .command('serve')
    .description(`start a local development server and watch for file changes`)
    .action(() => {
      try {
        const Maizzle = importCwd('./bootstrap')
        Maizzle.serve()
      } catch (err) {
        throw err
      }
    })

  cli
    .option('-v, --version', 'output current framework and CLI versions')
    .on('option:version', () => {
      try {
        const pkg = require('../package.json')
        const maizzle = importCwd('./node_modules/@maizzle/framework/package.json')
        console.log(`Framework v${maizzle.version}\nCLI v${pkg.version}`)
      } catch (error) {
        console.error(`Error: Cannot find framework package. \nMake sure it's installed and that you're executing this command in the root directory of your project.\n`)
        console.error(error)
      }
      process.exit()
    })

  cli.on('command:*', () => {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', cli.args.join(' '))
    process.exit(1)
  })

  cli.parse(process.argv)

  if (!process.argv.slice(2).length) {
    cli.help()
  }
}
