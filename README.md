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

