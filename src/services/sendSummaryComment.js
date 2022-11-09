const core = require("@actions/core");
const { getCoverageReportBody, githubApi } = require("@barecheck/core");

const { getPullRequestContext, getOctokit } = require("../lib/github");
const { getSendSummaryComment, getAppName } = require("../input");

const sendSummaryComment = async (
  changedFiles,
  coverageDiff,
  totalCoverage
) => {
  const isSendSummaryComment = getSendSummaryComment();
  const pullRequestContext = getPullRequestContext();

  if (isSendSummaryComment && pullRequestContext) {
    core.info(`send-summary-comment is enabled for this workflow`);

    const appName = getAppName() ? getAppName() : "Barecheck";

    const title = `${appName} - Code coverage report`;

    const body = getCoverageReportBody({
      changedFiles,
      title,
      coverageDiff,
      totalCoverage
    });

    const octokit = await getOctokit();
    const { repo, owner, pullNumber } = pullRequestContext;
    try {
      await githubApi.createComment(octokit, {
        repo,
        owner,
        pullNumber,
        body
      });
    }
    catch (err) {
      core.info(err);
      core.info(err.message);
      core.info(err.stack)
      core.setFailed(err.message);
    }
  }
};

module.exports = sendSummaryComment;
