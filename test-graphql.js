const username = process.env.GITHUB_USERNAME || process.env.NEXT_PUBLIC_GITHUB_USERNAME;

if (!username) {
  console.error("Please set GITHUB_USERNAME in environment variables.");
  process.exit(1);
}

const q = `query($userName: String!) {
  user(login: $userName){
    contributionsCollection {
      commitContributionsByRepository { repository { nameWithOwner } contributions { totalCount } }
      pullRequestContributionsByRepository { repository { nameWithOwner } contributions { totalCount } }
      pullRequestReviewContributionsByRepository { repository { nameWithOwner } contributions { totalCount } }
      repositoryContributions(first: 100) { totalCount nodes { repository { nameWithOwner } } }
    }
  }
}`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { 'Authorization': 'bearer ' + process.env.GITHUB_PAT, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: q, variables: { userName: username } })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2)));

