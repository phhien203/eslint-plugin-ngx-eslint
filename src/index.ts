import * as destroyServiceProviderRule from "./rules/destroy-service-provider";

export = {
  rules: {
    [destroyServiceProviderRule.ruleName]: destroyServiceProviderRule.rule,
  },
};
