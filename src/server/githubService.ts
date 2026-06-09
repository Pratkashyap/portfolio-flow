export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
}

export interface GitHubUserData {
  username: string;
  repos: GitHubRepo[];
  totalStars: number;
  totalRepos: number;
  languages: Record<string, number>;
}

/**
 * Extract GitHub username from URL
 * Supports formats like:
 * - https://github.com/username
 * - github.com/username
 * - username
 */
function extractUsername(url: string): string | null {
  if (!url) return null;

  // If it's just a username
  if (!url.includes("/")) {
    return url;
  }

  // Extract from URL
  const match = url.match(/github\.com\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Fetch GitHub user data including repositories and stats
 */
export async function fetchGitHubData(githubUrl: string): Promise<GitHubUserData | null> {
  try {
    const username = extractUsername(githubUrl);
    if (!username) {
      throw new Error("Invalid GitHub URL");
    }

    // Fetch user repos
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&per_page=10`
    );

    if (!reposResponse.ok) {
      throw new Error("Failed to fetch GitHub repos");
    }

    const repos = await reposResponse.json();

    // Process repos data
    const processedRepos: GitHubRepo[] = repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "No description",
      url: repo.html_url,
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
    }));

    // Calculate stats
    const totalStars = processedRepos.reduce((sum, repo) => sum + repo.stars, 0);
    const languages: Record<string, number> = {};

    processedRepos.forEach((repo) => {
      if (repo.language && repo.language !== "Unknown") {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return {
      username,
      repos: processedRepos,
      totalStars,
      totalRepos: repos.length,
      languages,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return null;
  }
}

/**
 * Fetch GitHub user profile information
 */
export async function fetchGitHubProfile(githubUrl: string) {
  try {
    const username = extractUsername(githubUrl);
    if (!username) {
      throw new Error("Invalid GitHub URL");
    }

    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub profile");
    }

    const profile = await response.json();

    return {
      username: profile.login,
      name: profile.name,
      bio: profile.bio,
      avatar: profile.avatar_url,
      followers: profile.followers,
      following: profile.following,
      publicRepos: profile.public_repos,
      profileUrl: profile.html_url,
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return null;
  }
}
