describe('ravelinjs', function () {
  before(function () {
    if (process.env.SKIP_ALL) {
      this.skip();
    }
  });

  describe('script tag usage', function () {
    suite('/pages/scripttag/');
  });

  describe('script tag minified usage', function () {
    suite('/pages/scripttag-min/');
  });

  describe('requirejs usage', function () {
    suite('/pages/amd/');
  });

  describe('requirejs minified usage', function () {
    suite('/pages/amd-min/');
  });

  describe('webpack usage', function () {
    suite('/pages/webpack/');
  });
});

function suite(page) {
  before(function () {
    const described = this.currentTest.parent.title;
    if (process.env.SUITE && described.indexOf(process.env.SUITE) == -1) {
      this.skip();
    }
  });

  it('loads', function () {
    browser.url(page);
  });
  it('sets device cookies', function () {
    checkCookiesAreSet();
  })
  it('collects basic device data', function () {
    checkFingerprintingDoesNotError();
  });
  it('tracks page events', function () {
    checkTrackingEventsDoNotError();
  })
  it('encrypts cards', function () {
    checkCardEncryptionWorks();
  });
}

function checkCookiesAreSet() {
  const want = ['ravelinSessionId', 'ravelinDeviceId'];
  const have = browser.getCookies(want);

  for (let w of want) {
    let found = false;
    for (let h of have) {
      if (h.name === w) {
        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error('Expected cookie "' + w + '" to be set.');
    }
  }
}

function checkCardEncryptionWorks() {
  // Fill in the card encryption form
  $('#name').setValue('John');
  $('#number').setValue('4111 1111 1111 1111');
  $('#month').selectByAttribute('value', '4');
  $('#year').setValue('2019');

  // Submit the form.
  $('#encrypt').click();

  const err = $('#encryptionOutputError'),
        out = $('#encryptionOutput');
  let errText = err.getText(),
      outText = out.getText();

  // Double-check we submitted the form.
  if (errText == "" && outText == "") {
    // $('#encrypt').click() isn't doing the job on some browsers. The operation
    // doesn't trigger the event handler - the button just appears unclicked.
    // It's happening consistently with Android 5/7 and Safari 13 running on
    // Browserstack. We seem to be able to reliably click the button with
    // JavaScript despite this.
    browser.execute(function () {
      document.getElementById('encrypt').click();
    });
    errText = err.getText()
    outText = out.getText()
  }

  // Check there was no error.
  if (errText) {
    throw new Error(errText);
  }

  // Check the results looked valid
  if (outText.indexOf('aesKeyCiphertext') == -1) {
    throw new Error('Expected encryption output to container "aesKeyCiphertext" but received: ' + outText);
  }
}

function checkFingerprintingDoesNotError() {
  // We have hooked up the #trackFingerprint button to call ravelinjs.trackFingerprint
  // and provided a callback that writes any resulting errors to #fingerprintError.
  // No text in #fingerprintError means no error occured fingerprinting the device.
  // Reference common.js to check out these registrations.
  $('#trackFingerprint').click();

  browser.pause(1000);

  const error = $('#fingerprintError').getText();
  if (error) throw new Error(error);
}

function checkTrackingEventsDoNotError() {
  // We have hooked up the #track, #trackPage, #trackLogin and #trackLogout buttons to call
  // their respective ravelinjs functions,  and provided a callback that writes any errors to #trackingError.
  // No text in #trackingError means no error occured fingerprinting the device.
  // Reference common.js to check out these registrations.
  var buttons = ['', 'Page', 'Login', 'Logout'];

  for (var i = 0; i < buttons.length; i++) {
    $('#track' + buttons[i]).click();

    browser.pause(1000);

    const error = $('#trackingError').getText();
    if (error) throw new Error(error);
  }
}
