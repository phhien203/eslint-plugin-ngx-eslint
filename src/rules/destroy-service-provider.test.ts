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
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
          providers: [DestroyService]
        })
        export class WelcomeComponent implements OnInit {
          constructor(
            @Inject(DestroyService) private destroy$: DestroyService,
          ) {}
        }`,
    },
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
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
          providers: [Destroy]
        })
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: Destroy,
          ) {}
        }`,
      options: [{ destroyServiceName: "Destroy" }],
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
        @Directive({
          selector: 'my-directive',
          providers: [Destroy]
        })
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: Destroy,
          ) {}
        }`,
      options: [{ destroyServiceName: "Destroy" }],
    },
    // developer forgot to config custom DestroyService name to `Destroy`
    // so the rule doesn't recognize `Destroy` is a DestroyService
    {
      code: `
        @Directive({
          selector: 'my-directive',
          providers: []
        })
        export class MyDirective implements OnInit {
          constructor(
            private destroy$: Destroy,
          ) {}
        }`,
    },
    // test cases below will verify when syntax of Component/Directive is invalid
    // the rule won't check until Component/Directive syntax error is fixed
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
            destroyServiceName: "DestroyService",
          },
        },
      ],
    },
    {
      code: `
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
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
            destroyServiceName: "DestroyService",
          },
        },
      ],
    },
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
            private destroy$: Destroy,
          ) {}
        }`,
      options: [{ destroyServiceName: "Destroy" }],
      errors: [
        {
          messageId: "missing",
          data: {
            className: "Component",
            destroyServiceName: "Destroy",
          },
        },
      ],
    },
    {
      code: `
        @Component({
          selector: 'my-orgs',
          templateUrl: './welcome.component.html',
          styleUrls: ['./welcome.component.scss'],
        })
        export class WelcomeComponent implements OnInit {
          constructor(
            private destroy$: Destroy,
          ) {}
        }`,
      options: [{ destroyServiceName: "Destroy" }],
      errors: [
        {
          messageId: "missing",
          data: {
            className: "Component",
            destroyServiceName: "Destroy",
          },
        },
      ],
    },
    {
      code: `
        @Directive({
          selector: 'my-directive',
          providers: [],
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
            destroyServiceName: "DestroyService",
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
            destroyServiceName: "DestroyService",
          },
        },
      ],
    },
    {
      code: `
        @Directive({
          selector: 'my-directive',
          providers: []
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
            destroyServiceName: "Destroy",
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
            destroyServiceName: "Destroy",
          },
        },
      ],
    },
  ],
});
