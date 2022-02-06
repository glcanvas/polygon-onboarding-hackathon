# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample
script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

помимо этого добавил возможность запускать тесты при помощи WebStorm & Mocha, что должно быть гораздо удобнее консоли

https://github.com/benyaminahmed/nft-image-generator/blob/main/generate.ipynb -- генератор взял отсюда
https://github.com/bodasooqa/freaky-goblins-nft/blob/master/deploy/deploy-goblin.js -- деплой отсюда

deploy

```shell
npx hardhat run --network mumbai deploy/deploy.js
```
