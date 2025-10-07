export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
};

export const QUIZ_DURATION_SECONDS = 30 * 60; // 30 minutes
export const QUIZ_TOTAL_QUESTIONS = 20;

// Helper function to shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ALL_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which command initializes a new Git repository?",
    options: ["git create", "git start", "git init", "git new"],
    answerIndex: 2,
  },
  {
    id: 2,
    question: "Which command is used to check the status of your working directory and staging area?",
    options: ["git status", "git check", "git log", "git commit -s"],
    answerIndex: 0,
  },
  {
    id: 3,
    question: "Which file is used to ignore files/directories in Git?",
    options: ["ignore.txt", ".gitignore", "gitconfig", ".ignoregit"],
    answerIndex: 1,
  },
  {
    id: 4,
    question: "Which command stages all modified and new files?",
    options: ["git add .", "git commit all", "git stage *", "git commit -a"],
    answerIndex: 0,
  },
  {
    id: 5,
    question: "Which command is used to permanently delete a branch locally?",
    options: ["git branch -d branch_name", "git delete branch branch_name", "git remove branch branch_name", "git branch -D branch_name"],
    answerIndex: 3,
  },
  {
    id: 6,
    question: "Which command lists all branches in the repository?",
    options: ["git show branch", "git branch", "git log --branches", "git list branch"],
    answerIndex: 1,
  },
  {
    id: 7,
    question: "Which command shows the commit history?",
    options: ["git log", "git history", "git commits", "git showlog"],
    answerIndex: 0,
  },
  {
    id: 8,
    question: "The .git directory inside a project contains what?",
    options: ["Project documentation", "Repository metadata and object database", "User configuration files", "Temporary cache files"],
    answerIndex: 1,
  },
  {
    id: 9,
    question: "Which command creates a copy (clone) of an existing repo?",
    options: ["git get repo_url", "git fetch", "git clone repo_url", "git copy repo_url"],
    answerIndex: 2,
  },
  {
    id: 10,
    question: "Which command is used to fetch updates from the remote without merging them into local?",
    options: ["git pull", "git fetch", "git get", "git sync"],
    answerIndex: 1,
  },
  {
    id: 11,
    question: "Which Git command merges two branches?",
    options: ["git combine", "git integrate", "git merge", "git branch merge"],
    answerIndex: 2,
  },
  {
    id: 12,
    question: "Which command creates a new branch?",
    options: ["git create branch branch_name", "git branch branch_name", "git new branch branch_name", "git checkout branch_name"],
    answerIndex: 1,
  },
  {
    id: 13,
    question: "Which command is commonly used to switch branches?",
    options: ["git branch switch", "git switch branch_name", "git checkout branch_name", "git change branch branch_name"],
    answerIndex: 2,
  },
  {
    id: 14,
    question: "git pull is equivalent to which two commands?",
    options: ["git fetch + git merge", "git fetch + git rebase", "git clone + git push", "git clone + git fetch"],
    answerIndex: 0,
  },
  {
    id: 15,
    question: "Which file stores Git’s project-specific configuration?",
    options: [".gitignore", ".gitattributes", ".git/config", ".gitmodules"],
    answerIndex: 2,
  },
  {
    id: 16,
    question: "Which Git command discards unstaged changes in working directory?",
    options: ["git clean -d", "git discard", "git restore .", "git push -f"],
    answerIndex: 2,
  },
  {
    id: 17,
    question: "Which command stages a single file?",
    options: ["git add <filename>", "git push <filename>", "git commit <filename>", "git save <filename>"],
    answerIndex: 0,
  },
  {
    id: 18,
    question: "Which command shows the difference between staged and unstaged files?",
    options: ["git diff", "git status --diff", "git compare", "git log -p"],
    answerIndex: 0,
  },
  {
    id: 19,
    question: "What does HEAD point to?",
    options: ["Current commit", "Previous commit", "Branch name", "Remote repository"],
    answerIndex: 0,
  },
  {
    id: 20,
    question: "Which command removes files from tracking?",
    options: ["git delete file", "git remove <file>", "git rm <file>", "git erase <file>"],
    answerIndex: 2,
  },
  {
    id: 21,
    question: "Which command undoes the last commit but keeps changes staged?",
    options: ["git reset --soft HEAD~1", "git revert HEAD", "git reset --hard HEAD~1", "git rm HEAD~1"],
    answerIndex: 0,
  },
  {
    id: 22,
    question: "Which command is safer to undo commits by creating a new commit?",
    options: ["git delete", "git reset", "git revert", "git squash"],
    answerIndex: 2,
  },
  {
    id: 23,
    question: "What does git stash do?",
    options: ["Deletes staged files", "Temporarily saves uncommitted changes", "Pushes all changes to remote", "Creates a backup branch"],
    answerIndex: 1,
  },
  {
    id: 24,
    question: "Which command applies stashed changes?",
    options: ["git stash show", "git stash drop", "git stash pop", "git stash remove"],
    answerIndex: 2,
  },
  {
    id: 25,
    question: "Which Git command shows remote repositories?",
    options: ["git branch -r", "git show remotes", "git remote -v", "git config remote"],
    answerIndex: 2,
  },
  {
    id: 26,
    question: "What does git push origin main do?",
    options: ["Pushes local main branch to origin", "Pulls main branch from origin", "Merges main branch with origin", "Clones main from origin"],
    answerIndex: 0,
  },
  {
    id: 27,
    question: "What does git tag command do?",
    options: ["Marks staging files", "Creates named snapshots at commits", "Tags remote repos", "Adds labels to branches"],
    answerIndex: 1,
  },
  {
    id: 28,
    question: "Which type of merge avoids unnecessary merge commits?",
    options: ["Fast-forward merge", "Three-way merge", "Squash merge", "Rebase merge"],
    answerIndex: 0,
  },
  {
    id: 29,
    question: "Which command re-applies commits on top of another branch?",
    options: ["git merge", "git rebase", "git cherry-pick", "git amend"],
    answerIndex: 1,
  },
  {
    id: 30,
    question: "Which command updates the commit message of the last commit?",
    options: ["git edit HEAD", "git commit --amend", "git reset message", "git remark HEAD"],
    answerIndex: 1,
  },
  {
    id: 31,
    question: "Which of the following is a distributed version control system?",
    options: ["SVN", "Mercurial", "Git", "All of the above"],
    answerIndex: 3,
  },
  {
    id: 32,
    question: "By default, Git stores objects where?",
    options: [".git/objects", "/usr/bin/git/objects", ".git/config/objects", ".git/temp"],
    answerIndex: 0,
  },
  {
    id: 33,
    question: "Which file holds commit author information globally?",
    options: ["~/.gitignore", "~/.gitconfig", "~/.gitinfo", "~/.gitsettings"],
    answerIndex: 1,
  },
  {
    id: 34,
    question: "In Git, SHA-1 hash is used for what?",
    options: ["Unique commit identification", "Encryption of files", "Storing log messages", "File locking"],
    answerIndex: 0,
  },
  {
    id: 35,
    question: "Which Git command shows a graphical representation of commit history?",
    options: ["git log --graph", "git history -g", "git commits --tree", "git branch --graph"],
    answerIndex: 0,
  },
  {
    id: 36,
    question: "What is a detached HEAD in Git?",
    options: ["HEAD pointing to commit instead of branch tip", "HEAD detached from remote repo", "HEAD deleted", "HEAD pointing to main only"],
    answerIndex: 0,
  },
  {
    id: 37,
    question: "Which Git command compares working directory with last commit?",
    options: ["git status", "git log", "git diff HEAD", "git show HEAD"],
    answerIndex: 2,
  },
  {
    id: 38,
    question: "What does git cherry-pick do?",
    options: ["Deletes specific commits", "Applies a specific commit from one branch to another", "Rebases all commits", "Merges cherry branch into main"],
    answerIndex: 1,
  },
  {
    id: 39,
    question: "What type of file is .gitattributes used for?",
    options: ["Tracking ignored files", "Specifying merge strategies", "Defining file handling attributes", "Commit template storage"],
    answerIndex: 2,
  },
  {
    id: 40,
    question: "Which Git command removes all untracked files?",
    options: ["git rm *", "git clean -f", "git reset --hard", "git stash clear"],
    answerIndex: 1,
  },
  {
    id: 41,
    question: "Which command shows who made changes to each line of a file?",
    options: ["git blame <file>", "git log <file>", "git show <file>", "git history <file>"],
    answerIndex: 0,
  },
  {
    id: 42,
    question: "What is the default branch name in old Git versions (<2.28)?",
    options: ["master", "main", "root", "origin"],
    answerIndex: 0,
  },
  {
    id: 43,
    question: "Which command is used to set a new remote origin?",
    options: ["git config origin <url>", "git init origin <url>", "git remote add origin <url>", "git branch origin <url>"],
    answerIndex: 2,
  },
  {
    id: 44,
    question: "Which command lists commits between two branches?",
    options: ["git diff branch1..branch2", "git log branch1..branch2", "git compare branch1 branch2", "git show branch1 branch2"],
    answerIndex: 1,
  },
  {
    id: 45,
    question: "Which Git workflow uses long-lived branches like develop and master plus feature branches?",
    options: ["Feature branching", "Git flow", "Trunk-based development", "Forking workflow"],
    answerIndex: 1,
  },
  {
    id: 46,
    question: "Which command updates submodules?",
    options: ["git submodule sync", "git submodule update --init --recursive", "git submodule add <url>", "git submodule commit"],
    answerIndex: 1,
  },
  {
    id: 47,
    question: "In Git, what is the difference between git pull --rebase and git pull?",
    options: ["Pull --rebase avoids merge commit, re-applies local commits on top", "Pull --rebase deletes commits", "Pull --rebase creates new branches", "Both are identical"],
    answerIndex: 0,
  },
  {
    id: 48,
    question: "Which command creates a mirror repository for backup?",
    options: ["git stash mirror", "git clone --mirror <url>", "git mirror <url>", "git copy --mirror <url>"],
    answerIndex: 1,
  },
  {
    id: 49,
    question: "What does git bisect help with?",
    options: ["Divide repo into two", "Split commits", "Find commit that introduced a bug using binary search", "Compare two branches"],
    answerIndex: 2,
  },
  {
    id: 50,
    question: "Which Git command shows summary statistics of each commit?",
    options: ["git log --stat", "git log --summary", "git diff --stat", "git show --stat"],
    answerIndex: 0,
  },
];

// Function to get random questions
export function getRandomQuestions(): QuizQuestion[] {
  return shuffleArray(ALL_QUESTIONS).slice(0, QUIZ_TOTAL_QUESTIONS);
}

// Export the function instead of the static array
export const getQuizQuestions = () => getRandomQuestions();

