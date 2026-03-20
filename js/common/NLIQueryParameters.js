// Copyright 2019-2026, University of Colorado Boulder

/**
 * query parameters supported by this simulation
 *
 * @author Arnab Purkayastha
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const NLIQueryParameters = QueryStringMachine.getAll( {

  /**
   * Query parameter that can be used to make the sim default to Celsius instead of Fahrenheit at startup, added
   * because it has been requested by users in the past (see https://github.com/phetsims/states-of-matter/issues/216)
   * This is public facing.
   */
  defaultCelsius: {
    type: 'flag',
    public: true
  }

} );

export default NLIQueryParameters;
