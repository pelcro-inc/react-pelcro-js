## [2.0.3](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.2...v2.0.3) (2021-07-26)


### Bug Fixes

* **checkout form:** credit cards icons having no explicit width ([#60](https://github.com/pelcro-inc/react-pelcro-js/issues/60)) ([c6698aa](https://github.com/pelcro-inc/react-pelcro-js/commit/c6698aa99348053d1a9899275e95800fc0038ae1))

## [2.0.2](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.1...v2.0.2) (2021-07-22)


### Bug Fixes

* **register:** registerContainer clone method ([7c981a4](https://github.com/pelcro-inc/react-pelcro-js/commit/7c981a4d8e44c205ce15ffc608c722a17cad4004))

## [2.0.1](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.0...v2.0.1) (2021-07-22)


### Bug Fixes

* **login:** only clone non null react children ([faa8a9f](https://github.com/pelcro-inc/react-pelcro-js/commit/faa8a9fae2d94699ee2c9861428c78852b461ca0))

# [2.0.0](https://github.com/pelcro-inc/react-pelcro-js/compare/v1.1.1...v2.0.0) (2021-07-22)


### Bug Fixes

* **Toast:** change Toast comp name to Notification ([9f928f1](https://github.com/pelcro-inc/react-pelcro-js/commit/9f928f12f1679599ad52aa62713e85a365501ddb))


### Features

* add offline plans URL trigger ([#58](https://github.com/pelcro-inc/react-pelcro-js/issues/58)) ([981259c](https://github.com/pelcro-inc/react-pelcro-js/commit/981259c919387a6c1028117728de56961da91f21))
* add payment method modal ([2bec784](https://github.com/pelcro-inc/react-pelcro-js/commit/2bec784d2f3ab0f1f698a87c7e7694a3de1608b9))
* add toast messages component ([#56](https://github.com/pelcro-inc/react-pelcro-js/issues/56)) ([2cb210b](https://github.com/pelcro-inc/react-pelcro-js/commit/2cb210be668e0deca24da3913643ff484c01cd8c))
* add toast sub-component ([ce2c34f](https://github.com/pelcro-inc/react-pelcro-js/commit/ce2c34fb50766a8ad414f4f053bd78d8a89d9a5a))
* change solid X icon to a different looking one ([319f123](https://github.com/pelcro-inc/react-pelcro-js/commit/319f123bb4ee9a4fae36eb0b1e4c4b16c43b532a))
* dispatch modal view event with each modal displayed ([#59](https://github.com/pelcro-inc/react-pelcro-js/issues/59)) ([81a7f49](https://github.com/pelcro-inc/react-pelcro-js/commit/81a7f4920081228f94c55334d606b454cf38fcd4))
* export new payment method select components ([4af17c3](https://github.com/pelcro-inc/react-pelcro-js/commit/4af17c315c97c723642389693926062dc601a14f))
* **(native buttons):** show error toast on ecomm currency errors ([1a81608](https://github.com/pelcro-inc/react-pelcro-js/commit/1a81608e2f7c636529590c9bd0266de87c57bd46))
* **payment method:** add payment method select modal, view and container ([8c3b7b7](https://github.com/pelcro-inc/react-pelcro-js/commit/8c3b7b7402f6084d3ae25560929cc554db8b1e04))
* **payment method:** add payment method selection flow ([9b0b5c1](https://github.com/pelcro-inc/react-pelcro-js/commit/9b0b5c146033f7523a8ea919d2b1536a1e586038))
* **payment method:** add SelectedPaymentMethod to checkout forms ([13e8b0b](https://github.com/pelcro-inc/react-pelcro-js/commit/13e8b0bd206e867f1139b2d3daec9d41d384db9f))
* **social:** add social login buttons ([#55](https://github.com/pelcro-inc/react-pelcro-js/issues/55)) ([ce9374f](https://github.com/pelcro-inc/react-pelcro-js/commit/ce9374f54b5e13f7bea547f206fb1618f1e2fbc7))
* **usePelcro:** handle ecomm items that dont match user currency ([0671601](https://github.com/pelcro-inc/react-pelcro-js/commit/0671601b96a5356561bb53a6a0643fd9738af0ac))


### BREAKING CHANGES

* **payment method:** Consumer needs to import the new PaymentMethodSelectModal
* Consumers need to add the new PaymentMethodSelect modal under PelcroModalController
* Consumers need to add PaymentMethodSelect modal

# [2.0.0-beta.4](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.0-beta.3...v2.0.0-beta.4) (2021-07-20)


### Features

* dispatch modal view event with each modal displayed ([#59](https://github.com/pelcro-inc/react-pelcro-js/issues/59)) ([81a7f49](https://github.com/pelcro-inc/react-pelcro-js/commit/81a7f4920081228f94c55334d606b454cf38fcd4))

# [2.0.0-beta.3](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.0-beta.2...v2.0.0-beta.3) (2021-07-19)


### Features

* add offline plans URL trigger ([#58](https://github.com/pelcro-inc/react-pelcro-js/issues/58)) ([981259c](https://github.com/pelcro-inc/react-pelcro-js/commit/981259c919387a6c1028117728de56961da91f21))

# [2.0.0-beta.2](https://github.com/pelcro-inc/react-pelcro-js/compare/v2.0.0-beta.1...v2.0.0-beta.2) (2021-07-19)


### Features

* export new payment method select components ([4af17c3](https://github.com/pelcro-inc/react-pelcro-js/commit/4af17c315c97c723642389693926062dc601a14f))

# [2.0.0-beta.1](https://github.com/pelcro-inc/react-pelcro-js/compare/v1.2.0-beta.3...v2.0.0-beta.1) (2021-07-19)


### Features

* **payment method:** add payment method select modal, view and container ([8c3b7b7](https://github.com/pelcro-inc/react-pelcro-js/commit/8c3b7b7402f6084d3ae25560929cc554db8b1e04))

### BREAKING CHANGES

* Consumers need to add the new PaymentMethodSelect modal under PelcroModalController
