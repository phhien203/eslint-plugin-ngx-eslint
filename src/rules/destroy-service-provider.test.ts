import { RuleTester } from "eslint";

import rule from "./destroy-service-provider";

const tester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: { ecmaVersion: 2015 },
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
          message:
            "Please provide DestroyService in Component class providers.",
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
          message:
            "Please provide DestroyService in Directive class providers.",
        },
      ],
    },
  ],
});
