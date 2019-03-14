const { Toolkit } = require('actions-toolkit');
const { propPathOr } = require('crocks');

const tools = new Toolkit({ event: 'pull_requests' })

const git = (...args) => execa.stdout('git', args)

const checkCommit = async (...refs) =>
    Promise.all(
        refs.map(ref =>
            git('cat-file', '-e', ref)
        )
    )

const getRangeFromPr = async () => {
    const {owner, repo, number} = tools.context.issue();

    console.log('📡   Looking up PR #%s...', pull)

    const commits = await tools.github
      .paginage('GET /repos/:owner/:repo/pulls/:number/commits', {
        number,
        owner,
        repo,
    });

    const shas = commits
      .map(propPathOr(null, ['commit', 'tree', 'sha']))
      .filter(Boolean)

    console.log('🔀   Linting PR #%s', pull)

    const [from] = shas
    const [to] = [...shas].reverse();
    return [from, to]
}

const getRangeFromGit = async () => {
    const head = await git('rev-parse', '--verify', 'HEAD')

    await checkCommit(head)
    console.log('⚙️   Linting using git HEAD (%s)', head)

    return ['origin/master', head]
}

const lint = ([from, to]) =>
    tools.runInWorkspace('commitlint', [`--from ${from}`, `--to ${to}`])

export const run = () =>
    getRangeFromPr()
        .catch(getRangeFromGit)
        .then(lint)
