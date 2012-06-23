var StripeToken = Backbone.Model.extend({
    api: Stripe,
    defaults: {
        'amount': null
    },

    parse: function(resp) {
        resp.card.number =  '••••••••••••' + resp.card.last4;
        return resp;
    },
    validate: function(attrs) {
        if (attrs.card) {
            if (attrs.card.number && !attrs.card.last4 && !this.api.validateCardNumber(attrs.card.number))
                return "Invalid card number";

            if (attrs.card.exp_month && attrs.card.exp_year && !this.api.validateExpiry(attrs.card.exp_month.toString(), attrs.card.exp_year.toString()))
                return "Invalid expiration.";

            if (attrs.card.cvc && !this.api.validateCVC(attrs.card.cvc.toString()))
                return "Invalid CVC";
        }
    },
    save: function(options) {
        options = options || {};

        if (!this.isValid())
            return false;

        options.error = Backbone.wrapError(options.error, this, options);
        options.success = this.wrapSuccess(options.success, options);

        this.api.createToken(
            this.attributes.card,
            this.attributes.amount,
            options.success);

        return true;
    },
    fetch: function(options) {
        options = options || {};

        options.error = Backbone.wrapError(options.error, this, options);
        options.success = this.wrapSuccess(options.success, options);

        return this.api.getToken(this.id, options.success);
    },
    wrapSuccess: function(onSuccess, options) {
        var model = this;

        return function(status, resp) {
            if (status !== 200)
                return options.error(model, resp);

            var serverAttrs = model.parse(resp);

            if (!model.set(serverAttrs, options))
                return false;
       
            if (onSuccess)
                onSuccess(model, resp, options);

            model.trigger('sync', model, resp, options);
        };
    }
});
