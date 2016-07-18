(function() {
    'use strict';
//core.services.rest
    angular.module('workshopApp.core.services.rest').
        factory('urlFactory', UrlFactory);

    UrlFactory.$inject = ['config', 'urlList'];
    function UrlFactory(config, urlList) {

        var URL_PATTERN = /{{(.+?)}}/g,

            /**
             * In case a single value is passed instead of a full object, will guess the parameter name from the URL.
             *
             * Example:
             *
             *     urlFactory.getUrl('agency', 123);
             *
             * is equivalent to:
             *
             *     urlFactory.getUrl('agency', {agencyId: 123});
             */
            convertSingleValueToObject = function (parameters, templateParameters) {
                var key = templateParameters[1],
                    value = parameters;
                parameters = {};

                if (key) {
                    parameters[key] = value;
                }

                return parameters;
            },

            extractParameterNamesFromTemplate = function (urlTemplate) {
                var templateParameters = [],
                    match;

                while ((match = URL_PATTERN.exec(urlTemplate)) !== null) {
                    templateParameters.push(match[1]);
                }

                return templateParameters;
            },

            encodeParameterValue = function (value) {
                if (value && value._isAopDate) {
                    return value.toISOString();
                } else {
                    return encodeURIComponent(value);
                }
            },

            /**
             * Default behavior, when the parameter has one single value
             */
            encodeSingleParameter = function (key, value) {
                return encodeURIComponent(key) + '=' + encodeParameterValue(value);
            },

            /**
             * When the parameter has more than one value (see DMA codes for example)
             */
            encodeArrayParameter = function (key, array) {
                return _.map(array, function (value) {
                    return encodeSingleParameter(key, value);
                }).join('&');
            },

            encodeParameters = function (parameters, templateParameters) {
                return _(parameters).
                    keys().
                    sortBy().
                    difference(templateParameters).
                    map(function (key) {
                        var value = parameters[key];
                        if (_.isArray(value)) {
                            return encodeArrayParameter(key, value);
                        } else {
                            return encodeSingleParameter(key, value);
                        }
                    }).
                    join('&');
            },

            /**
             * Attaches the config to the parameters to have access to endpoints configuration
             */
            parametersWithConfigs = function (parameters) {
                return _.chain(parameters).
                    clone().
                    assign({ config: config }).
                    value();
            },

            compileUrlTemplate = function (urlTemplate, parameters, options) {
                var templateParameters = extractParameterNamesFromTemplate(urlTemplate),
                    url;

                options = options || {};

                if (!_.isObject(parameters)) {
                    parameters = convertSingleValueToObject(parameters, templateParameters);
                } else {
                    parameters = _.omit(parameters, _.isUndefined);
                }

                url = _.template(urlTemplate, {interpolate: URL_PATTERN})(parametersWithConfigs(parameters));

                if (options.format) {
                    url += '.' + options.format;
                }

                if (options.pagination && parameters.count) {
                    parameters.offset = (parameters.page || 0) * parameters.count;
                    delete parameters.page;
                }

                var formattedParams = encodeParameters(parameters, templateParameters);

                if (formattedParams) {
                    url += '?' + formattedParams;
                }

                return url;
            },

            /**
             * Determines which template to use for `name`
             */
            getUrl = function (name, parameters, options) {
                var urlsForName = urlList[name];

                if (_.isString(urlsForName)) {
                    return compileUrlTemplate(urlsForName, parameters, options);
                } else {
                    for (var i = 0; i < urlsForName.length; i++) {
                        try {
                            return compileUrlTemplate(urlsForName[i], parameters, options);
                        } catch (err) {
                            // explicitly ignored
                            // compileUrlTemplate will throw an exception if a value is missing
                            // so we try the next one in the list
                        }
                    }

                    throw new Error('No url matches');
                }
            };

        return {
            getUrl: getUrl,
            compileUrlTemplate: compileUrlTemplate
        };
    }
})();
