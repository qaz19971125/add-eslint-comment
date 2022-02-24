const path = require("path");
const fs = require("fs");
const { genEslintComment } = require("./utils");
const { warningRuleList } = require("./const");
const eslintJson = require("./eslint-result.json");

eslintJson.results.forEach((result) => {
  // result.filePath - 文件路径
  // result.messages - 错误信息数组
  if (result.messages.length === 0) return; // 文件通过了eslint所有检查，无 warning 和 error

  // messages: Message[]
  // Message {
  //  ruleId - 规则名
  // }
  const shouldWarningRuleList = result.messages.reduce((acc, cur) => {
    if (warningRuleList.includes(cur.ruleId) && !acc.includes(cur.ruleId)) {
      acc.push(cur.ruleId);
    }
    return acc;
  }, []);

  let commentType = /.*\.js/.test(result.filePath) ? "js" : "html";
  if (shouldWarningRuleList.length > 0) {
    const eslintComment = genEslintComment(shouldWarningRuleList, commentType);
    fs.writeFileSync(
      result.filePath,
      eslintComment + "\r\n\r\n" + fs.readFileSync(result.filePath)
    );

    // 如果是vue文件，需要在<script>标签里也加上注释
    if (/.*\.vue/.test(result.filePath)) {
      fs.writeFileSync(
        result.filePath,
        fs
          .readFileSync(result.filePath)
          .toString("utf-8")
          .replace(
            /<script>/,
            `<script>\r\n${genEslintComment(shouldWarningRuleList, "js")}\r\n`
          )
      );
    }
  }

  console.log(`已处理 ${result.filePath} !`);
});
