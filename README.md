Welcome to **GitFrankenstein**. This is my attempt at better understanding Git; by trying
to octopus-merge all my repositories at various points in their history, into one franken
repository.

As inspired by https://www.destroyallsoftware.com/blog/2017/the-biggest-and-weirdest-commits-in-linux-kernel-git-history

# Process

*Values used are examples. I mix some up, e.g. amount of commit rewinds from `HEAD`*

1. `git fetch --progress "../ASE2GIMP" master:ase2gimp` - Fetches the history of another
local repository, but renames its master branch to its own repo name.
1. `git checkout --force ase2gimp` - Switch to that fetched repository
1. `git reset --mixed HEAD~2` - Rewind the repository back by 2 commits
1. Repeat steps 1-3 for other repositories
1. `git checkout --force master` - Switch back to master (root)
1. `git merge --allow-unrelated-histories ase2gimp Pinhead` - Merge the multiple repositories into one
1. `git read-tree ase2gimp Pinhead` - Actually stages the files and changes of the merges (for some reason, [they don't appear without this step][1])
1. Use a GUI, such as Git Extensions, to resolve any merge conflicts
1. Commit!

[1]: https://stackoverflow.com/a/31186732/3354920