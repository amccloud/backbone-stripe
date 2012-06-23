Stripe.setPublishableKey('pk_C2ARapYrxri5SPiXSsBaLNNjNonSV');

asyncTest("creating and changing a token", 5, function() {
    var testToken = new StripeToken({
        'card': {
            'number': '4242424242424242',
            'exp_month': '06',
            'exp_year': '2013',
            'cvc': '444'
        }
    });

    testToken.save({
        success: function(model) {
            ok(model.id);
            equal(model.get('card').number, '••••••••••••4242');

            var oldId = model.id,
                card = testToken.get('card');

            card.number = '4111111111111111';
            testToken.set('card', card);

            testToken.save({
                success: function(model) {
                    ok(model.id);
                    notEqual(model.id, oldId);
                    equal(model.get('card').number, '••••••••••••1111');
                    start();
                }
            });
        }
    });
});

asyncTest("error when trying to save an existing token", 1, function() {
    var testToken = new StripeToken({
        'card': {
            'number': '4242424242424242',
            'exp_month': '06',
            'exp_year': '2013',
            'cvc': '444'
        }
    });

    testToken.on('error', function(model, resp) {
        equal(resp.error.code, 'invalid_number');
        start();
    });

    testToken.save({
        success: function(model) {
            testToken.save();
        }
    });
});

asyncTest("fetch existing token from stripe", 1, function() {
    var setToken = new StripeToken({
        'card': {
            'number': '4242424242424242',
            'exp_month': '06',
            'exp_year': '2013',
            'cvc': '444'
        }
    });

    setToken.save({
        success: function() {
            var getToken = new StripeToken({
                'id': setToken.id
            });

            getToken.fetch({
                success: function() {
                    deepEqual(getToken.attributes, setToken.attributes);
                    start();
                }
            });
        }
    });
});
