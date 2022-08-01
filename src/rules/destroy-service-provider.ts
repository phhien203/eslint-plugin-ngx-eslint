import {
  CallExpression,
  ClassDeclaration,
  Decorator,
  MethodDefinition,
  ObjectExpression,
  Property,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { ESLintUtils } from "@typescript-eslint/utils";
import { repositoryUrl } from "../utils";

export const ruleName = "destroy-service-provider";

type MessageIds = "missing";

type Options = [
  {
    /**
     * @default DestroyService
     */
    destroyServiceName?: string;
  },
];

const createRule = ESLintUtils.RuleCreator(name => `${repositoryUrl}#${name}`);

export const rule = createRule<Options, MessageIds>({
  create(context, [options]) {
    return {
      "ClassDeclaration > Decorator[expression.callee.name=/^(Component|Directive)$/]":
        (node: Decorator) => {
          const nodeExpression = node.expression as CallExpression;
          const isDecoratorEmpty =
            !nodeExpression.arguments.length ||
            !(nodeExpression.arguments[0] as ObjectExpression).properties
              .length;

          if (isDecoratorEmpty) {
            return;
          }

          // whether component has providers decorator property
          const providersProperty = (
            nodeExpression.arguments[0] as ObjectExpression
          ).properties.find((property: any) => {
            return (
              property.key.type === "Identifier" &&
              property.key.name === "providers"
            );
          }) as Property;

          let providerValuesHasDestroyService: boolean = false;

          if (
            providersProperty &&
            providersProperty.value &&
            providersProperty.value.type === "ArrayExpression"
          ) {
            providerValuesHasDestroyService =
              !!providersProperty.value.elements.find((e: any) => {
                return (
                  e.type === "Identifier" &&
                  e.name === options.destroyServiceName
                );
              });
          }

          if (
            !providersProperty ||
            (providersProperty && !providerValuesHasDestroyService)
          ) {
            // get constructor
            const classDeclaration = (node as any).parent as ClassDeclaration;
            const classElements = classDeclaration.body.body;
            const classConstructor = classElements.find(e => {
              return e.type === "MethodDefinition" && e.kind === "constructor";
            });

            let hasDestroy;

            if (classConstructor) {
              // find DestroyService
              const params: any[] = (classConstructor as MethodDefinition).value
                .params;
              hasDestroy = params.find(param => {
                return (
                  param.type === "TSParameterProperty" &&
                  param.parameter.type === "Identifier" &&
                  param.parameter.typeAnnotation.typeAnnotation.type ===
                    "TSTypeReference" &&
                  param.parameter.typeAnnotation.typeAnnotation.typeName
                    .type === "Identifier" &&
                  param.parameter.typeAnnotation.typeAnnotation.typeName
                    .name === options.destroyServiceName
                );
              });
            }

            if (hasDestroy) {
              context.report({
                loc: hasDestroy.loc,
                messageId: "missing",
                data: {
                  className: (nodeExpression as any).callee.name,
                },
              });
            }
          }
        },
    };
  },
  name: ruleName,
  meta: {
    type: "problem",
    docs: {
      description:
        "Destroy service should be provided in Component/Directive providers/viewProviders array.",
      recommended: "error",
    },
    messages: {
      missing:
        "Please provide DestroyService in {{className}} class providers.",
    },
    schema: [
      {
        type: "object",
        properties: {
          destroyServiceName: {
            type: "string",
            default: "DestroyService",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{ destroyServiceName: "DestroyService" }],
});
