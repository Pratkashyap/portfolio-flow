import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubData, fetchGitHubProfile } from "./githubService";

global.fetch = vi.fn();

describe("GitHub Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchGitHubData", () => {
    it("should fetch GitHub repositories data", async () => {
      const mockRepos = [
        {
          name: "test-repo",
          description: "A test repository",
          html_url: "https://github.com/testuser/test-repo",
          language: "JavaScript",
          stargazers_count: 10,
        },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRepos,
      });

      const result = await fetchGitHubData("https://github.com/testuser");

      expect(result).toBeDefined();
      expect(result?.username).toBe("testuser");
      expect(result?.repos).toHaveLength(1);
      expect(result?.repos[0].name).toBe("test-repo");
      expect(result?.totalStars).toBe(10);
    });

    it("should handle invalid GitHub URL", async () => {
      const result = await fetchGitHubData("invalid-url");
      expect(result).toBeNull();
    });

    it("should extract username from various URL formats", async () => {
      const mockRepos = [];

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockRepos,
      });

      await fetchGitHubData("https://github.com/testuser");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("testuser")
      );

      vi.clearAllMocks();
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockRepos,
      });

      await fetchGitHubData("testuser");
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("testuser")
      );
    });
  });

  describe("fetchGitHubProfile", () => {
    it("should fetch GitHub user profile", async () => {
      const mockProfile = {
        login: "testuser",
        name: "Test User",
        bio: "A test user",
        avatar_url: "https://avatars.githubusercontent.com/u/123",
        followers: 100,
        following: 50,
        public_repos: 20,
        html_url: "https://github.com/testuser",
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
      });

      const result = await fetchGitHubProfile("https://github.com/testuser");

      expect(result).toBeDefined();
      expect(result?.username).toBe("testuser");
      expect(result?.name).toBe("Test User");
      expect(result?.followers).toBe(100);
    });

    it("should return null on fetch failure", async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const result = await fetchGitHubProfile("https://github.com/testuser");
      expect(result).toBeNull();
    });
  });
});
