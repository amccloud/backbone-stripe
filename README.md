# Backbone Stripe [![Build Status](https://secure.travis-ci.org/amccloud/backbone-stripe.png)](http://travis-ci.org/amccloud/backbone-stripe]) #
A Backbone.Model wrapper around stripe.js.

## Example ##
```javascript
Stripe.setPublishableKey('YOUR_PUBLISHABLE_KEY');

var user = new Backbone.Model();

// Creating a token:
var testToken = new StripeToken({
    'card': {
        'number': '4242424242424242',
        'exp_month': '06',
        'exp_year': '2013',
        'cvc': '444'
    }
});

testToken.on('change:id', function(model, token) {
    // Anytime the token id is changed update the account.
    user.set('stripe_token_id', token);
});

testToken.save();

testToken.get('card').number // '••••••••••••4242'
testToken.get('card').type // 'Visa'

// Fetching a card by token:
var userToken = new StripeToken({
    'id': user.get('stripe_token_id')
});

userToken.fetch({
    success: function(model) {
        model.get('card').number // '••••••••••••4242'
        model.get('card').type // 'Visa'
        model.attributes == testToken.attributes // true
    }
});
```
