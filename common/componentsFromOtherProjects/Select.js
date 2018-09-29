const React = require('react');
const Select = require('react-select');
const i18n = require('../lib/i18n');
const _ = require('lodash');

const Wrapper = Component => class Wrapper extends React.Component {
	render () {
		const overridingProps = {};
		if (this.props.groups) {
			overridingProps.filterOptions = groupStuff.filterOptions;
			overridingProps.optionRenderer = groupStuff.optionRenderer;
			overridingProps.onChange = groupStuff.onChange.bind(this, this.props.onChange);
		}
		const props = _.extend({}, defaultProps, this.props, overridingProps);
		return <Component cache={false} {...props} />; //TODO reenable cache when new react-select is released (https://github.com/JedWatson/react-select/pull/1241)
	}
};

const defaultProps = {
	placeholder: i18n.__('please_select'),
	searchingText: i18n.__('search_labels.searching'),
	noResultsText: i18n.__('search_labels.no_results'),
	loadingPlaceholder: i18n.__('search_labels.searching'),
	searchPromptText: i18n.__('search_labels.type_to_search'),
	backspaceToRemoveMessage: '', // i18n.__('search_labels.backspace_to_remove') use this to show a hint to remove elements
	promptTextCreator: (label) => i18n.__('search_labels.create_new_option', label)
};

const groupStuff = {
	filterOptions: function (options, filter, currentValues) {
		//TODO that only works for select boxes with single values.
		//To properly use it on multi values the function must get rid of currentValues in the options
		filter = filter ? filter.toLowerCase() : '';
		return _(options).map(function (group) {
			let matchingChildren = _.filter(group.children, function (child) {
				return child && child.label && child.label.toLowerCase().indexOf(filter) !== -1;
			});
			if (matchingChildren.length) {
				return _.concat([{ value: group.value, label: group.label, isGroupHeader: true }], matchingChildren);
			}
			return [];
		}).flatten().value();
	},
	/**
	 * Takes care of rendering group headers and items in a different way
	 * @param  {Object} option [description]
	 * @return {[type]}        [description]
	 */
	optionRenderer: function optionRenderer (option) {
		if (option.isGroupHeader) {
			return <span className='group-header'>{option.label}</span>;
		}
		return <span className='group-item'>{option.label}</span>;
	},
	onChange: function (onChange, value) {
		if (_.isArray(value)) {
			onChange(_.reject(value, v => v.isGroupHeader));
		} else if (!value) {
			onChange(value);
		} else if (!value.isGroupHeader) {
			onChange(value);
		}
	}
};

module.exports = Wrapper(Select);
module.exports.Async = Wrapper(Select.Async);
module.exports.Creatable = Wrapper(Select.Creatable);
module.exports.AsyncCreatable = Wrapper(Select.AsyncCreatable);

