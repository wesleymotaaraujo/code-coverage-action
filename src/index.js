const core = require("@actions/core");

const { parseLcovFile } = require("@barecheck/core");

const { getLcovFile, getBarecheckApiKey } = require("./input");

const { sendCurrentCoverage } = require("./lib/api");

const sendSummaryComment = require("./services/sendSummaryComment");
const showAnnotations = require("./services/showAnnotations");
const checkMinimumRatio = require("./services/minimumRatio");
const getBaseCoverageDiff = require("./services/baseCoverageDiff");
const getChangedFilesCoverage = require("./services/changedFilesCoverage");

const runCodeCoverage = async (coverage) => {
  const diff = await getBaseCoverageDiff(coverage);
  core.info(`Code coverage diff: ${diff}%`);

  core.info(`await getChangedFiles`);
  const changedFilesCoverage = await getChangedFilesCoverage(coverage);
  core.info(`sendSummaryComment`);
  await sendSummaryComment(changedFilesCoverage, diff, coverage.percentage);

  core.info(`checkMinimumRatio`);
  await checkMinimumRatio(diff);
  core.info(`showAnnotations`);
  await showAnnotations(changedFilesCoverage);
  core.info(`getBarecheckApiKey`);
  if (getBarecheckApiKey()) await sendCurrentCoverage(coverage.percentage);
  core.setOutput("percentage", coverage.percentage);
  core.setOutput("diff", diff);
};

async function main() {
  try {
    core.info("Starting code coverage action");
    const compareFile = getLcovFile();
    core.info(`lcov-file: ${compareFile}`);
    core.info("Parsing lcov file");
    const coverage = await parseLcovFile(compareFile);
    core.info(`Current code coverage: ${coverage.percentage}%`);
    core.info(`runCodeCoverage`);
    await runCodeCoverage(coverage);
  } catch (err) {
    core.info(err);
    core.info(err.message);
    core.info(err.stack)
    core.setFailed(err.message);
  }
}

main();
