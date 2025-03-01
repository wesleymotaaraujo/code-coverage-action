const core = require("@actions/core");

const valueOrFalse = (value) =>
  value === "" || value.toLowerCase() === "false" ? false : value;

const getShowAnnotations = () => {
  const availableAnnotations = ["warning", "error"];

  const showAnnotations = core.getInput("show-annotations");

  if (showAnnotations === "") return false;

  if (!availableAnnotations.includes(showAnnotations)) {
    throw new Error(
      `'show-annotations' param should be empty or one of the following options ${availableAnnotations.join(
        ","
      )}`
    );
  }

  return showAnnotations;
};

const getGithubToken = () => valueOrFalse(core.getInput("github-token"));

const getAppName = () => valueOrFalse(core.getInput("app-name"));

const getBarecheckGithubAppToken = () =>
  valueOrFalse(core.getInput("barecheck-github-app-token"));

const getBarecheckApiKey = () =>
  valueOrFalse(core.getInput("barecheck-api-key"));

const getLcovFile = () => {
  core.info("Getting lcov file");
  return core.getInput("lcov-file");

} 

const getBaseLcovFile = () => valueOrFalse(core.getInput("base-lcov-file"));

const getSendSummaryComment = () =>
  valueOrFalse(core.getInput("send-summary-comment"));

module.exports = {
  getShowAnnotations,
  getGithubToken,
  getBarecheckGithubAppToken,
  getBarecheckApiKey,
  getAppName,
  getLcovFile,
  getBaseLcovFile,
  getSendSummaryComment
};
