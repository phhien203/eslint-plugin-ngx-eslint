import { ESLintUtils } from "@typescript-eslint/utils";
import { rule } from "./destroy-service-provider";

const tester = new ESLintUtils.RuleTester({
  parser: "@typescript-eslint/parser",
});

tester.run("destroy-service-provider", rule, {
  valid: [
    {
      code: `
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
          providers: [DestroyService]
        })
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
    {
      code: `
        @Component()
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
    {
      code: `
        @Component({})
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
    {
      code: `
        @Directive({
          selector: 'my-directive',
          providers: [DestroyService]
        })
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
    {
      code: `
        @Directive()
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
    {
      code: `
        @Directive({})
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
    },
  ],
  invalid: [
    {
      code: `
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
          providers: []
        })
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
      errors: [
        {
          messageId: "missing",
          data: {
            className: "Component",
          },
        },
      ],
    },
    {
      code: `
        @Directive({
          selector: 'my-directive',
        })
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: DestroyService,
          ) {}
        }`,
      errors: [
        {
          messageId: "missing",
          data: {
            className: "Directive",
          },
        },
      ],
    },
    {
      code: `
        @Directive({
          selector: 'my-directive',
        })
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: Destroy,
          ) {}
        }`,
      options: [{ destroyServiceName: "Destroy" }],
      errors: [
        {
          messageId: "missing",
          data: {
            className: "Directive",
          },
        },
      ],
    },
  ],
});
