// Copyright 2019, University of Colorado Boulder

/**
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );

  class NLIScenesScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super();

      const resetAllButton = new ResetAllButton( {
        listener: () => {
          model.reset();
        },
        right: this.layoutBounds.maxX - 10,
        bottom: this.layoutBounds.maxY - 10
      } );
      this.addChild( resetAllButton );
    }

    // @public
    step( dt ) {
      //TODO Handle view animation here.
    }
  }

  return numberLineIntegers.register( 'NLIScenesScreenView', NLIScenesScreenView );
} );