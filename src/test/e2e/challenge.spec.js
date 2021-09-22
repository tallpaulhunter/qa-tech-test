const {
  Builder, By, until,
} = require('selenium-webdriver');

const should = require('chai').should();

describe('Engineer test', () => {
  it('solve challenge', async () => {
    const driver = await new Builder().forBrowser('firefox').build();

    try {
      await driver.get('http://localhost:3000');

      await driver.findElement(By.xpath('//button[@data-test-id="render-challenge"]')).click();

      await driver.findElement(By.id('challenge')).isDisplayed();

      const challengeAnswers = [];

      for (let tableRow = 1; tableRow < 4; tableRow++) {
        const rowArray = await driver.findElement(By.xpath(`//tbody/tr[${tableRow}]`)).getText().then(text => text.split(' '));

        challengeAnswers.push(calculateArrayIndex(rowArray));
      }

      await driver.findElement(By.xpath('//input[@data-test-id="submit-1"]')).sendKeys(challengeAnswers[0]);
      await driver.findElement(By.xpath('//input[@data-test-id="submit-2"]')).sendKeys(challengeAnswers[1]);
      await driver.findElement(By.xpath('//input[@data-test-id="submit-3"]')).sendKeys(challengeAnswers[2]);
      await driver.findElement(By.xpath('//input[@data-test-id="submit-4"]')).sendKeys('Paul Hunter');

      await driver.findElement(By.xpath('//*[text()=\'Submit Answers\']')).click();
      const congratsMessage = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(),\'Congratulations you have succeeded\')]'))).getText().then(text => text);

      congratsMessage.should.contain('Congratulations you have succeeded. Please submit your challenge');
    } finally {
      // close the browser
      await driver.quit();
    }
  });
});

function calculateArrayIndex(rowArray) {
  for (let i = 1; i < 9; i++) {
    let leftSum = 0;
    let rightSum = 0;

    // left calc
    for (let j = 0; j < i; j++) {
      leftSum += parseInt(rowArray[j]);
    }

    // right calc
    for (let k = i + 1; k < rowArray.length; k++) {
      rightSum += parseInt(rowArray[k]);
    }

    if (leftSum === rightSum) {
      return i;
    }
  }
  return 0;
}
