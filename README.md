# Pelcro React Elements

## Motivation

- Gives users more control over the structure of their apps. By giving them the ability to compose components, and add or remove fields from forms.

- Allows users to customize the look of their components. By passing styles to the style props of the components, or adding classNames to the individual components.

- Reduces bugs. By centralizing the common logic in smaller functional components and custom hooks, and reusing these components across the apps.

## Components

### Overview

Users are able to use our Main UI components directly as they are, e.g. `The login modal`, or they can have a more granular control over how their components should look like by using subcomponents, e.g. `email component`.

### Main Components

#### `<Login style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {}} />`

Returns the main Login component from Pelcro's Main UI.

#### `<Register style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {}} />`

Returns the main Registeration component from Pelcro's Main UI.

#### `<Dashboard style={stylesObject} className={classNamesString} />`

Returns the main Dashboard component from Pelcro's Main UI.

#### `<Subscribe className={classNamesString} onSuccess={() => {}} onError={() => {}}>`

Opens the select subscription viwe, which is the main Select component from Pelcro's Main UI.

### Subcomponents

#### `<LoginContainer style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {}}> Subcomponents </LoginContainer>`

You can use these subcomponents inside it

- `<Email style={stylesObject} className={classNamesString} />`

- `<Password style={stylesObject} className={classNamesString} />`

- `<LoginButton style={stylesObject} className={classNamesString} name="button name [Login]" />`

#### Example

```
<LoginContainer onSuccess={() => {}} onError={() => {}}>
    <label htmlFor="email">Email: </label>
    <Email placeholder="Email Address" id="email" />
    <label htmlFor="password">Password: </label>
    <Password id="password" />
    <LoginButton name="Login here" />
</LoginContainer>
```

#### `<RegisterContainer onSuccess={() => {}} onError={() => {}}> Subcomponents </RegisterContainer>`

You can use these subcomponents inside it

- `<FirstName style={stylesObject} className={classNamesString} />`

- `<LastName style={stylesObject} className={classNamesString} />`

- `<Email style={stylesObject} className={classNamesString} />`

- `<Password style={stylesObject} className={classNamesString} />`

- `<ConfirmPassword style={stylesObject} className={classNamesString} />`

- `<TermsOfService style={stylesObject} className={classNamesString} />`

- `<PrivacyPolicy style={stylesObject} className={classNamesString} />`

#### `<DashboardContainer> Subcomponents </DashboardContainer>`

You can use these subcomponents inside it

- `<UpdatePaymentMethod style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {} />`

- `<UpdateAddress style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {} />`

- `<UpdateSubscription style={stylesObject} className={classNamesString} onSuccess={() => {}} onError={() => {} />`
