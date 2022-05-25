# Custom ESLint rules for Angular projects

## What's this?

This is a repository containing custom ESLint rules for Angular projects

## Rules included

`destroy-service-provider`: When using `DestroyService` to automatically unsubscribe from an observable, this service MUST be provided in Component/Directive class providers in order for the Service to work properly. This rule ensures the DestroyService is always provided in the `providers` array of the Component or Directive.

## Usage

Edit your eslint config file as follow

```json
{
  "plugins": ["ngx-eslint"],
  "rules": {
    "ngx-eslint/destroy-service-provider": "error"
  }
}
```

## LICENSE

MIT
