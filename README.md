# Pelcro React Elements

## Motivation

- Gives users more control over the structure of their apps. By giving them the ability to compose components, and add or remove fields from forms.

- Allows users to customize the look of their components. By passing styles to the style props of the components, or adding classNames to the individual components.

- Reduces bugs. By centralizing the common logic in smaller functional components and custom hooks, and reusing these components across the apps.

## Components

### Overview

Users are able to use our Main UI components directly as they are, e.g. `The login modal`, or they can have a more granular control over how their components should look like by using subcomponents, e.g. `email component`.

### Main Components

#### `<Login styles={stylesObject} classNames={classNamesString} onSubmit={() => {}} onSuccess={() => {}} onError={() => {}} />`

Returns the main Login component from Pelcro's Main UI.

#### `<Register styles={stylesObject} classNames={classNamesString} onSubmit={() => {}} onSuccess={() => {}} onError={() => {}} />`

Returns the main Registeration component from Pelcro's Main UI.

#### `<Dashboard styles={stylesObject} classNames={classNamesString} />`

Returns the main Dashboard component from Pelcro's Main UI.


### Subcomponents

#### `<LoginContainer onSubmit={() => {}} onSuccess={() => {}} onError={() => {}}> Subcomponents </LoginContainer>`

You can use these subcomponents inside it

- `<Email styles={stylesObject} classNames={classNamesString} />`

- `<Password styles={stylesObject} classNames={classNamesString} />`

#### `<RegisterContainer onSubmit={() => {}} onSuccess={() => {}} onError={() => {}}> Subcomponents </RegisterContainer>`

You can use these subcomponents inside it

- `<FirstName styles={stylesObject} classNames={classNamesString} />`

- `<LastName styles={stylesObject} classNames={classNamesString} />`

- `<Email styles={stylesObject} classNames={classNamesString} />`

- `<Password styles={stylesObject} classNames={classNamesString} />`

- `<ConfirmPassword styles={stylesObject} classNames={classNamesString} />`

- `<TermsOfService styles={stylesObject} classNames={classNamesString} />`

- `<PrivacyPolicy styles={stylesObject} classNames={classNamesString} />`

