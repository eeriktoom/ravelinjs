describe('ravelinjs', function() {
    const cap = browser.desiredCapabilities;

    before(function() {
      try {
        browser.log('browser');
      } catch(errIgnore) {}
    });
    afterEach(function() {
      try {
        const resp = browser.log('browser');
        for (log of resp.value) {
          console.info(log.level, log.message);
        }
      } catch (err) {
        console.log(err);
      }
    });

    it('can be used with a script tag', function() {
        browser.waitForURL('/pages/scripttag/index.html', cap.navigateTimeoutMS);
        suite(browser, cap);
    });

    it('can be used minified with a script tag', function() {
        browser.waitForURL('/pages/scripttag-min/index.html', cap.navigateTimeoutMS);
        suite(browser, cap);
    });

    usuallyIt(!cap.requireJSTestDisabled, 'can be used with requirejs', function() {
        browser.waitForURL('/pages/amd/index.html', cap.navigateTimeoutMS);
        suite(browser, cap);
    });

    usuallyIt(!cap.requireJSTestDisabled, 'can be used minified with requirejs', function() {
        browser.waitForURL('/pages/amd-min/index.html', cap.navigateTimeoutMS);
        suite(browser, cap);
    });

    usuallyIt(!cap.webpackTestDisabled, 'can be used with webpack', function() {
        browser.waitForURL('/pages/webpack/index.html', cap.navigateTimeoutMS);
        suite(browser, cap);
    });
});

function suite(browser, cap) {
    // Wait for the page to load.
    $('#name').waitForExist(cap.renderTimeoutMS);

    // Do the form.
    browser.setValue('#name', 'John');
    browser.setValue('#number', '4111 1111 1111 1111');
    browser.selectByValue('#month', '4')
    browser.setValue('#year', '2019');
    browser.click('#update');

    // Wait for something to happen.
    browser.waitForText('#output, #output-error', 3000);

    // Check there was no error.
    var error = browser.getText('#output-error');
    if (error) throw new Error(error);
}

function usuallyIt(itDoes) {
    return (itDoes ? it : it.skip).apply(this, Array.prototype.slice.call(arguments, 1));
}
