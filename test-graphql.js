const q = `query {
  user(login: "Tanmay240405"){
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
  body: JSON.stringify({ query: q })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2)));
