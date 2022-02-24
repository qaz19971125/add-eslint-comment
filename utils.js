function genEslintComment(rule, type = "js") {
  rule = Array.isArray ? rule : [rule];

  const ruleCommentList = rule.map((rule) => {
    return rule + ': ' + '1'
  })

  if (type === "js") {
    return `/* eslint ${ruleCommentList.join(", ")} */`;
  } else if (type === "html") {
    return `<!-- eslint ${ruleCommentList.join(", ")} -->`;
  }
}



module.exports = {
  genEslintComment,
};
