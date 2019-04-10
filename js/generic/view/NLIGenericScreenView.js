// Copyright 2019, University of Colorado Boulder

/**
 * view of the "Generic" screen for the Number Line Integers simulation
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PointControllerNode = require( 'NUMBER_LINE_INTEGERS/common/view/PointControllerNode' );
  const NLIConstants = require( 'NUMBER_LINE_INTEGERS/common/NLIConstants' );
  const NumberLineNode = require( 'NUMBER_LINE_INTEGERS/common/view/NumberLineNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ScreenView = require( 'JOIST/ScreenView' );

  // constants
  const POINT_CONTROLLER_COLOR_LIST = [ new Color( 'blue' ), new Color( 'magenta' ), new Color( 'orange' ) ];

  class NLIGenericScreenView extends ScreenView {

    /**
     * @param {NumberLineIntegersModel} model
     */
    constructor( model ) {

      super( { layoutBounds: NLIConstants.NLI_BOUNDS } );

      // NOTE: There is no model-view transform for this sim.  Model and view space use the same coordinate system.

      // add the number line node
      this.addChild( new NumberLineNode( model.numberLine, this.layoutBounds.dilated( -70 ) ) );

      // add the box where the point controllers hang out when not in use
      const pointControllerBoxNode = new Rectangle( model.pointControllerBox, {
        fill: 'white',
        stroke: 'black',
        cornerRadius: 6
      } );
      this.addChild( pointControllerBoxNode );

      // add the point controller nodes
      assert && assert( model.pointControllers.length === POINT_CONTROLLER_COLOR_LIST.length );
      model.pointControllers.forEach( ( pointController, index ) => {
        this.addChild( new PointControllerNode( pointController, { baseColor: POINT_CONTROLLER_COLOR_LIST[ index ] } ) );
      } );

      // reset all button
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

  return numberLineIntegers.register( 'NLIGenericScreenView', NLIGenericScreenView );
} );