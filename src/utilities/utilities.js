import currencySymbols from './currencySymbols.json';

export const utilities = {
    currencySymbols: currencySymbols,
    getCurrencySymbol: function (currencyISOCode) {
        //returns the symbol of the given ISO code if it exists, or it returns the ISO code itself
        return this.currencySymbols[currencyISOCode] || currencyISOCode;
    },

    getLocaleAmount: function (amount, currency) {
        var formatter = new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency,
            currencyDisplay: "code"
        });
        return formatter.format(amount).replace(/[a-z]{3}/i, "").trim();
    },

    isMobile: function () {
        return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    },

    getImageContainedSize: function(image, maxWidth, maxHeight) {
        let initialHeight = maxHeight || image.height;
        let initialWidth = maxWidth || image.width;
        let ratio = image.naturalWidth / image.naturalHeight;
        let width = initialHeight * ratio;
        let height = initialHeight;
        if (width > initialWidth) {
            width = initialWidth;
            height = initialWidth / ratio;
        }
        return {width, height};
    },

    copyFieldsFromObjectToObject: function(sourceObject, targetObject) {
        Object.keys(sourceObject).forEach(field => {
            targetObject[field] = sourceObject[field];
        });
    }
};