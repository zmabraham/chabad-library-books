# GitHub Setup Instructions

The GitHub token has expired. Please follow these steps:

## Option 1: Update the token (recommended)

1. Go to https://github.com/settings/tokens
2. Generate a new Personal Access Token with `repo` scope
3. Run the following commands:

```bash
cd /workspace/group/Chabad_His_wiki
git remote add origin https://YOUR_USERNAME:NEW_TOKEN@github.com/zmabraham/Chabad_His_wiki.git
git push -u origin main
```

## Option 2: Manual setup

1. Create repo at: https://github.com/new
   - Name: `Chabad_His_wiki`
   - Make it Public
   - Don't initialize with README

2. Then run:
```bash
cd /workspace/group/Chabad_His_wiki
git remote add origin https://github.com/zmabraham/Chabad_His_wiki.git
git push -u origin main
```

The repo is ready with all commits - just needs to be pushed.
