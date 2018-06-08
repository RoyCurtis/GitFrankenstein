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
1. `git read-tree ase2gimp Pinhead` - Stages the files and changes of the merges (for some reason, [they don't appear without this step][1])
    * This cannot work on more than 8 branches at the same time, so must be done and the committed for each group of 8.
    * Additionally, this will _remove_ or _overwrite_ changes per read-tree. Manual merge conflict resolution cannot be done with this command. I used GitExtensions to unstage file removals, thus treating each read-tree almost as an additive operation.
1. `git merge --allow-unrelated-histories ase2gimp Pinhead` - Merge the multiple repositories into one
1. Use a GUI, such as Git Extensions, to resolve any merge conflicts
1. Commit!

# Behind the scenes

* Preparing the git fetch commands: https://gfycat.com/ViciousPleasingCanine
* The resulting git kraken: https://gfycat.com/SparklingSmoggyAmericantoad
* On GitHub: https://github.com/RoyCurtis/GitFrankenstein/network

[1]: https://stackoverflow.com/a/31186732/3354920