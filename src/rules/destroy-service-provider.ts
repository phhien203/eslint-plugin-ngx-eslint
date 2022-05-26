import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  create: context => {
    return {
      "ClassDeclaration > Decorator[expression.callee.name=/^(Component|Directive)$/]":
        (node: any) => {
          const isDecoratorEmpty =
            !node.expression.arguments.length ||
            !node.expression.arguments[0].properties.length;

          if (isDecoratorEmpty) {
            return;
          }

          // whether component has providers decorator property
          const providersProperty =
            node.expression.arguments[0].properties.find((property: any) => {
              return (
                property.key.type === "Identifier" &&
                property.key.name === "providers"
              );
            });

          let providerValuesHasDestroyService: boolean = false;

          if (
            providersProperty &&
            providersProperty.value &&
            providersProperty.value.type === "ArrayExpression"
          ) {
            providerValuesHasDestroyService =
              !!providersProperty.value.elements.find((e: any) => {
                return e.type === "Identifier" && e.name === "DestroyService";
              });
          }

          if (
            !providersProperty ||
            (providersProperty && !providerValuesHasDestroyService)
          ) {
            // get constructor
            const classDeclaration = node.parent;
            const classElements = classDeclaration.body.body;
            const classConstructor = classElements.find((e: any) => {
              return e.type === "MethodDefinition" && e.kind === "constructor";
            });

            let hasDestroy;

            if (classConstructor) {
              // find DestroyService
              const params: any[] = classConstructor.value.params;
              hasDestroy = params.find(param => {
                return (
                  param.type === "TSParameterProperty" &&
                  param.parameter.type === "Identifier" &&
                  param.parameter.typeAnnotation.typeAnnotation.type ===
                    "TSTypeReference" &&
                  param.parameter.typeAnnotation.typeAnnotation.typeName
                    .type === "Identifier" &&
                  param.parameter.typeAnnotation.typeAnnotation.typeName
                    .name === "DestroyService"
                );
              });
            }

            if (hasDestroy) {
              context.report({
                loc: hasDestroy.loc,
                message: `Please provide DestroyService in ${node.expression.callee.name} class providers.`,
              });
            }
          }
        },
    };
  },
};

export = rule;
