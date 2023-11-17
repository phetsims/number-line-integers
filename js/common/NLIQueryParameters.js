// Copyright 2019-2023, University of Colorado Boulder

/**
 * query parameters supported by this simulation
 *
 * @author Arnab Purkayastha
 */

import numberLineIntegers from '../numberLineIntegers.js';

export const USA_QUERY_VALUE = 'usa';
export const AFRICA_QUERY_VALUE = 'africa';
export const AFRICA_MODEST_QUERY_VALUE = 'africaModest';
export const ASIA_QUERY_VALUE = 'asia';
export const LATIN_AMERICA_QUERY_VALUE = 'latinAmerica';
export const OCEANIA_QUERY_VALUE = 'oceania';
export const MULTICULTURAL_QUERY_VALUE = 'multi';

const NLIQueryParameters = QueryStringMachine.getAll( {

  /**
   * Query parameter that can be used to make the sim default to Celsius instead of Fahrenheit at startup, added
   * because it has been requested by users in the past (see https://github.com/phetsims/states-of-matter/issues/216)
   * This is public facing.
   */
  defaultCelsius: {
    type: 'flag',
    public: true
  },

  // This query parameter sets the region and culture portrayal for the sim. This changes the artwork for the character
  // sets that appear throughout the sim.
  regionAndCulture: {
    type: 'string',
    validValues: [ MULTICULTURAL_QUERY_VALUE, AFRICA_QUERY_VALUE, AFRICA_MODEST_QUERY_VALUE, ASIA_QUERY_VALUE, LATIN_AMERICA_QUERY_VALUE, OCEANIA_QUERY_VALUE, USA_QUERY_VALUE ],
    defaultValue: MULTICULTURAL_QUERY_VALUE
  }

} );

numberLineIntegers.register( 'NLIQueryParameters', NLIQueryParameters );
export default NLIQueryParameters;