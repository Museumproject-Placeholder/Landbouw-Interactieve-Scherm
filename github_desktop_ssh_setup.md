GitHub Desktop Setup with SSH Keys on Windows
https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent?platform=windows
---

1. **Install GitHub Desktop**

- Download GitHub Desktop: https://desktop.github.com/
- Run the installer and follow the instructions.
- Open GitHub Desktop and sign in to your GitHub account.

---

2. **Configure Git in GitHub Desktop**

- Go to File → Options → Git.
- Make sure your name and email are correct (used for commits).

---

3. **Set up SSH Keys for GitHub Desktop**

- Open Git Bash.
- Generate a new SSH key:
  ```
  ssh-keygen -t ed25519 -C "your.email@example.com"
  ```
  - Press Enter to accept the default location.
  - Add a passphrase if desired.

- Start the SSH agent:
  ```
  eval "$(ssh-agent -s)"
  ```

- Add your key to the agent:
  ```
  ssh-add ~/.ssh/id_ed25519
  ```

- Copy your public key to clipboard:
  ```
  clip < ~/.ssh/id_ed25519.pub
  ```

- Add the key to GitHub:
  - Go to GitHub → Settings → SSH and GPG keys → New SSH key
  - Paste your key and give it a descriptive title.

---

4. **Clone a Repository via SSH in GitHub Desktop**

- Go to File → Clone Repository → URL.
- Enter the SSH URL (e.g., git@github.com:username/repo.git).
- Choose a local path and click Clone.

---

5. **Using GitHub Desktop**

- **Commit changes:**
  - Make changes in your project folder.
  - GitHub Desktop will show them under Changes.
  - Enter a commit message and click Commit to main/master.

- **Push to GitHub:**
  - Click Push origin to send your commits to GitHub.

- **Pull from GitHub:**
  - Click Fetch origin to pull the latest changes.

