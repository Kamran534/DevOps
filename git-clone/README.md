# Git Clone

## What is `git clone`?

`git clone` creates a local copy of a remote repository, including all files, branches, and commit history.

## Syntax

```bash
git clone <repository-url> [directory]
```

## Clone Methods

### HTTPS

```bash
git clone https://github.com/username/repo.git
```

### SSH

```bash
git clone git@github.com:username/repo.git
```

## Common Options

| Option | Description |
|--------|-------------|
| `--branch <name>` | Clone a specific branch |
| `--depth <n>` | Shallow clone with limited commit history |
| `--single-branch` | Clone only one branch |
| `--recurse-submodules` | Clone including submodules |

## Examples

### Clone this repo

```bash
git clone git@github.com:Kamran534/DevOps.git
```

### Clone a specific branch

```bash
git clone --branch dev git@github.com:Kamran534/DevOps.git
```

### Shallow clone (latest commit only)

```bash
git clone --depth 1 git@github.com:Kamran534/DevOps.git
```

### Clone into a custom directory

```bash
git clone git@github.com:Kamran534/DevOps.git my-project
```

## What happens when you clone?

1. Creates a new directory named after the repo
2. Initializes a `.git` directory inside it
3. Downloads all data (commits, files, branches)
4. Sets the remote `origin` to the source URL
5. Checks out the default branch (usually `main`)

## Verify a clone

```bash
cd DevOps
git remote -v
# origin  git@github.com:Kamran534/DevOps.git (fetch)
# origin  git@github.com:Kamran534/DevOps.git (push)
```
